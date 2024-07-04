let code, response, endpointName, databox, infobox;
let codeChanged;
let _exampleName = []; //Examples used for different orgs
let _saveFileName = null;
let __exsection = null;

const serviceHostname = "https://edee.mongodb.com/v1/";

async function onLoad() {
  // If we supplied an org name in the URL then write that to Localstorage
  const myURL = new URL(window.location);


  if (myURL.searchParams && myURL.searchParams.get("org")) {
    localStorage.setItem("organization", myURL.searchParams.get("org"));
  }

  if (myURL.searchParams && myURL.searchParams.get("s")) {
    __exsection = myURL.searchParams.get("s")
  }

  //If we dont have a valid org at this point then don't let them in.
  let orgName = localStorage.getItem("organization") ;
  let hasOrg = true;
  if(!orgName) {
    hasOrg = false;
  }


  let response = await fetch(`examples/${orgName}.html`);
  console.log(response.status)
  if(response.status != 200) {
    hasOrg = false;

  }
 while(hasOrg == false) {
    orgName = await modal.prompt( `Please enter a valid Organization code, this is normally supplied in the URL`);
    response = await fetch(`examples/${orgName}.html`);
    if(response.status == 200) {
      hasOrg = true;
      localStorage.setItem("organization",orgName);
    }
}
  // If an org name is in LocalStorage then use it to set the examples page
  // This lets us have different examples based on the last link you used with org

  if (localStorage.getItem("organization") && document.getElementById("exampleLink")) {
    document.getElementById("exampleLink").href = `examples/${localStorage.getItem("organization")}.html`
  }

  let editorFontSize;

  if (localStorage.getItem("editorFontSize")) {
    editorFontSize = localStorage.getItem("editorFontSize");
  } else {
    localStorage.setItem("editorFontSize", 12);
    editorFontSize = 12;
  }

  var editor = ace.edit("editor");
  editor.setTheme("ace/theme/pastel_on_dark");
  editor.session.setMode("ace/mode/javascript");
  editor.session.setUseWorker(false);

  editor.setOptions({
    fontFamily: "Source Code Pro",
    fontSize: `${editorFontSize}pt`
  });
  editor.getSession().on('change', function () {
    codeChangeHandler()
  });

  var outputFormatted = ace.edit("response");
  outputFormatted.setTheme("ace/theme/eclipse");
  outputFormatted.setOption("highlightActiveLine", false)
  outputFormatted.renderer.setShowGutter(false);
  outputFormatted.session.setMode("ace/mode/json");
  outputFormatted.session.setUseWrapMode(true);

  outputFormatted.setOptions({
    fontFamily: "Source Code Pro",
    fontSize: `${editorFontSize}pt`
  });

  _code = editor;
  //_output = document.getElementById("response");
  _output = outputFormatted

  _postdata = document.getElementById("postdata");
  endpointName = document.getElementById("endpoint");
  document.getElementById("url").innerText = serviceHostname;
  codeChanged = true;

  // we can feed index.html with a different src file each time
  // we extract the code and put it in the code element

  if (myURL.searchParams && myURL.searchParams.get("src")) {
    await loadTemplateCode(myURL.searchParams.get("src"));
    if (myURL.searchParams.get("title")) {
      document.title = myURL.searchParams.get("title");
    } else {
      document.title = myURL.searchParams.get("src").split("_").join("/");
    }
  }
  setTimeout(codeChangeHandler, 0);
}

function loadLocalCode(filePath) {
  let reader = new FileReader(); // no arguments
  reader.readAsText(filePath);

  //_output.innerText = "";
  _output.setValue("", -1);

  _postdata.innerText = "";

  reader.onload = function () {
    _code.setValue(reader.result, -1);
  };

  reader.onerror = function () {
    alert(reader.error);
  };

}

function insertTextAtCursor(text) {
  let selection = window.getSelection();
  let range = selection.getRangeAt(0);
  range.deleteContents();
  let node = document.createTextNode(text);
  range.insertNode(node);

  selection.collapseToEnd();
}

