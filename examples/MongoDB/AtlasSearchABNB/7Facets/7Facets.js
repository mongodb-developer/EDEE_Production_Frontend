var mongoClient = null;
var collection;

// For each country, count how many properties have a pool
async function get_AmenitiesByCountry(req, res) {
  
  // This field must be indexed as a facet
  var fieldToFacet = "address.country";
  
  var amenity = req.params[3];
  console.log("For each country, count how many properties have a " + amenity);
  
  searchOperation = 
    {
      $searchMeta: {
        index: "airbnbFacetIndex",
        facet: {
         operator : {
             text : { path: "amenities", query: amenity }
          },
          facets: {
            perCountry: {
              type: "string",
              path: fieldToFacet,
            },
          },
        },
      },
    };
  console.log(`Search Operation: ${JSON.stringify(searchOperation)}`);
  var searchResultsCursor = collection.aggregate([ searchOperation ]);
  var searchResult = await searchResultsCursor.toArray();
  res.status(201);
  res.send(searchResult);
}

// Connect to MongoDB Atlas
async function initWebService() {
  var userName = await system.getenv("MONGO_USERNAME");
  var passWord = await system.getenv("MONGO_PASSWORD", true);

  mongoClient = new MongoClient(
    "mongodb+srv://" + userName + ":" + passWord + "@learn.mongodb.net",
  );
  collection = mongoClient
    .getDatabase("sample_airbnb")
    .getCollection("listingsAndReviews");
}
