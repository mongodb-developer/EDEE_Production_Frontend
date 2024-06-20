var mongoClient = null;
var viewCollection;

// See who has viewed the property

async function get_PropertyViews(request, response) {
  var propertyId = request.params[3]; // from URL

  var query = Filters.eq("_id", propertyId);
  var data = await viewCollection.find(query).toArray();

  response.status(202);
  response.send(data);
}

// Every time this endpoint is called - add the ip of request
// to a list and increment the number of view by one.
async function post_PropertyViews(request, response) {
  var propertyId = request.params[3];
  var sourceIp = request.sourceIp; // simulated value

  // We can use append for a fluent API
  var query = Filters.eq("_id", propertyId)
    .append("nViews", Filters.lt(8)); // Record only first 8

  var setDate = Updates.set("lastView", new Date)
  var incrementViewCount = Updates.inc("nViews", 1);
  var addSourceIpToList = Updates.push("viewIp", sourceIp)

  var rval = await viewCollection.updateOne(query,
    Updates.combine(setDate,
      incrementViewCount,
      addSourceIpToList));
      
  response.status(202);
  response.send(rval);
}

async function initWebService() {
  var userName = await system.getenv("MONGO_USERNAME");
  var passWord = await system.getenv("MONGO_PASSWORD", true);
  mongoClient = new MongoClient(
    "mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net"
  );
  viewCollection = mongoClient
    .getDatabase("example")
    .getCollection("advertViews");

  // Set up empty collection with one document (Done with JS syntax)
  await viewCollection.drop();
  await viewCollection.insertOne({ _id: "PROP789", nViews: 0, viewIp: [] });
}
