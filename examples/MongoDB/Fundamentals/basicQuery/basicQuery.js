var mongoClient = null;
var listingsCollection;
/* 
Challenge: Can you modify this to find the cheapest house 
in Canada with a pool (under amenities)? What suburb is it in?
*/
async function get_PropertyDetails(req, res) {
  // 5 Bedrooms or more in Turkey
  var query = {};
  query.beds = { $gte: 5 }; 
  query["address.country"] = "Turkey";

  var projection = { summary: true, beds: true,
    property_type: true, "address.market": true, price: true};

  // 1 for an ascending sort, -1 for descending
  var sortOrder = { price: -1 };

  console.log(`    Query: ${JSON.stringify(query)}
    Projection: ${JSON.stringify(projection)}
    Sort: ${JSON.stringify(sortOrder)}`);

  var cursor = listingsCollection
    .find(query, projection)
    .limit(10)
    .sort(sortOrder);

  var properties = await cursor.toArray();
  res.status(200);
  res.send(properties);
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
