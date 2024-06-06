var mongoClient = null;
var viewCollection;

// See who has viewed the property
async function get_PropertyViews(request, response) {
  var propertyId = request.params[3]; 

  var query = Filters.eq("propertyId", propertyId);
  var data = await viewCollection.find(query).toArray();

  response.status(202);
  response.send(data);
}

// Every time this  endpoint is called - add the ip of request
// to a list and increment the number of view by one.
async function post_PropertyViews(request, response) {
  var propertyId = request.params[3]; 
  var sourceIp = request.sourceIp; // simulated value

  // As we have many documentsfor the same propertyId value we no longer put 
  // it in _id, we let MongoDB assign an _id
  
  var query = Filters.eq("propertyId", propertyId)
    .append("nViews", Filters.lt(8)); // Limit each bucket to 8 visits

  var setDate = Updates.set("lastView", new Date)
  var incrementViewCount = Updates.inc("nViews", 1);
  var addSourceIpToList = Updates.push("viewIp", sourceIp)

  var updateOptions = new UpdateOptions();
  updateOptions.upsert = true;
  
  var rval = await viewCollection.updateOne(query,
    Updates.combine(setDate,
      incrementViewCount,
      addSourceIpToList),
      updateOptions );

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
  // await viewCollection.drop();
}
