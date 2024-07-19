# Query by various attributes

This example shows how to query a collection based on multiple attributes.

The original code finds properties where:
- There are 5 or more beds
- The country (`address.country`) is "Turkey"

It then projects in (think the `SELECT` part of a SQL query) these attributes:
- `summary`
- `beds`
- `property_type`
- `address.market`
- `price`

---

## Challenge

You need to edit the code to find properties that match these criteria:
- In Canada
- Has a pool (look at the sample document to see how that's part of the `amenities` array)
- Is a house (again, look at the sample document to see where that's included in the document)

You then need to sort the results so that the cheapest matching property is listed first (`1` → ascending sort, `-1` → descending sort).

We also want to know what suburb (`address.suburb`) the house is in (note that the projection controls which fields are included in the results).

---

Click on the **Labs and Examples** button or navigate backwards in your browser to pick your next workshop!