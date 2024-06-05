 function __verify_challenge( response ) {
    const rObj = response._data;
    let firstObj;

    if( Array.isArray(rObj)) {
        firstObj = rObj[0]
    }  else {
        firstObj = rObj
    }

    if(!firstObj || typeof firstObj != "object" || !firstObj.count) return;
    
    const count = firstObj.count;
    if (count === 1005) {
        modal.alert("Now that you've incremented the counter a few times, set 'counter' to 500 in the init function, and then run GET a few more times");
    }
    if (count === 503) {
        window.__realmApp?.currentUser?.functions.t({
            example: _exampleName,
            event,
            site: __hostingsite,
            section: __exsection,
            win: true
          }).then(console.log).catch(console.error);
        modal.alert(`Congratulations, you completed the challenge!`);
    }
    return true;
}