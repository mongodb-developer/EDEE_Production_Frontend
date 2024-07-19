var mongoClient = null;
var temperatureCollection;

// User POSTs to Cities to load data, GET Cities to see data - typical
// monthly temperatures for each city.
// Then Change URL and POST to AddSummary to update all the records 
// expressively.
// GET Cities again to see the changes.

// Click on "Explanation" to see the challenge

async function post_Cities(req, res) {
  await temperatureCollection.drop();
  docs = JSON.parse(req.body);
  rval = await temperatureCollection.insertMany(docs);
  res.status(201);
  res.send(rval);
}

async function get_Cities(req, res) {
  var query = {};
  var data = await temperatureCollection.find(query).toArray();
  res.status(200);
  res.send(data);
}

async function post_AddSummary(req, res) {
  query = {}; // Match everything
  summaryFields = {};
  summaryFields.mean = { $avg: "$monthly_temperatures" };
  summaryFields.max = { $max: "$monthly_temperatures" };
  summaryFields.months = { $size: "$monthly_temperatures" };

  expressiveUpdate = [{ $set: {summary: summaryFields }}]; // An Array shows 
                                                           // it's expressive
  console.log(`Query: ${JSON.stringify(query)}
Update: ${JSON.stringify(expressiveUpdate)}`);
  rval = await temperatureCollection.updateMany(query, expressiveUpdate);
  res.status(200);
  res.send(rval);
}

async function initWebService() {
  var userName = await system.getenv("MONGO_USERNAME");
  var passWord = await system.getenv("MONGO_PASSWORD", true);
  mongoClient = new MongoClient(
    "mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net",
  );
  temperatureCollection = mongoClient
    .getDatabase("examples")
    .getCollection("temperatureCollection");
  
}
