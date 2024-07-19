function __verify_challenge( response ) {
  const rObj = response._data;
  let firstObj

  if( Array.isArray(rObj)) {
      firstObj = rObj[0]
  }  else {
      firstObj = rObj
  }

  if (!firstObj || typeof firstObj != "object") return;
  if (firstObj.result && firstObj.result.count && firstObj.result.count > 1000) {
    window.__realmApp?.currentUser?.functions.t({
        example: _exampleName,
        event,
        site: __hostingsite,
        section: __exsection,
        win: true
    }).then(console.log).catch(console.error);
    modal.alert(`Congratulations, you've completed the challenge!`);
  }
  return true;
}