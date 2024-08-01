var mongoClient = null;
var listingsCollection;

// Find out what Cheap, Medium and Expensive means in 
// Terms of AyrBNB Prices - compute the price for 3 days.
// Add a cleaning fee then break into 3 ranges (buckets)

async function get_Cohorts(req, res) {
  // Calculate the total price for 3 nights
  var priceFor3Days = { $add: ["$cleaning_fee", { $multiply: ["$price", 3] }] };

  var outputSpec = {};
  outputSpec.totalProperties = { $count: {} };
  outputSpec.averageBeds = { $avg: "$beds" };
  outputSpec.totalWithPool = {
    $sum: { $cond: { if: { $in: ["Pool", "$amenities"] }, then: 1, else: 0 } },
  };
  outputSpec.medianPrice = { $median:  {
      input: priceFor3Days, method: "approximate" }};

  // 3 Groups, Based on price, output as specified.
  var cohortDefinition = { groupBy: priceFor3Days, 
        buckets: 3, output: outputSpec };

  var bucketAutoStage = { $bucketAuto: cohortDefinition };

  // For each cohort , compute the percentage that have a pool
  percentWithPool = {
    $set: {
      percentWithPool: {
        $multiply: [{ $divide: ["$totalWithPool", "$totalProperties"] }, 100],
      },
    },
  };

  // Rename the groupBy _id field to priceRange
  var renameId = { $set: { priceRange: "$_id", _id: "$$REMOVE" } };
  var pipeline = [bucketAutoStage, percentWithPool, renameId];
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
    "mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net"
  );
  listingsCollection = mongoClient
    .getDatabase("sample_airbnb")
    .getCollection("listingsAndReviews");
}
