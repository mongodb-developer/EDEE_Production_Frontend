

// This takes a "Booking" from request.body (JSON Text)
// and stores it in MongoDB after converting to the right
// data types.

async function post_Booking(request, response) {
  var booking = JSON.parse(request.body); // In a full solution you need to validate the input.

 // in MongoDB store the Primary Key  in the  _id field
  booking._id = booking.bookingId; 
  
  // Convert Strings to dates or other types as needed
  var bookingDates = booking.bookingDates // Document
  bookingDates.checkIn = new Date(bookingDates.checkIn);
  bookingDates.checkOut = new Date(bookingDates.checkOut);

  //Add to MongoDB
  var rval = await bookingsCollection.insertOne(booking);

  response.status(201); //HTTP response
  response.send(rval);
}

// Read the Booking ID form the URL 
async function get_Booking(request, response) {
  var query ={};

  // Get id from the URL and add it to the query
  if (request.query.get("id")) {
    query._id = request.query.get("id")
  }

  console.log(query);
  var cursor = bookingsCollection.find(query); //MongoCursor

  var bookings = await cursor.toArray();  //Fetch all from Cursor

  response.status(200);
  response.send(bookings);
}

// This is only called when code has changed.
// Get Username and Password from environment then create the MongoDB Client
// Also populate the booking collection objects
var mongoClient = null; 
var bookingsCollection = null; 

async function initWebService() {
  var userName = await system.getenv("MONGO_USERNAME");
  var passWord = await system.getenv("MONGO_PASSWORD", true);

  mongoClient = new MongoClient(
    "mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net",
  );
  bookingsCollection = mongoClient
    .getDatabase("ayrbnb")
    .getCollection("bookings");
  // await bookingsCollection.drop() // Use if you want to responseet
}
