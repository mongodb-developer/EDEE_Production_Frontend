# Atomic update with read

In this example, we implement an endpoint to provide a unique sequence number. The caller provides the name of the sequence (`CustomerId` in this case), and is guranteed that they will receive a value that no other caller has been given, and is 1 higher than returned to the previous caller.

Clicking **POST** will increment the named sequence number by 1 in MongoDB, and then return the new value.

It's important to understand that this is an atomic operation – no other thread can sneak in between the update and the read to end up with the same value.

---

## Challenge

To complete the challenge, keep **POST**ing until the counter exceeds 1,000. Feel free to edit the code to speed up the process.

---

Click on the **Labs and Examples** button or navigate backwards in your browser to pick your next workshop!