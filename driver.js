/*
   Hi - If you are reading this you are looking behind the curtains of
   a demo of what driver coding looks  like - it's built using Atlas App Services
   serverless functions you need to use a real driver for the
   next step beyond playing with this jsfiddle - which you will use from node
   or java or python or dozens of other languages  not from browser JS,
   you use it to write the services you call fron the browser. */

/**
 * MongoDB Driver Starting Class representing a connection to MongoDB
 * Handles any required conneciton pooling and shoudl be created only once
 * and persisted. Will not actually connect until the first information is needed from
 * the server and will automatically manage failover if a server is unavailable.
 */
class MongoClient {

  static _serverLatency = -1;
  static _nServerCalls = 0;
  /**
   * Constructor - takes a MongoDB URI
   * Supported URI Format is mongodb+srv://USERNAME:PASSWORD@...
   * The part after ... should be a DNS name and options but is ignored in the simulato.
   * In the simulator you can make up a unique username and password for yourself, minimum 6 characters for each.
   * @param {string} URI MongoDB Connection Details
   */
  constructor(URI) {
    this.connected = false;

    this.lastError = "";
    const regEx = /^mongodb\+srv:\/\/(.*?):(.*?)@/;
    const getCreds = URI.match(regEx);
    if (getCreds && getCreds.length == 3) {
      this.userName = getCreds[1];
      this.passWord = getCreds[2];
    }
  }

  /**
   * Requests information about the connected cluster
   * @returns server status information
   */
  async hello() {
    if (!(await this.connect())) throw new Error(this.lastError);
    const rval = await this.user.functions.hello();
    MongoClient._nServerCalls++;
    return rval;
  }

  /**
   * Lists databases that exist on the server
   * @returns Array of database names as strings
   */
  async listDatabaseNames() {
    if (!(await this.connect())) throw new Error(this.lastError);
    const rval = await this.user.functions.listDatabaseNames();
    MongoClient._nServerCalls++;
    return rval.result;
  }

  /**
   *
   * @param {String} dbName
   * @returns a MongoDatabase Object representing a database you want to work with
   */
  getDatabase(dbName) {
    const db = new MongoDatabase(dbName, this);
    return db;
  }

  async connect() {
    if (this.connected) {
      return true;
    }

    //TODO error message
    if (this.userName == null || !this.passWord == null) {
      this.lastError = "Invalid Credentials Supplied";
      return false;
    }

    if (this.userName.length < 6 || this.passWord.length < 6) {
      localStorage.clear();
      oldCode = null; //Redo initWebService
      throw new Error(
        "Usernames and Passwords must both be at least 6 characters long"
      );
    }

    //This is weirdly critical as JSFiddle clears the session cookies each time
    //So anonymous users aren't retained we also want to be able to get back to our data
    const realmApp = new Realm.App({ id: __atlasappid  });
    const credential = Realm.Credentials.emailPassword(
      this.userName,
      this.passWord
    );
    try {
      this.user = await realmApp.logIn(credential);
      MongoClient._nServerCalls++;
      this.lastError = "Existing User Authenticated";
      // Measure server latency
      const event = localStorage.getItem("organization") 
      this.user.functions.t({ username: this.userName, example: _exampleName , event , site: __hostingsite}); // Ignore promise
      if (MongoClient._serverLatency == -1) {
        const startTime = Date.now();
        for(let x=0;x<3;x++){
        await this.user.functions.ping();
        }
        const endTime = Date.now();

        MongoClient._serverLatency = (endTime - startTime)/3;
        console.log("Server Latency for Emulator is " + MongoClient._serverLatency + "ms");
      }

      this.connected = true;
      return true;
    } catch (e) {
      console.log(e);
      //On error try to regiuster as new user
      try {
        const deets = { email: this.userName, password: this.passWord };
        await realmApp.emailPasswordAuth.registerUser(deets);

        this.user = await realmApp.logIn(credential);
        this.lastError = "New User Created";
        this.connected = true;
        return true;
      } catch (e) {
        this.lastError =
          "MongoDB Authentication fail: User exists but incorrect password";
        localStorage.clear();
        codeChanged = true;
        return false;
      }
    }
  }
}

