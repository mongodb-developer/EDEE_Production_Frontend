var mongoClient = null;
var sales;
var validatorSpec;

// Try editing both the schema definition or the data and see how
// writes fail if they don't match. 
// This code is using JSON.parse rather then EJSON.parse or Document.parse()
// so there is no way to express most data types - thus the code converts
// the date to an Explicit Date object

var properties = {};
properties._id = { bsonType: "objectId" };
properties.quantity = { bsonType: "int", minimum: 1 };
properties.price = { bsonType: "double" };
properties.date = { bsonType: "date" };
const jsonSchema = {
  bsonType: "object",
  required: ["_id", "quantity", "price", "date"],
  properties: properties,
};

// Post the data -  If it doesn't match the description it will fail.
async function post_Data(req, res) {
  doc = JSON.parse(req.body);

  // Comment out lines below to see types enforced
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

  // Create the collection and apply validation
  // Ignore failure if it already exists

  await sales.drop();
  validatorSpec = { $jsonSchema: jsonSchema };
  rval = await db.createCollection("sales", { validator: validatorSpec });
}
