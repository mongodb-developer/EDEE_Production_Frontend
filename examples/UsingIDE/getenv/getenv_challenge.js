 function __verify_challenge( response ) {
    const rObj = response._data;
    let firstObj;

    if( Array.isArray(rObj)) {
        firstObj = rObj[0]
    }  else {
        firstObj = rObj
    }

    if(!firstObj || typeof firstObj != "object" || !firstObj.value) return;
    
    const value = firstObj.value;
    if (value !== "MongoDB Rocks!") {
        modal.alert(`We'd like to see something a bit more positive than "${value}", clear the environment variable and tell us that "MongoDB Rocks!" (press "Explanation" button for details).`);
    } else {
        window.__realmApp?.currentUser?.functions.t({
            example: _exampleName,
            event,
            site: __hostingsite,
            section: __exsection,
            win: true
          }).then(console.log).catch(console.error);
          modal.alert(`We agree! Congratulations, you completed the challenge!`);
    }
    return true;
}