var mongoClient = null;
var collection;

// ℹ️ we can use multiple operators in a single search with 'compound'

async function get_AtlasSearch(req, res) {
  var queryTerm = req.query.get("queryTerm");

  var queryTermInDescription = {
    text: {
      query: queryTerm,
      path: "description",
    },
  };

  var holds5To10 = {
    range: {
      path: "accommodates",
      gte: 5,
      lte: 10,
    },
  };

  var searchOperation = {
    $search: {
      compound: {
        must: [queryTermInDescription], //All must be true
        should: [holds5To10], // Optional - but adds to scoring, or can require 
                              // N entries to match
      },
    },
  };

  var projection = { $project: { 
      accommodates: 1, name: 1, description: 1, "address.market": 1 } };
  console.log(`Search Operation: ${JSON.stringify(searchOperation)}
Projection: ${JSON.stringify(projection)}`);
  var searchResultsCursor = collection.aggregate([searchOperation, projection]);
  var searchResult = await searchResultsCursor.toArray();
  res.status(201);
  res.send(searchResult);
}

// Connect to MongoDB Atlas
async function initWebService() {
  var userName = await system.getenv("MONGO_USERNAME");
  var passWord = await system.getenv("MONGO_PASSWORD", true);

  mongoClient = new MongoClient(
    "mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net",
  );
  collection = mongoClient
    .getDatabase("sample_airbnb")
    .getCollection("listingsAndReviews");
}
