var mongoClient = null;
var arrayExample;

async function get_Data(req, res) {
  var query = {};

  // WE WANT TO FETCH RECORDS WITH "LARGE CIRCLES"
  //Try the queries below

    // This returns too many as it is matching those two conditions independantly
   query = { "components.shape": "circle", "components.size": "large" };

  // This matches NOTHING as it's looking for this exact object
  // query.components = { shape: "circle", size: "large" };

  //  This is correct as it applies the query to each element.
  // query.components  = { $elemMatch: { shape: "circle", size: "small" }} ;

  var result = await arrayExample.find(query).toArray();
  res.status(200);
  res.send(result);
}

async function post_Data(req, res) {
  nDocs = await arrayExample.countDocuments();
  if (!nDocs) {
    docs = JSON.parse(req.body);
    rval = await arrayExample.insertMany(docs);
    res.status(201);
    res.send(rval);
  } else {
    res.status(200);
    res.send({ ok: 1, msg: "No new data loaded", docs: JSON.stringify(nDocs) });
  }
}

async function initWebService() {
  var userName = await system.getenv("MONGO_USERNAME");
  var passWord = await system.getenv("MONGO_PASSWORD", true);
  mongoClient = new MongoClient(
    "mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net"
  );
  arrayExample = mongoClient.getDatabase("examples").getCollection("arrays");
}
