var mongoClient = null;
var database;

async function post_SQL(req, res) {
  var query = req.body;
  results = await database.sql(query);
  res.status(200);
  res.send(results);
}

async function initWebService() {
  var userName = await system.getenv("MONGO_USERNAME");
  var passWord = await system.getenv("MONGO_PASSWORD", true);
  mongoClient = new MongoClient(
    "mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net",
  );
  database = mongoClient
    .getDatabase("sample_airbnb");
}
