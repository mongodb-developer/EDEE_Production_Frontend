var counter = 0;

/* 
Your `initWebService` function is called once when executing GET or SET for
the first time. If you then edit the code, then it will be executed again the
next time that GET or SET runs.

This is where you can reset counters, connect to the database, etc.
*/
async function initWebService() {
  counter = 1000;
}

function get_Count(req, res) {
  res.status(204);
  counter++;
  res.send({ count: counter });
}
