 function __verify_challenge( response ) {
    const rObj = response._data;
    let firstObj

    if( Array.isArray(rObj)) {
        firstObj = rObj[0]
    }  else {
        firstObj = rObj
    }

    if (!firstObj || typeof firstObj != "object" || !firstObj._id) return;
    const _id = firstObj._id;

    if (_id === "HLB123456789") {
        modal.alert(`OK. You've now inserted and retrieved the original document. Now insert and fetch a second document, this time for "Jane Doe". See "Explanation" for details.`);
    } else {
        if (firstObj.customer && firstObj.customer.firstName) {
            const firstName = firstObj.customer.firstName;
            if (firstName === "Jane") {
                window.__realmApp?.currentUser?.functions.t({
                    example: _exampleName,
                    event,
                    site: __hostingsite,
                    section: __exsection,
                    win: true
                }).then(console.log).catch(console.error);
                modal.alert(`Congratulations, you've completed the challenge!`);
            } else {
                modal.alert(`The first name needs to be "Jane" rather than "${firstName}".`);
            }
        }
    }
    return true;
}