function messageBox(str) {
  document.getElementById("infobox").innerText = str;
}

async function callService(method) {
  conso1e.contents = "";
  try {
    // loader.style.visibility = "visible";
    _output.setValue("", -1);
    const fullURL = serviceHostname + endpointName.innerText;
    MongoClient._nServerCalls = 0;
    const startTime = Date.now();
    const response = await callVirtualEndpoint(fullURL, method);
    const endTime = Date.now();


    let timeToShow = Math.floor((endTime - startTime)); //- (MongoClient._serverLatency * MongoClient._nServerCalls));
    if (timeToShow < 1) timeToShow = 1;

    let renderOut = "";

    if (conso1e.contents) {
      renderOut += "-------------------------- Console --------------------------\n";
      renderOut += conso1e.contents;
      renderOut += "\n-------------------------------------------------------------\n\n";
    }
    renderOut += `\n"ResponseTime": ${timeToShow}ms\n`


    renderOut += `"StatusCode": ${response._status}\n`;
    for (const key in response._headers) {
      renderOut += `"${key}": ${response._headers[key]}\n\n`;
    }

    if (
      typeof response._data === "string" ||
      response._data instanceof String
    ) {
      renderOut += `${response._data}`;
    } else {
      renderOut += JSON.stringify(response._data, null, 2);
    }

    _output.setValue(renderOut, -1);

    // Was this a winner?
    if (window.__verify_challenge && typeof window.__verify_challenge == "function") {
       window.__verify_challenge(response);
    }

  } catch (error) {
    console.error(error);
    messageBox(error); // Fatal problem
  } 

}

//Load a JS file and populate the code side
async function loadTemplateCode(fname) {
  const parts = fname.split("_");
  _exampleName = parts;
  url = "examples/" + parts.join("/") + "/" + parts[parts.length - 1];

  let response = await fetch(`${url}.js`);
  if (response.status == 200) {
    _code.setValue(await response.text(), -1);
  } else {
    //We don't really care if it's missing

    _code.setValue("// EXAMPLE CODE MISSING - Is URL Correct", -1);
  }

  response = await fetch(`${url}.json`);
  if (response.status == 200) {
    _postdata.innerText = await response.text();
  } else {
    _postdata.innerText = "";
  }

  response = await fetch(`${url}.url`);
  if (response.status == 200) {
    endpointName.innerText = await response.text();
  } else {
    endpointName.innerText = "";
  }

  response = await fetch(`${url}.buttons`);
  if (response.status == 200) {
    buttons = await response.text();
    const buttonData = JSON.parse(buttons);
    for (let button in buttonData) {
      container = document.getElementById("buttons");
      newButton = document.createElement("button");
      newButton.innerText = button
      newButton.addEventListener("click", () => { showInfo(buttonData[button]) }, false);
      newButton.classList.add("button");

      container.appendChild(newButton);
      //<button class="button" onclick="callService('GET')" id="callServiceGET"> GET </button>
    }

    //Fetch a challenge tester if it exists
    response = await fetch(`${url}_challenge.js`);
    if (response.status == 200) {
      challengeCode = await response.text();
      const challengeHandler = document.createElement("script");
      challengeHandler.id = "chandler";

      document.body.appendChild(challengeHandler);

      window.addEventListener("error", (event) => {
        console.log(event);
        syntaxOKFlag = false;
        syntaxErrorMessage = `${event.message} : Line ${event.lineno} Col: ${event.colno}`;
      });

      syntaxOKFlag = true;
      challengeHandler.innerHTML = challengeCode;

      if (!syntaxOKFlag) {
        console.error(`Server Error ocurred: ${syntaxErrorMessage}`);
      }
    } 
  }
}

