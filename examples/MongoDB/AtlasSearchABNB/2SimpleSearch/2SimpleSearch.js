var mongoClient = null;
var collection;

// ℹ️ searching rentals, here we're just searching in the "summary" field of 
// each document

async function get_AtlasSearch(req, res) {
  var queryTerm = req.query.get("queryTerm");
  var path = "summary"; // here we search just in one field

  var searchOperation = {
    $search: {
      index: "default", // If default we don't explicitly need to specify it
      text: { query: queryTerm, path: path },
    },
  };

  var projection = {
    $project: {
      amenities: false, images: false, availability: false,
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