/**
 * Class representing a MongoDB Database with methods to interact with it.
 */
class MongoDatabase {
  constructor(dbName, client) {
    this.mongoClient = client;
    this.dbName = dbName;
  }

  /**
   *
   * @param {String} collNamne
   * @returns a MongoCollection Object representing a MongoDB colleciton you want to work with
   */
  getCollection(collName) {
    const coll = new MongoCollection(collName, this.dbName, this.mongoClient);
    return coll;
  }
  /**
   * List all existing collections in this database.
   * @returns Array of collection names as Strings.
   */
  async listCollectionNames() {
    if (!(await this.mongoClient.connect()))
      throw new Error(this.mongoClient.lastError);
    MongoClient._nServerCalls++;
    const rval = await this.mongoClient.user.functions.listCollectionNames(
      this.dbName
    );
    return rval.result;
  }
  /**
   * Drop (Remove) this database and all collections inside it.
   * @returns Object showing success or failure
   */
  async drop() {
    if (!(await this.mongoClient.connect()))
      throw new Error(this.mongoClient.lastError);
    MongoClient._nServerCalls++;
    const rval = await this.mongoClient.user.functions.dropDatabase(
      this.dbName
    );
    return rval;
  }
  /**
   * Create a new Colleciton in this database - only required when passing additional options like
   * timeSeries or validator
   * @param {String} collName
   * @param {Object} options
   * @returns  Object showing success or failure
   */
  async createCollection(collName, options) {
    if (!(await this.mongoClient.connect()))
      throw new Error(this.mongoClient.lastError);
    MongoClient._nServerCalls++;
    const rval = await this.mongoClient.user.functions.createCollection(
      this.dbName,
      collName,
      options
    );
    if (rval.result.ok == false) {
      throw new Error(JSON.stringify(rval));
    }
    return rval;
  }
}

/**
 * Class representing a MongoDB Collection with methods to interact with it.
 */

class MongoCollection {
  constructor(collName, dbName, mongoClient) {
    this.collName = collName;
    this.dbName = dbName;
    this.mongoClient = mongoClient;
  }

  /**
   * Define an Atlas Search index.
   * @param {String} name
   * @param {Object} definition
   * @returns  Object showing success or failure
   */
  async createSearchIndex(name, definition) {
    if (!(await this.mongoClient.connect()))
      throw new Error(this.mongoClient.lastError);
    MongoClient._nServerCalls++;
    const rval = await this.mongoClient.user.functions.createSearchIndex(
      this.dbName,
      this.collName,
      name,
      definition
    );
    if (rval.error) {
      throw new Error(rval.error);
    }
    if (rval.ok == false) {
      throw new Error(JSON.stringify(rval));
    }

    return { ok: rval.ok, indexesCreated: rval.indexesCreated };
  }

  /**
   * Drop an Atlas Search index.
   * @param {String} name
   * @returns  Object showing success or failure
   */
  async dropSearchIndex(index) {
    if (!(await this.mongoClient.connect()))
      throw new Error(this.mongoClient.lastError);
    MongoClient._nServerCalls++;
    const rval = await this.mongoClient.user.functions.dropSearchIndex(
      this.dbName,
      this.collName,
      index
    );
    if (!rval.ok) {
      throw new Error(JSON.stringify(rval));
    }
    return rval;
  }
  /**
   * List all Atlas Search indexes on this collection.
   * @returns  Array of Atlas Search index definition Objects
   */
  async listSearchIndexes() {
    if (!(await this.mongoClient.connect()))
      throw new Error(this.mongoClient.lastError);

    const pipeline = [{ $listSearchIndexes: {} }];
    MongoClient._nServerCalls++;
    const rval = await this.mongoClient.user.functions.aggregate(
      this.dbName,
      this.collName,
      pipeline
    );
    for (let i of rval.result) {
      delete i.statusDetail; // TMI
    }
    return rval.result;
  }
  /**
   * Define a MongoDB Database BTree index.
   * @param {String} name
   * @param {Object} definition
   * @returns  Object showing success or failure
   */
  async createIndex(name, definition) {
    if (!(await this.mongoClient.connect()))
      throw new Error(this.mongoClient.lastError);
    MongoClient._nServerCalls++;
    const rval = await this.mongoClient.user.functions.createIndex(
      this.dbName,
      this.collName,
      name,
      definition
    );
    if (rval.error) {
      throw new Error(rval.error);
    }
    const { numIndexesBefore, numIndexesAfter, note } = rval;
    return { numIndexesBefore, numIndexesAfter, note };
  }

