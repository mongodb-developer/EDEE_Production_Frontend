# Using the request object

We've already seen how your `get_xxx` or `post_xxx` function can access simple value from query parameters in the the URL. When using a POST endpoint, you often want to send more substantial data. To do that, enter that data into the **POST Data** field. Your `post_xxx` function can then retrieve that data from the `body` element of the `req` parameter.

Typically, this data will be in the form of a JSON string. Your code can convert that into an object and then work with that object.

## Challenge

Update the POST data so that the `customerId` is `321`.

Click on the **Labs and Examples** or navigate backwards in your browser to pick your next workshop!