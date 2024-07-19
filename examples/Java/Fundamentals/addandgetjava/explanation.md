# Add and retrieve a simple document

Clicking **POST** will insert the document from **POST Data** into MongoDB. 

Clicking **GET** will read back that same document. Note that the **GET** finds the document because the `id` query parameter in the endpoint URL matches the `_id` from the posted document.

---

## Challenge

Run **POST** to insert the default document, and then **GET** to read it back.

Now edit the POST data to set `firstName` to "Jane". If you run **POST** now, it will fail with a duplicate key error (the `_id` must be unique accross all documents in the collection). Change `_id` to a value of your choosing, and then replace `HLB123456789` in the endpoint URL with that same value.

Next **POST** to insert the new document and then **GET** to read the data back.

---

Click on the **Labs and Examples** button or navigate backwards in your browser to pick your next workshop!