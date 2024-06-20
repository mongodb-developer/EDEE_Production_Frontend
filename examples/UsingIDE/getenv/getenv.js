var some_value = 0;

async function initWebService() {
  // system.clearenv("SOME_VAR");

  /* 
  `getenv("name")` retrieves an environment variable. The first time
  you do so it will ask you to enter a value for it. On subsequent calls,
  it will return the stored value.
  
  In JavaScript, functions that interact with asynchronous actions (e.g. 
  UI or Database operations) need to be declared as `async` and called with 
  `await`.
  */
  some_value = await system.getenv("SOME_VAR");
}

function get_Value(req, res) {
  res.status(200);
  res.send({ value: some_value });
}
