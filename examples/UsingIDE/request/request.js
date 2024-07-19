// POST endpoint is passed the POST data in `body`

// Click on "Explanation" to see the challenge

function post_Echo(req, res) {
  // Request `body` (POST data) is a string.
  var bodyString = req.body;
  // JSON, EJSON or Document classes can parse JSON data to an object
  var bodyObj = JSON.parse(bodyString);
  res.status(200);
  res.send({ echo: bodyObj });
}

function get_Echo(req, res) {
  // `req.query` contains query parameters from the URL
  var value = req.query.get("value");
  res.status(200);
  res.send({ echo: value });
}
