# Running code on startup

Your `initWebService` function is called once when executing GET or SET for
the first time. If you then edit the code, then it will be executed again the
next time that GET or SET runs.

This is where you can reset counters, connect to the database, etc.

---

## Challenge

Click **GET** a few times to see the count increment. Once you're comfortable
with that, update the `initWebService` function to reset `counter` to 500, and 
then execute GET 3 more times.

---

Click on the **Labs and Examples** button or navigate backwards in your browser to pick your next workshop!