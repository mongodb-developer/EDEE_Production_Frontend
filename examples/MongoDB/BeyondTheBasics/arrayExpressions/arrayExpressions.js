var mongoClient = null;
var arrayExample;

async function get_Data(req, res) {
  var query = {};

  // Select document that have small circles
  specification = { shape: "circle", size: "small" };
  query.components = { $elemMatch: specification };

  // $elemMatch doesn't exist as an expression,
  // have to use $filter to make it only return the small circles

  smallCircles = {
    $and: [
      { $eq: ["$$this.shape", "circle"] },
      { $eq: ["$$this.size", "small"] },
    ],
  };
  arrayFilter = { $filter: { input: "$components", cond: smallCircles } };
  projection = { components: arrayFilter };

  console.log(`Query: ${JSON.stringify(query)}
Projection: ${JSON.stringify(projection)}`);
  var result = await arrayExample.find(query, projection).toArray();
  res.status(200);
  res.send(result);
}

// Generate example data
async function post_Data(req, res) {
  if ((await arrayExample.countDocuments()) != 10) {
    docs = JSON.parse(req.body);
    rval = await arrayExample.insertMany(docs);
    res.status(201);
    res.send(rval);
  } else {
    res.status(200);
    res.send({ ok: 1, msg: "No new data loaded" });
  }
}

async function initWebService() {
  var userName = await system.getenv("MONGO_USERNAME");
  var passWord = await system.getenv("MONGO_PASSWORD", true);
  mongoClient = new MongoClient(
    "mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net",
  );
  arrayExample = mongoClient.getDatabase("examples").getCollection("arrays");
}
