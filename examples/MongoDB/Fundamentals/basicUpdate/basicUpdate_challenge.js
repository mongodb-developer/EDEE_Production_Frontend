 function __verify_challenge( response ) {
    const rObj = response._data;
    let firstObj

    if( Array.isArray(rObj)) {
        firstObj = rObj[0]
    }  else {
        firstObj = rObj
    }

    if(!firstObj || typeof firstObj != "object" || 
        !firstObj.viewIp || firstObj.viewIp.length < 1) return;
    
        view = firstObj.viewIp[0];
    
    if (typeof view != "object") return;

    if (!view.sourceIp) {
        modal.alert(`The objects in the array should include a "sourceIp" attribute.`);
        return;
    }

    if (!view.viewTime) {
        modal.alert(`The objects in the array should include a "viewTime" attribute.`);
        return;
    }

    window.__realmApp?.currentUser?.functions.t({
        example: _exampleName,
        event,
        site: __hostingsite,
        section: __exsection,
        win: true
      }).then(console.log).catch(console.error);
    modal.alert(`Congratulations, you've completed the challenge!`);
}