var mongoClient = null;
var listingsCollection;

// Properties in the USA with a pool most expensive first.
// $match, $sort and $project stages are the same as a find()
// In this case aggregation isn't needed but you might start
// with a $match in a more useful aggregation.

async function get_Properties(req, res) {
  var query = { "address.country": "United States", amenities: "Pool" };
  var matchStage = { $match: query };

  var sortOrder = { price: -1 };
  var sortStage = { $sort: sortOrder };
  // Exclude some of the larger fields
  var projectionStage = {
    $project: {
      reviews: 0,
      host: 0,
      space: 0,
      availability: 0,
      description: 0,
    },
  };

  var pipeline = [matchStage, sortStage, projectionStage];
  console.log(`Pipeline: ${JSON.stringify(pipeline)}`);
  var cursor = listingsCollection.aggregate(pipeline);
  var results = await cursor.toArray();
  res.status(200);
  res.send(results);
}

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