  /**
   * Define a MongoDB Database BTree index.
   * @param {String} name
   * @returns  Object showing success or failure
   */
  async dropIndex(index) {
    console.log(index);
    if (!(await this.mongoClient.connect()))
      throw new Error(this.mongoClient.lastError);
    MongoClient._nServerCalls++;
    const rval = await this.mongoClient.user.functions.dropIndex(
      this.dbName,
      this.collName,
      index
    );
    if (rval.result.ok) {
      console.log(rval);
      return { ok: 1, nIndexesWas: rval.result.nIndexesWas };
    }
    return { ok: 0, error: rval.result.error };
  }

  /**
   * List all Atlas Search indexes on this collection.
   * @returns  Array of MongoDB Database BTree index definition Objects
   */
  async listIndexes(name, definition) {
    if (!(await this.mongoClient.connect()))
      throw new Error(this.mongoClient.lastError);
    MongoClient._nServerCalls++;
    const rval = await this.mongoClient.user.functions.listIndexes(
      this.dbName,
      this.collName
    );
    if (rval.error) {
      throw new Error(rval.error);
    }
    return rval.cursor?.firstBatch;
  }
  /**
   * Drop this colleciton and all non search indexes
   * @returns Object showing success or failure
   */
  async drop() {
    if (!(await this.mongoClient.connect()))
      throw new Error(this.mongoClient.lastError);
    MongoClient._nServerCalls++;
    const rval = await this.mongoClient.user.functions.dropCollection(
      this.dbName,
      this.collName
    );
    return rval;
  }
  /**
   * Add a single Document (Object) to this collection.
   * @param {Object} document
   * @returns Object showing sucess or failure and the primary key (_id) of the object added.
   */
  async insertOne(document) {
    if (!(await this.mongoClient.connect()))
      throw new Error(this.mongoClient.lastError);
    MongoClient._nServerCalls++;
    const rval = await this.mongoClient.user.functions.insert(
      this.dbName,
      this.collName,
      [document]
    );

    if (rval.error) {
      let firstBracket = rval.error.indexOf("{");
      let error = rval.error.substring(firstBracket, rval.error.length - 1);
      throw new Error(JSON.stringify(EJSON.parse(error), null, 2));
    }

    return rval;
  }
  /**
   * Add multiple Documents (Objects) to this collection.
   * @param {Object[]} document
   * @returns Object showing sucess or failure and the primary keys (_id) of all the object added.
   */

  async insertMany(documents) {
    if (!(await this.mongoClient.connect()))
      throw new Error(this.mongoClient.lastError);
    MongoClient._nServerCalls++;
    const rval = await this.mongoClient.user.functions.insert(
      this.dbName,
      this.collName,
      documents
    );
    return rval;
  }

  /**
   * Create a Cursor to define a search and set the filter and projection parameters
   * This does not execute the search until you start to itterate the cursor.
   * @param {Object} query
   * @param {Object} projection
   * @returns MongoCursor - used to access the results
   */
  find(query, projection) {
    const findCursor = new MongoCursor(
      "FIND",
      this.mongoClient,
      this.dbName,
      this.collName
    );
    if (this.explainer != null) {
      findCursor.explainer = this.explainer;
    }
    findCursor._query = query;
    findCursor._projection = projection;
    return findCursor;
  }

  /**
   * Immediately execute the query specified and return the first document found.
   * @param {Object} query
   * @param {Object} projection
   * @returns Document Object
   */
  async findOne(query, projection) {
    if (!(await this.mongoClient.connect()))
      throw new Error(this.mongoClient.lastError);
    MongoClient._nServerCalls++;
    const rval = await this.mongoClient.user.functions.find(
      this.dbName,
      this.collName,
      query,
      projection,
      1,
      0
    );
    if(rval.error) throw new Error(rval.error);
    if (rval.result && rval.result.length > 0) return rval.result[0];
    return null;
  }

