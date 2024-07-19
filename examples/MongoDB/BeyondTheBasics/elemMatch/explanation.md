# Correctly query arrays using `$elemMatch`

Clicking **POST** will insert the array of documents from the **POST Data** box into MongoDB (1 document per array element). 

In this example, you get to test different queries to see which produces the results we want - namely all documents which contain an element in its `components` array representing a **large circle**.

Clicking **GET** will run the initial query. You can then comment out that query, uncomment the next until you get the correct results. 

Note that you may get confused by the displayed results. The resulting documents contain a `components` array with **all** of the shapes from the matching document, not just the element that matched. After ucommenting and running the `$elemMatch` query, move onto the challenge to clean up the results.

---

## Challenge

Even when executing the correct (`$elemMatch` query), we're seeing lots of shapes in the results that aren't large circles. To clean up the data, add a projection so that only the first matching element from each document is included in the results.

---

Click on the **Labs and Examples** button or navigate backwards in your browser to pick your next workshop!