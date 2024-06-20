function __verify_challenge( response ) {
    const rObj = response._data;
    let firstObj;
    let secondObj;

    if( Array.isArray(rObj) && rObj.length >= 2) {
        firstObj = rObj[0];
        secondObj = rObj[1];
    }  else {
        return;
    }

    if(!firstObj || typeof firstObj != "object" || 
        !firstObj.viewIp || firstObj.viewIp.length < 10 || 
        !secondObj || typeof secondObj != "object" || 
        !secondObj.viewIp || secondObj.viewIp.length < 5
    ) return;

    window.__realmApp?.currentUser?.functions.t({
        example: _exampleName,
        event,
        site: __hostingsite,
        section: __exsection,
        win: true
      }).then(console.log).catch(console.error);
    modal.alert(`Congratulations, you've completed the challenge!`);
}