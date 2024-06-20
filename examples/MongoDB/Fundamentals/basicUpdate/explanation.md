# Updating existing data

The POST method in this example is used to record the views for a particular property. Each time we post, the property's MongoDB document is updated to:

- Push the viewer's IP address onto the `viewIp` array
- Increment the `nViews` count
- Set `lastView` to the current time/date

After a few POSTs, the property's document should look something like this:

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

The GET method fetches the property's document.

Note that `initWebService` resets the document whenever the code is updated.

---

## Challenge

Modify the code so that a POST will push objects rather than simple strings onto the `viewIp` array. Each object will contain the IP address and the time of the view. The resulting document should look like this:

```json
{
    "_id": "PROP789",
    "nViews": 3,
    "viewIp": [
      {
        "sourceIp": "14.188.15.47",
        "viewTime": "2024-06-05T17:48:41.893Z"
      },
      {
        "sourceIp": "89.88.65.91",
        "viewTime": "2024-06-05T17:48:43.174Z"
      },
      {
        "sourceIp": "150.29.70.86",
        "viewTime": "2024-06-05T17:48:43.735Z"
      }
    ],
    "lastView": "2024-06-05T17:48:43.735Z"
}
```

After POSTing a few views, click GET to complete the challenge.

---

Click on the **Labs and Examples** button or navigate backwards in your browser to pick your next workshop!