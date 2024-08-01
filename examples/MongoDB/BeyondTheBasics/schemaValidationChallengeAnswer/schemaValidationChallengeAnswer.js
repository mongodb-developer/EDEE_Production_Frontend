var mongoClient = null;
var sales;
var validatorSpec;

properties = {};
properties._id = { bsonType: "objectId" };
properties.quantity = { bsonType: "int", minimum: 1 };
properties.price = { bsonType: "double" };
properties.total = { bsonType: "double" };
properties.date = { bsonType: "date" };
jsonSchema = {
  bsonType: "object",
  required: ["_id", "quantity", "price", "date", "total"],
  properties: properties,
};

/* CHALLENGE: Make it so documents must contain a 'total' equal to quantity 
   times price.
   Not having the field, or the wrong value or type will fail.
   You need to add a $expr member to validatorSpec to do this */

// This is the ANSWER part

calcTotal = { $multiply: ["$price", "$quantity"] };
checkTotal = { $eq: ["$total", calcTotal] };
validatorSpec = { $jsonSchema: jsonSchema, $expr: checkTotal };

// POST the data - if it doesn't match the description it will fail.
async function post_Data(req, res) {
  doc = JSON.parse(req.body);

  //Comment out lines below to see type enforced
  if (doc.date) {
    doc.date = new Date(doc.date);
  } // Explicity cast to Date type

  console.log(`Doc: ${JSON.stringify(doc)}
Validation: ${JSON.stringify(validatorSpec)}`);
  rval = await sales.insertOne(doc);
  res.status(201);
  res.send(rval);
}

async function get_Data(req, res) {
  data = await sales.find({}).toArray();
  res.status(201);
  res.send(data);
}

async function initWebService() {
  var userName = await system.getenv("MONGO_USERNAME");
  var passWord = await system.getenv("MONGO_PASSWORD", true);
  mongoClient = new MongoClient(
    "mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net",
  );

  db = mongoClient.getDatabase("examples");
  sales = db.getCollection("sales");
  await sales.drop();
  rval = await db.createCollection("sales", { validator: validatorSpec });
}
