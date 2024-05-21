import com.mongodb.client.model.Filters.*;
import org.bson.Document;
import com.mongodb.client.*;

var mongoClient = null;
var listingsCollection;

void get_PropertyDetails(SimRequest request, SimResponse response) {

  // 5 Bedrooms or more in Turkey
  var query  =  Filters.and(
    [
    Filters.gte("beds",5),  
    Filters.eq("address.country", "Turkey")
    ]
  );

  //Set which fields we want to return.

  var projection = Projections.include("summary","beds","property_type",
                                       "address.market","price");

  var sortOrder = { price: SortOrder.DESC };
  
  logger.info(query);
  var cursor = listingsCollection
    .find(query, projection)
    .limit(10)
    .sort(sortOrder);

  var properties = await cursor.toArray();
  response.status(200);
  response.send(properties);
}



// Connect to MongoDB
void initWebService() {
  var userName = await system.getenv("MONGO_USERNAME");
  var passWord = await system.getenv("MONGO_PASSWORD", true);
  mongoClient = new MongoClient(
    "mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net",
  );
  listingsCollection = mongoClient
    .getDatabase("sample_airbnb")
    .getCollection("listingsAndReviews");
}
