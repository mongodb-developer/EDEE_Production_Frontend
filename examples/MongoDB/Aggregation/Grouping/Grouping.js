var mongoClient = null;
var listingsCollection;

// Find which countries have the largest number of beds per room

async function get_Countries(req, res) {

  groupOp = {};
  groupOp._id =  "$address.country" ; // _id is the field to GROUP BY
  groupOp.nProperties = { $count: {} };
  groupOp.totalBeds = { $sum: "$beds" };
  groupOp.totalRooms = { $sum: "$bedrooms" };

  groupStage = { $group: groupOp };

  // Add average beds per room field after grouping
  bedsPerRoomStage = {
    $set: { bedsPerRoom: { $divide: ["$totalBeds", "$totalRooms"] } },
  };

  // Sort by that new field
  sortByBedsPerRoom = { $sort: { bedsPerRoom: -1 } };

  getTop5 = { $limit: 5 };

  var pipeline = [groupStage, bedsPerRoomStage, sortByBedsPerRoom, getTop5];
  console.log(`Pipeline: ${JSON.stringify(pipeline)}`);
  var cursor = listingsCollection.aggregate(pipeline);
  var results = await cursor.toArray();
  res.status(200);
  res.send(results);
}

async function initWebService() {
  var userName = await system.getenv("MONGO_USERNAME");
  var passWord = await system.getenv("MONGO_PASSWORD", true);
  mongoClient = new MongoClient(
    "mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net",
  );
  listingsCollection = mongoClient
    .getDatabase("sample_airbnb")
    .getCollection("listingsAndReviews");
}
