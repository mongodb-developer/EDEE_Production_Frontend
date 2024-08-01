var mongoClient = null;
var listingsCollection;


async function get_Dashboard(req, res) {

  // Change to Group by country + market (city)
  var groupByCountryAndMarket = { $group: { _id : {}, total: { $count:{}}}};

  // Calculate the price per bed 
  var pricePerBed = { $set : {} };

  // Group by country taking $topN values
  var groupByCountry = { $group : {} };

  // Add a sum of beds to sort by
  var addSumOfBeds = { $set: {} };

  // Sort by totalBeds
  var sortByTotalBeds = { $sort : {} };

  //Remove extra fields and clean up output
  var tidyUp = { $set: {} }; // or $project

  var pipeline = [
    groupByCountryAndMarket,
    // pricePerBed,
    // groupByCountry,
    // addSumOfBeds,
    // sortByTotalBeds,
    // tidyUp,
  ];
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
