/*
Serverless web service hosting.

get_XXXX or post_XXXX define GET and POST endpoints.

Both get passed a Request and a Response Object.
*/

function get_Hello(req, res) {
  console.log("Some console output");

  res.status(200);
  res.send({ msg: "Hello " + req.query.get("name") 
                      + " try looking at the examples."});
}