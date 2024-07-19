# Expressions in updates

By including expressions in your update, you can modify documents based on calculations based on one or more of the document attributes.

Follow these steps:
- While the "Endpoint URL" is still set to `Cities`, click **POST** to add the sample documents. Each document represents a city and has an array of 12 numbers - each is the typical temperature for 1 month in that year
- Click **GET** to read the documents back


Clicking **GET** will fetch 10 documents matching these criteria:
- The **total** price (calculated by adding the `price` and `cleaning_fee` for a property) is under $100
- At least 4 guests are included included in that price
- Change the "Endpoint URL" to `AddSummary` and **POST** again to add the embedded `summary` object to each document. The contents of the `summary` field are generated from the data held in the existing document
- Change the "Endpoint URL" to `Cities` and **GET** the documents from MongoDB again. Confirm that the correct summary data has been added.
---

## Challenge
We forgot to include the minimum temperature in the summary!

- Update the code so that the summary also includes `min` field, containing the minimum temperature accross the 12 months
- **POST** to `AddSummary` again
- **GET** from `Cities` and confirm that `summary.min` has been added

---

Click on the **Labs and Examples** button or navigate backwards in your browser to pick your next workshop!