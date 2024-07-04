var mongoClient = null;
var collection, msg;

/* This collection has indexes on property_type, room_type, and beds.
   But, you can only use an index if the first field in the index is in
   the query */


async function get_IndexDemo(req, res) {

    var query = { beds: 11 };
    var projection = { _id: 1 };
    var rval = msg;

    system.timerStart()
    nDocs = await collection.countDocuments(query);
    var taken = system.timerEnd();

    rval += "Query " + JSON.stringify(query) + " with index took approx " +
        taken + " ms to find " + nDocs + " records\n";

    query = { bedrooms: 8 };

    system.timerStart()
    nDocs = await collection.countDocuments(query);
    taken = system.timerEnd();

    rval += "Query " + JSON.stringify(query) + " with NO index took approx " +
        taken + " ms to find " + nDocs + " records\n";

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