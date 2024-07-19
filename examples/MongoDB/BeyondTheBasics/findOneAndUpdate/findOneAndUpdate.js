var mongoClient = null;
var sequenceCollection;

async function post_Sequence(req, res) {
  sequenceName = req.query.get("id");
  if (sequenceName == null || sequenceName == "") {
    sequenceName = "default";
  }

  var query = { _id: sequenceName };
  var updateOps = { $inc: { count: 1 } };
  
  // Can add projections, sort, and options too
  var options = { upsert: true, returnNewDocument: true };

  // Use `findOneAndUpdate` to update and fetch the before or after record.
  // If you did `update()` then `find()` you might get a race condition where
  // another thread increments the counter again before you read back the new
  // value.

  console.log(`Query: ${JSON.stringify(query)}
Update: ${JSON.stringify(updateOps)} 
Options: ${JSON.stringify(options)}`);
  var rval = await sequenceCollection.findOneAndUpdate(
    query,
    updateOps,
    options,
  );

  res.status(204);
  res.send(rval);
}

async function initWebService() {
  var userName = await system.getenv("MONGO_USERNAME");
  var passWord = await system.getenv("MONGO_PASSWORD", true);
  mongoClient = new MongoClient(
    "mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net",
  );

  sequenceCollection = mongoClient
    .getDatabase("test")
    .getCollection("sequences");
}
