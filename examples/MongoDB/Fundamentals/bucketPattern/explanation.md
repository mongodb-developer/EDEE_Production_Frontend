# Implementing the bucket pattern using upserts

The last exercise wasn't 100% satisfactory. We avoided unbounded arrays by capping the array at 8 elements, but that meant that we stopped recording new property views.

In this example, we remedy that by implementing the bucket pattern – where each document contains a bucket (array) of 8 views. We still cap the array at 8 elements, but when a bucket is full, we create a new document. It's almost trivial to implement the change, we just include the option `{ upsert: true }` in the update.

After **POST**ing 12 views, we'll now see 2 documents when we GET all documents for the property:

```json
[
  {
    "_id": "6660c47c3f4b1082fa6f040e",
    "propertyId": "PROP789",
    "lastView": "2024-06-05T20:03:15.485Z",
    "nViews": 8,
    "viewIp": [
      "105.60.49.162",
      "183.153.66.21",
      "104.35.41.115",
      "178.112.149.146",
      "48.184.171.21",
      "119.166.25.117",
      "47.20.28.40",
      "29.65.51.158"
    ]
  },
  {
    "_id": "6660c4843f4b1082fa6f0514",
    "propertyId": "PROP789",
    "lastView": "2024-06-05T20:03:21.628Z",
    "nViews": 4,
    "viewIp": [
      "14.118.126.188",
      "63.145.118.186",
      "141.58.60.80",
      "145.45.113.95"
    ]
  }
]
```
The **GET** method fetches the property's document.

Note that in this example, `initWebService` **doesn't reset** the collection whenever the code is updated. Also note that we didn't need to create the initial document in `initWebService` because the upsert handles that for us.

---

## Challenge

After **POST**ing the 12 views, modify the code to update the limit to 10 views.

Now **POST** 3 more views and click **GET** to complete the challenge – you'll see that the first bucket has been enlarged and now contains 10 views, while the second contains 5.

---

Click on the **Labs and Examples** button or navigate backwards in your browser to pick your next workshop!