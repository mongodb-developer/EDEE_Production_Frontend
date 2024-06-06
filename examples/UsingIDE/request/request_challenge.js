 function __verify_challenge( response ) {
    const rObj = response._data;
    let firstObj;

    if( Array.isArray(rObj)) {
        firstObj = rObj[0]
    }  else {
        firstObj = rObj
    }

    if(!firstObj || typeof firstObj != "object" || !firstObj.echo) return;
    
    const echo = firstObj.echo;
    if (echo) {
        if (echo.customerId) {
            if (echo.customerId !== 321) {
                modal.alert(`I'd like you to update the POST data to set customerId to 321. It's currently ${echo.customerId}`);
            } else {
                window.__realmApp?.currentUser?.functions.t({
                    example: _exampleName,
                    event,
                    site: __hostingsite,
                    section: __exsection,
                    win: true
                  }).then(console.log).catch(console.error);
                modal.alert(`Congratulations, you completed the challenge!`);
            }
        }
    }
    return true;
}