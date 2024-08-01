var mongoClient = null;
var listingsCollection;

// ℹ️ Create a Search Index - this will fail on sample_AirBNB as it's read only.
// But, the search indexes already exists. Using the GET method you can have a 
// peek at how the index is defined

async function post_AtlasSearch(req, res) {
  var rval = {};
  var requestObj = JSON.parse(req.body);

  var indexName = requestObj.index.name;
  var indexDefinition = requestObj.index.definition;

  try {
    // Delete the index if it exists - will fail on read-only data
    rval.drop = await listingsCollection.dropSearchIndex({ name: indexName });
  } catch (e) {
    rval.drop = e.message;
  }

  try {
    // Create the new Search index - will fail on read-only data
    console.log(`Index Definition: ${JSON.stringify(indexDefinition)}
Projection: ${JSON.stringify(projection)}`);
    rval.index = await listingsCollection.createSearchIndex(indexName,
        indexDefinition);
  } catch (e) {
    rval.index = e.message;
  }

  res.status(201);
  res.send(rval);
}

// List all the indexes

async function get_AtlasSearch(req, res) {
  var rval = {};

  rval.searchIndexes = await listingsCollection.listSearchIndexes();

  res.status(201);
  res.send(rval);
}

// Connect to MongoDB Atlas
async function initWebService() {
  var userName = await system.getenv("MONGO_USERNAME");
  var passWord = await system.getenv("MONGO_PASSWORD", true);

  mongoClient = new MongoClient(
    "mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net",
  );
  listingsCollection = mongoClient
    .getDatabase("sample_airbnb")
    .getCollection("listingsAndReviews");
}
