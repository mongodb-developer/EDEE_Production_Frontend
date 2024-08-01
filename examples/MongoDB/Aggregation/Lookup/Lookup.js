var mongoClient = null;
var listingsCollection;

// Find the  warmest places right now by using $lookup against
// a collection containing current weather conditions

async function get_ByWeather(req, res) {
  lookupArgs = { from: "latestWeather", as: "latestWeather" };
  lookupArgs.localField = "address.market";
  lookupArgs.foreignField = "_id";
  lookupLatestWeather = { $lookup: lookupArgs };

  // Lookup makes an array as may match > 1
  removeArray = { $set: { latestWeather: { $first: "$latestWeather" } } };

  // Sort by Air temp
  warmestFirst = { $sort: { "latestWeather.airTemperature.value": -1 } };
  
  // Pretify - only use $project at the end
  var formatOutput = {
    $project: {
      name: 1,
      "address.market": 1,
      "address.suburb": 1,
      temperature: "$latestWeather.airTemperature.value",
    },
  };
  var pipeline = [lookupLatestWeather, removeArray, warmestFirst, formatOutput];
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
