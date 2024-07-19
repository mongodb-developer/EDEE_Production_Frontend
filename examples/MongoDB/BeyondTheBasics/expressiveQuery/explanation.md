# Expressions in queries

By including expressions in your query, you can filter documents based on calculations based on one or more of the document attributes.

Clicking **GET** will fetch 10 documents matching these criteria:
- The **total** price (calculated by adding the `price` and `cleaning_fee` for a property) is under $100
- At least 4 guests are included included in that price

---

## Challenge

Update the query to make sure that there are no `bedrooms` with more than 1 `bed` (`bedrooms >= beds`). Look at the sample document to check the field names.

You can use `$and[expression1, expression2]` to combine expressions.

Include the number of bedrooms in the projection to complete the challenge.

---

Click on the **Labs and Examples** button or navigate backwards in your browser to pick your next workshop!