  /**
   * Update a single document identified by the query according to the supplied updates then
   * return either the document before(default) or after those changes. options is used to specify
   * whather before or after as well as projection and sort order to apply and whther to upsert.
   * @param {Object} query
   * @param {Object} updates
   * @param {Object options
   * @returns Document updated or null
   */
  async findOneAndUpdate(query, updates, options) {
    if (!(await this.mongoClient.connect()))
      throw new Error(this.mongoClient.lastError);
    MongoClient._nServerCalls++;
    const rval = await this.mongoClient.user.functions.findOneAndUpdate(
      this.dbName,
      this.collName,
      query,
      updates,
      options
    );
    return rval;
  }

  /**
   * Apply the updates specified to all documents matching query.
   * @param {Object} query
   * @param {Object} updates
   * @param {Object} options
   * @returns Object showing how many were found and updated
   */
  async updateMany(query, updates, options) {
    if (!(await this.mongoClient.connect()))
      throw new Error(this.mongoClient.lastError);
    MongoClient._nServerCalls++;
    const rval = await this.mongoClient.user.functions.update(
      this.dbName,
      this.collName,
      query,
      updates,
      false,
      options
    );
    return rval;
  }

  /**
   * Apply the updates specified to the first document matching query.
   * @param {Object} query
   * @param {Object} updates
   * @param {Object} options
   * @returns Object showing how many were found and updated
   */

  async updateOne(query, updates, options) {
    if (!(await this.mongoClient.connect()))
      throw new Error(this.mongoClient.lastError);
    MongoClient._nServerCalls++;
    const rval = await this.mongoClient.user.functions.update(
      this.dbName,
      this.collName,
      query,
      updates,
      true,
      options
    );
    return rval;
  }

  /**
   * Delete all documents matching query.
   * @param {Object} query
   * @returns ject showing how many were found and deleted
   */
  async deleteMany(query) {
    if (!(await this.mongoClient.connect()))
      throw new Error(this.mongoClient.lastError);
    MongoClient._nServerCalls++;
    const rval = await this.mongoClient.user.functions.delete(
      this.dbName,
      this.collName,
      query
    );
    return rval;
  }
  /**
   * Delete first document matching query found.
   * @param {Object} query
   * @returns Object showing how many were found and deleted
   */
  async deleteOne(query) {
    if (!(await this.mongoClient.connect()))
      throw new Error(this.mongoClient.lastError);
    MongoClient._nServerCalls++;
    const rval = await this.mongoClient.user.functions.delete(
      this.dbName,
      this.collName,
      query,
      true
    );
    return rval;
  }

  /**
   * Create a cursor to execute and return results form an aggregation pipeline.
   * @param {Object[]} pipeline
   * @returns MongoCursor with results
   */
  aggregate(pipeline) {
    const aggCursor = new MongoCursor(
      "AGGREGATE",
      this.mongoClient,
      this.dbName,
      this.collName
    );
    aggCursor._pipeline = pipeline;
    return aggCursor;
  }

  /**
   * Count how many documents match query without returning them
   * @param {Object} query
   * @returns number of matching documents
   */

  async countDocuments(query) {
    if (!(await this.mongoClient.connect()))
      throw new Error(this.mongoClient.lastError);
    MongoClient._nServerCalls++;
    const rval = await this.mongoClient.user.functions.count(
      this.dbName,
      this.collName,
      query
    );
    return rval.result;
  }
}

/**
 * MongoCursor represents a connection to a query against the server
 * cursors come from calling find() or aggregate and allow you to set further
 * parameters before itterating over them or retrieving them as an array
 */
class MongoCursor {
  constructor(cursorType, mongoClient, dbName, collName) {
    this._cursorType = cursorType;
    this.collName = collName;
    this.dbName = dbName;
    this.mongoClient = mongoClient;
    this._limit = 30;
    this._skip = 0;
    this._query = undefined;
    this._projection = undefined;
    this._results = undefined;
    this._position = undefined;
    this._exhaused = false;
    this._pipeline = null;
    this._sort = null;
  }

