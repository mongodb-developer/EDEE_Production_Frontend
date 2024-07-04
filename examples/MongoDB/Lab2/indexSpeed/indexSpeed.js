var mongoClient = null;
var collection, msg;

/* This collection has indexes on property_type, room_type, and beds.
   But, you can only use an index if the first field in the index is in
   the query */


async function get_IndexDemo(req, res) {

    var query = { beds: 11 };
    var projection = { _id: 1 };
    var rval = msg;

    result = await collection.countDocuments(query, true);

    rval += "Query " + JSON.stringify(query) + " with index took approx " +
        result.ms + " ms to find " + result.message + " records\n";

    query = { bedrooms: 8 };

    result = await collection.countDocuments(query, true);

    rval += "Query " + JSON.stringify(query) + " with NO index took approx " +
        result.ms + " ms to find " + result.message + " records\n";

    res.header("Content-Type", "text/plain");
    //res.header("Server-ping-time", mongoClient.getPingTime() + "ms (approx.)");

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