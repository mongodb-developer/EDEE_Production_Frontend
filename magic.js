let syntaxOKFlag, syntaxErrorMessage;
let oldCode = null;
let __functionTimer = 0;
async function callVirtualEndpoint(url, verb) {
  const res = new SimResponse();
  let source =  _code.getValue();
  

  source = cleanCode(source);
  //Detect if code changed
  if(codeChanged == false) {
    codeChanged = oldCode != source;
  }
  oldCode = source;

  if (codeChanged) {
    document.getElementById("codehost")?.remove();

    const codehost = document.createElement("script");
    codehost.id = "codehost";
    document.body.appendChild(codehost);

    window.addEventListener("error", (event) => {
      console.log(event);
      syntaxOKFlag = false;
      syntaxErrorMessage = `${event.message} : Line ${event.lineno} Col: ${event.colno}`;
    });

    syntaxOKFlag = true;
    codehost.innerHTML = source;

    if (!syntaxOKFlag) {
      res.status(500);

      res.send(`Server Error ocurred: ${syntaxErrorMessage}`);
      return res;
    }
  }

  const req = new SimRequest();

  req.setPath(url);
  req.method = verb;
  if (verb == "POST") req.setBody(postdata.innerText);

  if (req.params[2].trim().length == 0) {
    res.status(404);
    res.send(`Perhaps you need more in the URL as /service is not an endpoint`);
    return res;
  }

  const fName = `${verb.toLowerCase()}_${req.params[2]}`;
  if (window[fName]) {
    try {
      disableButtons(true);
      //TODO don't call if code not modified
      if (codeChanged) {
        await window.initWebService?.(); // We are doing this each time although we wouldn't
        codeChanged = false;
      }
      await window[fName](req, res);
    } catch (e) {
      res.status(500);
      var line = e.stack.split("\n")[1].trim();
      line = line.replace("<anonymous>:", "");
      console.log(line);
      res.send(`Server Error ocurred: ${e.message} ${line}`);
    }
  } else {
    res.status(404);
    res.send(`Not Found handler ${fName}`);
  }
  disableButtons(false);
  return res;
}

function disableButtons( disabled) {
  buttons = document.getElementsByClassName("button")
  for (let button of buttons) {
    button.disabled = disabled
  }

}

function cleanCode(sourcecode) {

  // A few Bodges to JS - const fails if we already declared
  // Also replace with out hacked console.
  //Keep line lengths the same

  sourcecode = sourcecode.replaceAll("const ", "var  ");
  sourcecode = sourcecode.replaceAll("let ", "var ");
  sourcecode = sourcecode.replaceAll("console", "conso1e");

  // Java isms
  
  sourcecode = MagicJava.JStoJava(sourcecode);
  return sourcecode;
}

/**
 * system level operations, principally to get environment variables
 *
 */
const system = {
  // name: name of the variable stored in the environment
  /**
   * Retrieve an Environment variable or reuqst a value for it if it does not exist
   * in this browser. Use secure to not display it for example when setting a password.
   * @param {String} name
   * @param {Boolean} secure
   * @returns String
   */
  getenv: async function (name, secure = false) {
    let rval = localStorage.getItem(name);
    if (rval == null || rval == undefined) {
      rval = await modal.prompt(
        secure?`This password is stored in your browser. IMPORTANT: do not use a password you use for other sites.`:``,
        `Please enter a value for "${name}".`,
        secure
      );
      if (rval == null) return "";
     /* if (rval.length < 6)
        throw new Error(
          "Usernames and passwords must be at least 6 characters long in this environment."
        );*/
      localStorage.setItem(name, rval);
    }
    return rval;
  },
  /**
   * Unset an environment variable prompting it to be requested again
   * @param {String} name
   */
  clearenv: function (name) {
    localStorage.removeItem(name);
  },
  timerStart :  function() {
    __functionTimer = 0;
  },
  timerEnd : function() {
    const r = __functionTimer;
    return r;
  }

};

const conso1e = {
  contents: "",

  log: function () {
    for (arg of arguments) {
      if (typeof arg === "string" || arg instanceof String) {
        conso1e.contents += arg;
      } else {
        conso1e.contents += EJSON.stringify(arg);
      }
    }
  },
  error: function () {
    conso1e.contents += "ERROR: "
    for (arg of arguments) {
      if (typeof arg === "string" || arg instanceof String) {
        conso1e.contents += arg;
      } else {
        conso1e.contents += EJSON.stringify(arg);
      }
    }
  },
};
