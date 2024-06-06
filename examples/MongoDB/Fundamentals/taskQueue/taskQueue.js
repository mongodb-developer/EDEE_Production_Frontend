var mongoClient = null;
var taskCollection;
const STATUS_NEW = "1 - New",
  STATUS_ASSIGNED = "2 - Assigned",
  STATUS_DONE = "3 - Complete";

/* 
This service is a task queue. 

You can add a new task by POSTing to the "Task" endpoint, and list them by
sending a GET to the same URL.

You need to add `post_Assign?user=Name` - which will find a single task and
assign it to that user, changing the status to "STATUS_ASSIGNED".

A task can be assigned if it is "New" or has been "Assigned" for more than 1
minute (after which it's considered abandoned).

Abandoned tasks (if any) must be allocated before new ones.
*/

async function post_Assign(req, res) {
  var assignedTo = req.query.get("user");
  var assignedTask = null;

  if (!assignedTo) {
    res.status(400);
    res.send({ error: "No user specified" });
    return;
  }
  var oneMinuteAgo = new Date();
  oneMinuteAgo.setMinutes(oneMinuteAgo.getMinutes() - 1);

  // Answer here you may need { $or : [ query1, query2 ]}
  const newTasks = { status: STATUS_NEW };
  const abandonedTasks = {
    status: STATUS_ASSIGNED,
    dateAssigned: { $lt: oneMinuteAgo }
  };
  assignableTasks = { $or: [ newTasks, abandonedTasks ] };

  assignTask = {
    $set: { status: STATUS_ASSIGNED, assignedTo, dateAssigned: new Date() }
  };

  // findOneAndUpdate returns the document after updating.
  // Sort by status to prioritize status 2 tasks (Assigned, but now viewed as 
  // abandoned)

  options = { returnNewDocument: true, sort: { status: -1 } };

  assignedTask = await taskCollection.findOneAndUpdate(
    assignableTasks,
    assignTask,
    options
  );
  res.status(202);
  res.send({ task: assignedTask });
}

async function get_Task(req, res) {
  query = {};
  var data = await taskCollection.find(query).sort({ status: 1 }).toArray();
  res.status(202);
  res.send({ tasks: data });
}

async function post_Task(req, res) {
  const description = "Work needing done.";
  newTask = {
    date: new Date(),
    status: STATUS_NEW,
    assignedTo: null,
    dateAssigned: null,
    description,
  };

  rval = await taskCollection.insertOne(newTask);
  res.status(202);
  res.send({ taskId: rval?.result?.insertedIds?.[0] });
}

async function post_Complete(req, res) {
  taskId = req.params[3];
  if (!taskId) {
    res.status(400);
    res.send({ error: "No task specified" });
    return;
  }
  completeTask = { $set: { status: STATUS_DONE } };
  query = { _id: new ObjectId(taskId) };
  rval = await taskCollection.updateOne(query, completeTask);
  res.status(202);
  res.send({ rval });
}

async function initWebService() {
  var userName = await system.getenv("MONGO_USERNAME");
  var passWord = await system.getenv("MONGO_PASSWORD", true);
  mongoClient = new MongoClient(
    "mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net"
  );
  taskCollection = mongoClient.getDatabase("example").getCollection("tasks");
  // await taskCollection.drop(); // Uncomment to reset the colleciton
}
