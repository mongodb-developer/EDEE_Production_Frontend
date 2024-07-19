var mongoClient = null;
var viewCollection;

async function get_PropertyViews(req, res) {
  propertyId = req.params[3];
  query = { _id: propertyId };

  console.log(`Query: ${JSON.stringify(query)}`);
  var data = await viewCollection.find(query).toArray();
  res.status(202);
  res.send(data);
}

// Every time this is called - add the IP of the caller to a list and
// increment the number of views by 1.

async function post_PropertyViews(req, res) {
  var sourceIp = req.sourceIp; // Source of the requests
                               // (randomized in this simulator)
  propertyId = req.params[3];
  
  const time = new Date();
  const query = { 
    _id:  propertyId,
    nViews: { $lt: 8 } // Stop recording after 8 views
  };

  const updateOps = {
    $set: { lastView: time },
    $inc: { nViews: 1 },
    $push: { viewIp: sourceIp }
  };

  console.log(`Query: ${JSON.stringify(query)}
Update: ${JSON.stringify(updateOps)} `);
  var rval = await viewCollection.updateOne(query, updateOps);

  res.status(202);
  res.send(rval);
}

async function initWebService() {
  var userName = await system.getenv("MONGO_USERNAME");
  var passWord = await system.getenv("MONGO_PASSWORD", true);
  mongoClient = new MongoClient(
    "mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net"
  );
  viewCollection = mongoClient
    .getDatabase("example")
    .getCollection("advertViews");

  // Set up empty collection with one document
  await viewCollection.drop();
  const property = { _id: "PROP789", nViews: 0, viewIp: [] };
  await viewCollection.insertOne(property);
  console.log(`Added document to "example.advertViews" collection: ${
    JSON.stringify(property)}\n`);
}
