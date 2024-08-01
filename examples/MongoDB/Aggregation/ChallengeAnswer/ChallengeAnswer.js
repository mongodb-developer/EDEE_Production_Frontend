var mongoClient = null;
var listingsCollection;

// Create a dashboard showing each country with the top 3 markets (towns)
// in that country ordered by number of properties
// For each market show the number of beds and the average basic price per bed
// Order the countries by the number of beds in those top three markets

async function get_Dashboard(req, res) {
  // Group by country and market
  var groupByCountryAndMarket = {
    $group: {
      _id: { country: "$address.country", market: "$address.market" },
      nBeds: { $sum: "$beds" },
      totalPrice: { $sum: "$price" },
    },
  };

  // Calculate the price per bed
  var pricePerBed = {
    $set: { pricePerBed: { $divide: ["$totalPrice", "$nBeds"] } },
  };

  // Group by country taking topN values
  var groupByCountry = {
    $group: {
      _id: "$_id.country",
      topMarkets: {
        $topN: {
          n: 3,
          sortBy: { nBeds: -1 },
          output: {
            market: "$_id.market",
            beds: "$nBeds",
            pricePerBed: "$pricePerBed",
          },
        },
      },
    },
  };

  // Add a sum to sort by
  var addSumOfBeds = { $set: { totalBeds: { $sum: "$topMarkets.beds" } } };

  // Sort by totalBeds
  var sortByTotalBeds = { $sort: { totalBeds: -1 } };

  //Remove extra fields and clean up output
  var tidyUp = {
    $set: { Country: "$_id", _id: "$$REMOVE", totalBeds: "$$REMOVE" },
  };

  var pipeline = [
    groupByCountryAndMarket,
    pricePerBed,
    groupByCountry,
    addSumOfBeds,
    sortByTotalBeds,
    tidyUp,
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
