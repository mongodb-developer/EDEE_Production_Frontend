var mongoClient = null;
var aiService = null


async function post_Prompt(req, res) {
  var post = JSON.parse(req.body);

  // Run a Generative AI prompt and show the response.
  // This isn't MongoDB functionality but can be used with it

  var response = await aiService.promptToText(post.prompt)
  res.status(200);
  res.send(response);  
}


async function initWebService() {
    var userName = await system.getenv("MONGO_USERNAME");
    var passWord = await system.getenv("MONGO_PASSWORD", true);
    mongoClient = new MongoClient(
      "mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net",
    );
    // This can be any third-party LLM/AI System
    aiService = new AIService({authentication: mongoClient});
  }
  