// This is called once when the web service starts up
var mongoClient = null;

// Functions names starting with get_ or post_ are exposed as HTTP endpoints.
// Request and response objects are sent to each.
async function get_Movies(req, res) {
  db = mongoClient.getDatabase("sample_mflix");
  collection = db.getCollection("movies");

  var query = {};
  query.title = req.query.get("title");

  console.log(`Query: ${JSON.stringify(query)}`);
  cursor = collection.find(query);
  results = await cursor.toArray();

  res.status(200);
  res.send(results);
}

async function initWebService() {
  var userName = await system.getenv("MONGO_USERNAME");
  var passWord = await system.getenv("MONGO_PASSWORD", true);
  mongoClient = new MongoClient(
    "mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net"
  );
}