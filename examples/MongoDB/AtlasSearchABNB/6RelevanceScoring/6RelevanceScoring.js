var mongoClient = null;
var collection;

// ℹ️ we can see the relevance score of each search

async function get_AtlasSearch(req, res) {
  var queryTerm = req.query.get("queryTerm");

  var queryTermInDescription = { text: {query: queryTerm, 
        path: "description" }};
  var holds5To10 = {range: { path: "accommodates", gt: 5, lt: 10} };

  var searchOperation = { $search: {
      compound: {
        must: [ queryTermInDescription ], //All must be true
        should: [ holds5To10 ], // Influences relevnace score
      }
  }};

  // Basic list of fields we want to see
  var fieldsToProject = { 
        accommodates: 1, description: 1, name: 1, "address.market": 1 };

  //Add $meta: "searchScore" to the projection to get the relevancy score
  fieldsToProject.score = { $meta: "searchScore" };

  var projection = {  $project: fieldsToProject };
  console.log(`Search Operation: ${JSON.stringify(searchOperation)}
Projection: ${JSON.stringify(projection)}`);
  var searchResultsCursor = collection.aggregate(
        [ searchOperation, projection ]);
  var searchResult = await searchResultsCursor.toArray();
  res.status(201);
  res.send(searchResult);
}

// Connect to MongoDB Atlas
async function initWebService() {
  var userName = await system.getenv("MONGO_USERNAME");
  var passWord = await system.getenv("MONGO_PASSWORD", true);

  mongoClient = new MongoClient(
    "mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net"
  );
  collection = mongoClient
    .getDatabase("sample_airbnb")
    .getCollection("listingsAndReviews");
}
