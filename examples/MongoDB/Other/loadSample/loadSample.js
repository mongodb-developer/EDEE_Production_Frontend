var mongoClient = null;
var db, collection;

async function post_Highscores(req, res) {
  var schema = [
    "first_name",
    "last_name",
    "email",
    "country",
    "ip_address",
    "timestamp",
    "score",
  ];
  var docs = [];
  await collection.drop(); // Remove this to load more

  var players = JSON.parse(req.body);
  for (var player of players) {
    var doc = {};
    for (var field of schema) {
      doc[field] = player[field];
    }

    // Data types where needed - Dates and Integers (Int32)
    doc.timestamp = new Date(doc.timestamp);
    doc.score = new Integer(doc.score);
    docs.push(doc);
  }
  console.log(`Docs: ${JSON.stringify(docs)}`);
  var rval = await collection.insertMany(docs);
  res.status(201);
  res.send(rval);
}

async function get_Highscores(req, res) {
  if (req.query.get("count") == "true") {
    var count = await collection.countDocuments({});
    res.status(200);
    res.send({ nDocs: count });
  } else {
    var query = {};
    //query.country = "Greece"
    console.log(`Query: ${JSON.stringify(query)}`);
    var cursor = collection.find(query);
    var data = await cursor.toArray();
    res.status(200);
    res.send(data);
  }
}

async function initWebService() {
  var userName = await system.getenv("MONGO_USERNAME");
  var passWord = await system.getenv("MONGO_PASSWORD", true);
  mongoClient = new MongoClient(
    "mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net",
  );

  db = mongoClient.getDatabase("game");
  collection = db.getCollection("highscores");
}