import com.mongodb.client.model.Filters.*;
import org.bson.Document;
import com.mongodb.client.*;

// We use var (like Java 10+) not specific type in EDEE

var mongoClient = null; // MongoClient
var bookingsCollection = null; // MongoCollection


// This takes a "Booking" from request.body (JSON Text)
// and stores it in MongoDB after converting to the right
// data types.

void post_Booking(SimRequest request, SimResponse response) {
  var booking = Document.parse(request.body); // Should validate the input.
  booking.put("_id",booking.bookingId); // Put the Primary Key in the _id field
  
  // Convert JSON strings to dates or other types as needed
  var bookingDates = booking.get("bookingDates"); // Document
  bookingDates.put("checkIn",  new Date(bookingDates.getString("checkIn")));
  bookingDates.put("checkOut" ,  new Date(bookingDates.getString("checkOut")));

  //Add to MongoDB
  var rval = await bookingsCollection.insertOne(booking);

  response.status(201); //HTTP response
  response.send(rval);
}

// Read the Booking ID form the URL 
void get_Booking(SimRequest request, SimResponse response) {
  var query = Filters.empty(); // An empty query matches everything

  // Get id from the URL and add it to the query
  if (request.query.get("id")) {
    var bookingId = request.query.get("id");
    query = Filters.eq("_id", bookingId);
  }

  logger.info(query);
  var cursor = bookingsCollection.find(query); //MongoCursor

  var bookings = await cursor.toArray();  //Fetch all from Cursor

  response.status(200);
  response.send(bookings);
}

// This is only called when code has changed.
// Get Username and Password from environment then create the MongoDB Client
// Also populate the booking collection objects

async function initWebService() {
  var userName = await system.getenv("MONGO_USERNAME");
  var passWord = await system.getenv("MONGO_PASSWORD", true);

  mongoClient = new MongoClient(
    "mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net",
  );
  bookingsCollection = mongoClient
    .getDatabase("ayrbnb")
    .getCollection("bookings");
  // await bookingsCollection.drop() // Use if you want to reset
}
