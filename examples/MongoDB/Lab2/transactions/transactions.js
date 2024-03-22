// This is called once when the web service starts up
var mongoClient = null;
var db, collection;



async function post_createIndex(req, res) {
  var rval = null;
  var requestObj = JSON.parse(req.body);
  var db = mongoClient.getDatabase("game");
  var collection = db.getCollection("highscores");
  var indexDefinition = requestObj.definition;
  var name = requestObj.name;

  await collection.insertOne({ Country: "China" });
  var create = await collection.createIndex(name, indexDefinition);
  var list = await collection.listIndexes();
  var dropIndex = await collection.dropIndex(indexDefinition);
  var list2 = await collection.listIndexes();

  res.status(201);
  res.send({ create, list, dropIndex, list2 });
}

async function initWebService() {
  var userName = await system.getenv("MONGO_USERNAME");
  var passWord = await system.getenv("MONGO_PASSWORD", true);

  mongoClient = new MongoClient(
    "mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net",
  );
}