 function __verify_challenge( response ) {
    const rObj = response._data;
    let firstObj
    if( Array.isArray(rObj)) {
        firstObj = rObj[0]
    }  else {
        firstObj = rObj
    }

    if(!firstObj || typeof firstObj != "object") return;

    if(firstObj._id === "17651165") {
        modal.alert(`Close, but I was really looking for a house, and not an apartment.`);
    }

    if(firstObj._id === "5505414") {
        modal.alert(`That meets my criteria, but I was hoping for something a little cheaper.`);
    }

    
    if(firstObj._id === "2931473") {
        if(firstObj.address && firstObj.address.suburb == "Montréal-Nord") {
            modal.alert(`Correct Answer "${firstObj.address.suburb}", well done`);

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