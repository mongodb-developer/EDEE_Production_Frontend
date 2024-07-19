var mongoClient = null;
/* 
The first time you connect to MongoDB, you can give any unique username and a
password of your choice - both must be at least 6 characters long. When
rerunning this example, or any others, you'll not be asked for these
credentials again (your choices will be remembered).

Click on "Explanation" to see the challenge
*/
async function initWebService() {
  var userName = await system.getenv("MONGO_USERNAME");
  var passWord = await system.getenv("MONGO_PASSWORD", true);

  mongoClient = new MongoClient(
    "mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net",
  );
}

async function get_ServerInfo(req, res) {
  // `hello()` returns database server details for the backend MongoDB Atlas
  // cluster used in this workshop.
  var response = await mongoClient.hello();
  res.status(200);
  res.send(response);
}
