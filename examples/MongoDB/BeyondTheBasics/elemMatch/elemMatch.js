var mongoClient = null;
var arrayExample;

// Click on "Explanation" to see the challenge

async function get_Data(req, res) {
  var query = {};

  // We want to fetch records with "large circles"/
  
  // Try the queries below

  // This returns too many as it is matching those two conditions independantly
  query = { "components.shape": "circle", "components.size": "large" };

  // This matches NOTHING as it's looking for this exact object
  // query.components = { shape: "circle", size: "large" };

  // This is correct as it applies the query to each element.
  // query.components  = { $elemMatch: { shape: "circle", size: "large" }} ;

  // projection = { "components.$": 1 }

  console.log(`Query: ${JSON.stringify(query)}`);
  var result = await arrayExample.find(query).toArray();
  res.status(200);
  res.send(result);
}

async function post_Data(req, res) {
  nDocs = await arrayExample.countDocuments();
  if (!nDocs) {
    docs = JSON.parse(req.body);
    console.log(`Inserting docs: ${JSON.stringify(docs)}`)
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
