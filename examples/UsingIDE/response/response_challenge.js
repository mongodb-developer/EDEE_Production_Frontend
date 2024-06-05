 function __verify_challenge( response ) {
    const rObj = response._data;
    let firstObj

    if( Array.isArray(rObj)) {
        firstObj = rObj[0]
    }  else {
        firstObj = rObj
    }

    if(!firstObj || typeof firstObj != "object" || !firstObj.msg) return;
    const msg = firstObj.msg;

    if(msg === "Hello Fellow Developer try looking at the examples.") {
        modal.alert("Try sending a different name to the endpoint. Click the 'Explanation' button to find out how");
    } else {
        if (msg.startsWith("Hello") && msg.endsWith("try looking at the examples.")) {
            const match = msg.match(/^Hello (.+?) try looking at the examples\.$/);
            const name = match ? match[1] : null;
            window.__realmApp?.currentUser?.functions.t({
                example: _exampleName,
                event,
                site: __hostingsite,
                section: __exsection,
                win: true
              }).then(console.log).catch(console.error);
            modal.alert(`Congratulations ${name}, you completed the challenge!`);
        } else {
            modal.alert("I'd like you to keep the results of the form 'Hello <name> try looking at the examples.'");
        }
    }
    return true;
}