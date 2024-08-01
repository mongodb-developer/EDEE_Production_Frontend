var mongoClient = null;
var collection;

// ℹ️ we use range to get rentals for a group of 5 to 10 people

async function get_AtlasSearch(req, res) {
  var path = "accommodates";
  var maxPeople = 10;
  var minPeople = 5;

  var searchOperation = {
    $search: {
      range: {
        path: path,
        gte: minPeople,
        lte: maxPeople,
      },
    },
  };

  var projection = { $project: { 
      accommodates: 1, name: 1, "address.market": 1 } };

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
    "mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net",
  );
  collection = mongoClient
    .getDatabase("sample_airbnb")
    .getCollection("listingsAndReviews");
}
