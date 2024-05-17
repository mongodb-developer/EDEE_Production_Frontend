class Document {
  static class = "Document";

  static parse(ejson) {
    const parsed = EJSON.parse(ejson);
    return new Document(parsed);
  }

  constructor(a, b) {
    if (typeof a == "string") {
      this[a] = b;
    } else if (typeof a == "object") {
      Object.assign(this, a);
    }
  }

  append(key, value) {
    this[key] = value;
    return this;
  }

  put(key, value) {
    this[key] = value;
    return this;
  }

  putAll(obj) {
    Object.assign(this, obj);
  }

  clear() {
    const keys = Object.keys(this);
    for (let k of keys) {
      delete this[k];
    }
  }

  isEmpty() {
    return Object.keys(this).length == 0;
  }

  remove(key) {
    delete this[key];
  }
  toJson() {
    return EJSON.stringify(this);
  }


  get(key, defaultValue) {
    if (this[key] != undefined) {
      // If we get an Object return a Document for Java
      if (typeof this[key] === "object" && this[key].constructor === Object) {
        console.log("Cast to Document");
        return new Document(this[key]);
      }
      return this[key];
    } else if (defaultValue == undefined) return null;
    else return defaultValue;
  }

  //TODO - add typing
  getList(key) {
    const rval = [];
    const val = this[key];
    if (Array.isArray(val)) {
      for (let el of val) {
        rval.push(new Document(el));
      }
    }
    return rval;
  }

  getBoolean(key, defaultValue) {
    const val = this[key];
    if (val == undefined) {
      return defaultValue == undefined ? null : defaultValue;
    }
    if (typeof val == "boolean" || val === null) {
      return val;
    }
    throw new Error(
      `java.lang.ClassCastException: ${key} is not of type boolean`
    );
  }

  getString(key, defaultValue) {
    const val = this[key];
    if (val == undefined) {
      return defaultValue == undefined ? null : defaultValue;
    }
    if (typeof val == "string" || val === null) {
      return val;
    }
    throw new Error(
      `java.lang.ClassCastException: ${key} is not of type String`
    );
  }

  getInteger(key, defaultValue) {
    const val = this[key];
    if (val == undefined) {
      return defaultValue == undefined ? null : defaultValue;
    }
    if (
      val instanceof Realm.BSON.Int32 ||
      this[key] === null ||
      (typeof val == "number" && Number.isInteger(val))
    ) {
      return val;
    }
    throw new Error(
      `java.lang.ClassCastException: ${key} is not of type Integer`
    );
  }

  getDouble(key, defaultValue) {
    const val = this[key];
    if (val == undefined) {
      return defaultValue == undefined ? null : defaultValue;
    }
    if (
      val instanceof Realm.BSON.Double ||
      this[key] === null ||
      typeof val == "number"
    ) {
      return val;
    }
    throw new Error(
      `java.lang.ClassCastException: ${key} is not of type Double`
    );
  }

  getLong(key, defaultValue) {
    const val = this[key];
    if (val == undefined) {
      return defaultValue == undefined ? null : defaultValue;
    }
    if (val instanceof Realm.BSON.Long || this[key] === null) {
      return val;
    }
    throw new Error(`java.lang.ClassCastException: ${key} is not of type Long`);
  }

  getObjectId(key) {
    const val = this[key];
    if (val == undefined) return null;
    if (val instanceof Realm.BSON.ObjectId || val === null) {
      return val;
    }
    throw new Error(
      `java.lang.ClassCastException: ${key} is not of type ObjectId`
    );
  }

  getDate(key) {
    const val = this[key];
    if (val == undefined) return null;
    if (val instanceof Date || val === null) return val;
    throw new Error(`java.lang.ClassCastException: ${key} is not of type Date`);
  }
}

class UpdateOptions {
  constructor() {
    this._upsert = false;
  }
}

class BSON extends Document {}

class BSONDocument extends Document {}

class MongoDocument extends Document {}

class SortOrder {
  static DESC = -1;
  static ASC = 1;

}
//This aims to make Java esque code work and also retain line numbering
class MagicJava {
  static JStoJava(javacode) {
    // Drop imports and packages
    javacode = javacode.replace(/^\s*package/gm, "//     ");
    javacode = javacode.replace(/^\s*import/gm, "//     ");

    //Alow Java type console writes

    javacode = javacode.replaceAll("System.out.println", "conso1e.log");
    javacode = javacode.replaceAll("System.err.println", "conso1e.log");
    javacode = javacode.replaceAll("logger.info", "conso1e.log");
    javacode = javacode.replaceAll("logger.warn", "conso1e.log");
    javacode = javacode.replaceAll("logger.debug", "conso1e.log");

    // Allow us to define functions nicely)
    javacode = javacode.replaceAll("SimRequest", "");
    javacode = javacode.replaceAll("SimResponse", "");
    javacode = javacode.replace(/void\s*(?=(get_|post_|initWebService))/g,"async function ")

    return javacode;
    /* THis is all very experimental */


      
  /*
  javacode = javacode.replace(/Document /g,"var     ");
  javacode = javacode.replace(/Bson /g,"var  ");
  javacode = javacode.replace(/String /g,"var   ");

  const classAsVar = /^(?<=\s+)class\s+([A-Za-z0-9_]*)/mg;
  javacode = javacode.replace(classAsVar,"var $1 = class $1")
  */

  
    // Any variable declared by type becomes var - lets try this without a list of types first
    const allDataTypes =
      /^\s*(?!class)[A-Za-z0-9_<>]+\s(?=\s*[A-Za-z0-9_]+\s)/gm;
    javacode = javacode.replace(allDataTypes, "var ");

    // Identify functions and make them all async
    const functionDefinition =
      /^\s*(?!class)[A-Za-z0-9_<>]+\s(?=\s*[A-Za-z0-9_]+\()/gm;
    javacode = javacode.replace(functionDefinition, "async function ");

    //Function Argument types

    console.log(javacode);
    const functionArgs = /(?<=[\(,]\s*)[A-Za-z_]*\s(?=\s*[A-Za-z_])/gm;
    javacode = javacode.replace(functionArgs, "");

    console.log(javacode);
    return javacode;
  }
}

class ArrayList extends Array {}