  /**
   * Specify the order you wiush to return sorted results.
   * @param {Object} order
   * @returns This MongoCursor to allow chaining
   */
  sort(order) {
    if (typeof order != "object") {
      throw new Error("sort function takes an object not a " + typeof order);
    }
    this._sort = order;
    return this;
  }

  /***
   * Return a document with an explain plan for this operation
   */
  async explain(explainType) {
    if (!(await this.mongoClient.connect()))
      throw new Error(this.mongoClient.lastError);

    if (this._cursorType == "FIND") {
      MongoClient._nServerCalls++;
      const rval = await this.mongoClient.user.functions.explain_find(
        this.dbName,
        this.collName,
        this._query,
        this._projection,
        this._limit,
        this._skip,
        this._sort,
        explainType
      );
      return rval;
    }
    return {
      error:
        "Explain in aggregation is not supported in the driver emulator yet.",
    };
  }
  /**
   * Ignore the fist x records found, default is 0
   * @param {number} nToSkip
   * @returns This MongoCursor for chaining
   */
  skip(nToSkip) {
    if (nToSkip < 0) nToSkip = 0;
    this._skip = nToSkip;
    return this;
  }
  /**
   * Specify maximum number of documents to return.
   * Default is 30 and Maximum 10,000 in simulator
   *
   * @param {number} nToReturn
   * @returns This MongoCursor for chaining
   */
  limit(nToReturn) {
    if (nToReturn > 10000) nToReturn = 10000;
    if (nToReturn < 0) nToReturn = 0;
    this._limit = nToReturn;
    return this;
  }

  [Symbol.asyncIterator]() {
    let cursor = this;
    return {
      next: async function () {
        let doc = await cursor.next();
        if (doc == null) {
          return { done: true };
        }
        return { value: doc, done: false };
      },
    };
  }

  /**
   * Gets next Document from cursor or null if no documents remain.
   * @returns Document
   */
  async next() {
    if (this._exhausted) {
      return null;
    }
    if (!this._results) {
      if (this._cursorType == "FIND") {
        await this.runFind();
      } else if (this._cursorType == "AGGREGATE") {
        await this.runAgg();
      }
    }

    if (this._results.error) {
      throw new Error("Database Error: " + this._results.error);
    }
    if (this._position >= this._results.length) {
      return null;
    }
    const doc = this._results?.result[this._position];
    this._position++;
    return doc;
  }

  /**
   * Get All documents in cursor as a single Array
   * @returns Cursors
   */

  async into(array) {
    if (!Array.isArray(array)) {
      throw new Error("into requires an array like object");
    }

    if (this._exhausted) {
      throw new Error("Cursor Exhausted");
      return null;
    } else {
      array.size = 0;
      const results = await this.toArray();

      array.push.apply(array, results);
      this._exhausted = true;
      return this;
    }
  }

  /**
   * Get All documents in cursor as a single Array
   * @returns [Document]
   */

  async toArray() {
    if (this._exhausted) {
      throw new Error("Cursor Exhausted");
      return null;
    } else {
      if (this._cursorType == "FIND") {
        await this.runFind();
        if (this._results.error) {
          throw new Error("Database Error: " + this._results.error);
        }
        this._exhausted = true;
        return this._results.result;
      }
      if (this._cursorType == "AGGREGATE") {
        await this.runAgg();
        if (this._results.error) {
          throw new Error("Database Error: " + this._results.error);
        }
        this._exhausted = true;
        return this._results.result;
      }
    }
  }

  async runFind() {
    if (!(await this.mongoClient.connect()))
      throw new Error(this.mongoClient.lastError);

    MongoClient._nServerCalls++;
    this._results = await this.mongoClient.user.functions.find(
      this.dbName,
      this.collName,
      this._query,
      this._projection,
      this._limit,
      this._skip,
      this._sort
    );

    this._position = 0;
  }

  async runAgg() {
    if (!(await this.mongoClient.connect()))
      throw new Error(this.mongoClient.lastError);

    MongoClient._nServerCalls++;
    this._results = await this.mongoClient.user.functions.aggregate(
      this.dbName,
      this.collName,
      this._pipeline
    );

    this._position = 0;
  }
}
