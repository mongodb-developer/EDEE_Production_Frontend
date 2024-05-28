 function __verify_challenge( response ) {
    const rObj = response._data;
    let firstObj
    //Allow them a single object or first thing in an array

    if( Array.isArray(rObj)) {
        firstObj = rObj[0]
    }  else {
        firstObj = rObj
    }

    if(!firstObj || typeof firstObj != "object") return;

    if(firstObj._id === "2931473") {
        if(firstObj.address && firstObj.address.suburb == "Montréal-Nord") {
            modal.alert(`Correct Answer "${firstObj.address.suburb}", well done`);

            //This code shoudl come out into a top level fn
            console.log(window.__realmApp?.currentUser);

            window.__realmApp?.currentUser?.functions.t({
                example: _exampleName,
                event,
                site: __hostingsite,
                section: __exsection,
                win: true
              }).then(console.log).catch(console.error);

        } else {
            modal.alert("You found the right property but don't seem to have returned the suburb");
        }
    }

    return true;
}