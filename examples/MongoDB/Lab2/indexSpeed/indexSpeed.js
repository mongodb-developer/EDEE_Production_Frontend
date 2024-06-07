var mongoClient = null;
var collection, msg;

/* In this collection, the field containing the total number of
   beds in the property is indexed, while the number of bedrooms
   is not.
   
   You can only use an index if the first field in the index is in
   the query */

async function get_IndexDemo(req, res) {

    var rval = msg;

    //Get execution time and number of results with index
    var query = { beds: 11 };
    result = await collection.find(query).explain('executionStats');
    var indexTime = result.executionStats.executionTimeMillis;
    indexTime = (indexTime === 0) ? 1 : indexTime;
    rval += "Query " + JSON.stringify(query) +  " with index took " + 
        indexTime + " ms to find " + result.executionStats.nReturned + " records\n";
    
    //Get execution time and number of results without index
    query = { bedrooms: 8 };
    result = await collection.find(query).explain('executionStats');
    var nonIndexTime = result.executionStats.executionTimeMillis
    nonIndexTime = (nonIndexTime === 0) ? 1 : nonIndexTime;
    rval += "Query " + JSON.stringify(query) + " with NO index took approx " + 
        nonIndexTime + " ms to find " + result.executionStats.nReturned + " records\n";

    rval += "\nTimes do NOT include server roundtrip time." +
       
    res.header("Content-Type", "text/plain");
    res.send(rval);
   
}

async function initWebService() {
    var userName = await system.getenv("MONGO_USERNAME");
    var passWord = await system.getenv("MONGO_PASSWORD", true);

    mongoClient = new MongoClient(
        "mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net",
    );
    collection = mongoClient.getDatabase("sample_airbnb")
        .getCollection("largeCollection");
    await mongoClient.ping();
    
    msg = "Check Instructions for more info.\n\n";
}
