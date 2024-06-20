# Atomic, conditional updates

We realised that there's a danger in our original implementation of adding an element to a property document's array whenever that property is viewd in the app. There's no limit to how often that property might be viewed, and so the array could grow to an unbounded size – that's not good for performance.

As before, the POST method in this example is used to record the views for a particular property. Each time we post, the property's MongoDB document is updated to:

- Push the viewer's IP address onto the `viewIp` array
- Increment the `nViews` count
- Set `lastView` to the current time/date

The difference is that we now cap the size of the array to 8 elements, by including `nViews: { $lt: 8 }` in the filter part of the update. It's important to realise that the check on the size of the array is atomic with the update – i.e., no thread can swap in and add an element to the array in between our check on the size and making the update.

As before, our document will look like this as we POST new updates:

```json
{
    "_id": "PROP789",
    "nViews": 7,
    "viewIp": [
        "44.154.142.67",
        "35.49.78.78",
        "75.36.35.91",
        "175.43.132.24",
        "27.123.25.81",
        "87.47.105.44",
        "187.179.37.65"
    ],
    "lastView": "2024-06-05T17:33:20.642Z"
}
```

**However**, once we hit 8 views, new POSTs won't actually update the document because there are now no documents matching the filter:

```javascript
const query = { 
  _id:  propertyId,
  nViews: { $lt: 8 } // Stop recording at 8 views
};
```

The GET method fetches the property's document.

Note that `initWebService` resets the document whenever the code is updated.

---

## Challenge

Modify the code to update the limit to 10 views.

After POSTing 10 views, click GET to complete the challenge.

---

Click on the **Labs and Examples** button or navigate backwards in your browser to pick your next workshop!