# Using the IDE - explanation

In the EDEE environment, you're able to run code in the browser while accessing backend services such as a MongoDB database.

In this environment, we're going to be developing API endpoints. Note that those endpoints can only be accessed from the EDEE environment running in this browser window.

On the left is the code editor. It's preloaded with some sample code, but you can (and should) experiment with editing that code – the effects will be available the next time you run the code (via the **GET** or **SET** buttons).

In the code you can see here, we define a single function named `get_Hello`, which defines an endpoint named "Hello" which provides the **GET** HTTP method. If you add a function named `post_Hello`, then you will also have an endpoint named "Hello" which supports the **POST** method.

On the right side, the **Endpoint URL** box lets us see the name of the endpoint (which much match our `get_xxx` and/or `post_xxx` functions) and any query parameters.

The **POST Data** box is empty in this example, but this is where you can provide the data to be sent in the body of a POST request – in most cases, this would be a JSON document.

We then have the buttons to test our GET/POST endpoint, an possibly others. The labels should be self explanatory (e.g. you clicked on **Explanation** to see this explanation!)

Beneath the buttons, you can see the **Response** section which contains the response from running the GET/POST function.

Going back to the code, you can see that the `get_Hello` function receives two arguments, the request (`req`) and response (`res`). In this example, we take the value of the `name` query parameter from the request. Try changing the value of the "name" query parameter in the "Endpoint URL" box, click on "GET" and see how the response changes. 

Note that you can also use `console.log("xxx")` to include extra information in the response area - useful for debugging.

If you want to save a copy of your code and reload it later, use the **Load**, **Save** and **Save As** buttons.

## Challenge

Change the value of the `name` query parameter that's passed to the endpoint URL, and click GET to fetch the results.

Click on the **Labs and Examples** or navigate backwards in your browser to pick your next workshop!