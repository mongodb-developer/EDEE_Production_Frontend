
var aiService = null
var mongoClient = null
var vacationTypeCollection = null
var fieldtoHoldVector = "embedding" 

// Vectors are an abstract numeric representation of the 'concept' of text or images
// When we add a document we can compute a vector and save it with it then we
// can query by 'concept'

async function post_VacationTypes(req, res) {
    var postData = JSON.parse(req.body);
    var vacationTypes = postData.vacationTypes

    for (let v of vacationTypes) {
        // Ask the AI To compute a vector (This isn't very fast each is 2 seconds)
        var vectorRepresentation = await aiService.textToVector(v.description)
        v[fieldtoHoldVector] = vectorRepresentation
    }
    var rval = await vacationTypeCollection.insertMany(vacationTypes);
    await createVectorIndex();

    res.status(201);
    res.send(rval);
}

async function get_VacationTypes(req, res) {
    var query = req.query.get("keywords")
    
    // Turn the query into a vector too.
    var queryAsAVector = await aiService.textToVector(query)

    const vectorQuery = [{
        '$vectorSearch': {
            'index': 'vectorIndex',
            'path': fieldtoHoldVector,
            'queryVector': queryAsAVector,
            'numCandidates': 200, // How many to consider in ANN algorithm
            'limit': 2
        }
    },
    { $project: { embedding: 0 } }]

    results = await vacationTypeCollection.aggregate(vectorQuery).toArray();
    
    // Query using the vector to find records with the same concept
    emailText = await  aiService.promptToText("Write a marketing email suggesting why " +
        "the customer should take this type of vacation " +
        JSON.stringify(results[0]))
    
    emailText=emailText.replace(/\n/g,' ');
    res.status(201);
    res.send({ emailText, results });
}

async function createVectorIndex() {
    //You can make more complex indexes including combining with boolean filtering
    const indexDefinition = {
        fields: [{
            path: fieldtoHoldVector,
            numDimensions: 1024,
            similarity: "cosine",
            type: "vector"
        }]
    }

    try {
        const index = await vacationTypeCollection.createSearchIndex("vectorIndex", indexDefinition)
        console.log("Created Vector Index " + JSON.stringify(index))
    }
    catch (e) {
        if (e.message.includes("Duplicate Index") == false) {
            console.log(e.message); // Ignore already existing indexes
        }
    }
}

async function initWebService() {
    var userName = await system.getenv("MONGO_USERNAME");
    var passWord = await system.getenv("MONGO_PASSWORD", true);
    mongoClient = new MongoClient(
        "mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net",
    );
    // This can be any third-party LLM/AI System
    aiService = new AIService({ authentication: mongoClient });
    vacationTypeCollection = mongoClient
        .getDatabase("test")
        .getCollection("vacation_types");

        /* Uncomment to restart with empty data
    try {
        await vacationTypeCollection.drop()
        await vacationTypeCollection.dropSearchIndex({ name: "descriptionVectors" })
    } catch (e) { }
    */



}