// This can get more fancy over time if needs be
async function showInfo(fileName) {
  const css = '<head><link rel="stylesheet" href="instructionsStyle.css"></link></head>';
  const url = 'examples/' + _exampleName.join('/') + '/';
  const windowHeight = 1024;
  const windowWidth = 800;
  
  let fileBody = '';
  const response = await fetch(url + fileName);
  if (response.status == 200) {
    fileBody = await response.text();
  } else {
    console.error(`Failed to load file from ${url + filename}. Return code ${response.status}`);
    return;
  }
  const extension = fileName.split('.').pop();

  switch(extension) {
    case 'html':
      const htmlHtml = css + fileBody;
      var wnd = window.open('about:blank', fileName, `location=no,height=${windowHeight},width=${windowWidth},scrollbars=yes,status=no`);
      wnd.document.write(htmlHtml);
      break;
    case 'md':
      const converter = new showdown.Converter();
      let mdHtml = converter.makeHtml(fileBody);
      mdHtml = css + mdHtml;
      var wnd = window.open('about:blank', fileName, `location=no,height=${windowHeight},width=${windowWidth},scrollbars=yes,status=no`);
      wnd.document.write(mdHtml);
      break;
    default:
      _output.setValue(r = fileBody, -1)
  }
}

function saveToClipboard() {
  navigator.clipboard.writeText(_code.getValue());
}

function saveCode() {
  let data = "";

  data = _code.getValue();

  if (_saveFileName == null) {
    _saveFileName = prompt("Please enter a filename");
  }

  var file = new Blob([data], { type: "application/javascript" });
  var a = document.createElement("a");
  var url = URL.createObjectURL(file);
  a.href = url;
  a.download = _saveFileName;
  document.body.appendChild(a);
  a.click();
  setTimeout(function () {
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }, 0);
}

function containsCode(code, codeBlock) {
const lines = codeBlock.split('\n');
let insideBlockComment = false;

for (let line of lines) {
    let trimmedLine = line;
    if (trimmedLine.includes('/*')) {
        insideBlockComment = true;
    }
    if (trimmedLine.includes('*/')) {
        insideBlockComment = false;
        continue;
    }
    if (insideBlockComment) {
        continue;
    }
    const singleLineCommentIndex = trimmedLine.indexOf('//');
    const codeIndex = trimmedLine.indexOf(code);
    if (codeIndex !== -1 && (singleLineCommentIndex === -1 || 
      codeIndex < singleLineCommentIndex)) {
        return true;
    }
}
return false;
}

function codeChangeHandler() {

  data = _code.getValue();
  const getButton = document.getElementById("callServiceGET");
  const postButton = document.getElementById("callServicePOST");
  const postDataBox = document.getElementById("postdata");
  getButton.hidden = true;
  postButton.hidden = true
  postDataBox.contentEditable = false;
  postDataBox.style.backgroundColor = "lightgrey";

  if (containsCode('get_', data)) {
    getButton.hidden = false;
  }

  if (containsCode('post_', data)) {
    postButton.hidden = false;
    postDataBox.contentEditable = true;
    postDataBox.style.backgroundColor = "white";
  
  }
}

function reduceCodeFont() {
  let size = localStorage.getItem("editorFontSize");
  size--;
  localStorage.setItem("editorFontSize", size);
  var editor = ace.edit("editor");
  editor.setOptions({
    fontSize: `${size}pt`
  });
  var editor = ace.edit("response");
  editor.setOptions({
    fontSize: `${size}pt`
  });
}

function increaseCodeFont() {
  let size = localStorage.getItem("editorFontSize");
  size++;
  localStorage.setItem("editorFontSize", size);
  var editor = ace.edit("editor");
  editor.setOptions({
    fontSize: `${size}pt`
  });
  var response = ace.edit("response");
  response.setOptions({
    fontSize: `${size}pt`
  });
}

function showHideOutput() {
  var x = document.getElementById("outputdiv");
  var y = document.getElementById("editor");
  let size = localStorage.getItem("editorFontSize");
  if (x.style.display === "none") {
    x.style.display = "flex";
    // y.style = "flex";
  } else {
    x.style.display = "none";
    // y.style = "flex";
  }
  var editor = ace.edit("editor");
  editor.setOptions({
    fontSize: `${size}pt`
  });
  var response = ace.edit("response");
  response.setOptions({
    fontSize: `${size}pt`
  });
}