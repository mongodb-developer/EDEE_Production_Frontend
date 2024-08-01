var mongoClient = null;
var collection;

// ℹ️ search in all fields, but now you can make up to two typos
// try with: "niu york", "bouston", etc.

async function get_AtlasSearch(req, res) {
  var queryTerm = req.query.get("queryTerm");
  var path = { wildcard: "*" };

  var searchOperation = {
    $search: {
      text: {
        query: queryTerm,
        path: path,
        fuzzy: {
          maxEdits: 2, //Allow for 2 typos
        }
      }
    }
  };

  var projection = {
    $project: {
      amenities: false,  images: false, availability: false,
      review_scores: false, host: false, reviews: false },
  };

  // $search is used as the first stage to the $aggregate command.
  // We are using $project to remove some fields we don't want.
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
    "mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net"
  );
  collection = mongoClient
    .getDatabase("sample_airbnb")
    .getCollection("listingsAndReviews");
}
