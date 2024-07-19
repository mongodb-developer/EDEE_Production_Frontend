/* 
This takes a "Booking" from request.body (JSON Text)
and stores it in MongoDB after converting to the right
data types.
*/
async function post_Booking(request, response) {
  var booking = JSON.parse(request.body); 
  
  // Convert Strings to dates or other types as needed
  var bookingDates = booking.bookingDates;
  bookingDates.checkIn = new Date(bookingDates.checkIn);
  bookingDates.checkOut = new Date(bookingDates.checkOut);

  console.log(`bookingDates: ${JSON.stringify(bookingDates)}`);
  // Add to MongoDB
  var rval = await bookingsCollection.insertOne(booking);

  response.status(201);
  response.send(rval);
}
 
async function get_Booking(request, response) {
  var query ={};

  // Get id from the URL and add it to the query
  if (request.query.get("id")) {
    query._id = request.query.get("id")
  }

  console.log(`Query: ${JSON.stringify(query)}`);
  var cursor = bookingsCollection.find(query); // MongoCursor
  var bookings = await cursor.toArray();  // Fetch all documents from cursor

  response.status(200);
  response.send(bookings);
}

var mongoClient = null; 
var bookingsCollection = null; 

async function initWebService() {
  var userName = await system.getenv("MONGO_USERNAME");
  var passWord = await system.getenv("MONGO_PASSWORD", true);

  mongoClient = new MongoClient(
    "mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net");
  bookingsCollection = mongoClient
    .getDatabase("ayrbnb")
    .getCollection("bookings");
  // await bookingsCollection.drop() // Use if you want to reset
}
