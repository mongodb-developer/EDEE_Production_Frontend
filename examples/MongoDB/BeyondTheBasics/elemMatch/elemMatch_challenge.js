 function __verify_challenge( response ) {
  const rObj = response._data;
  let resultsArray;
  // For this challenge, the results should always be an array
  if(Array.isArray(rObj)) {
    resultsArray = rObj
  }  else {
    return;
  }
  
  switch (resultsArray.length) {
    case 0:
      modal.alert(`No matching documents were found. Note that the objects in the array must exaclty match any object that you pass in the query (including "color")`);
      break;
    case 10:
      modal.alert(`You've matched with every document, even though many of them don't include an element in the components array which is both a circle and large`);
      break;
    case 6:
      if (resultsArray[0].components.length !== 1) {
        modal.alert(`Your query is correct, and you've matched the correct documents. BUT your results include a lot of shapes that didn't match. Add in a projection to only include the first matching array element from each document.`);
      } else {
        console.log(window.__realmApp?.currentUser);
        window.__realmApp?.currentUser?.functions.t({
          example: _exampleName,
          event,
          site: __hostingsite,
          section: __exsection,
          win: true
        }).then(console.log).catch(console.error);
        modal.alert(`Congratulations - you've matched the correct documents and projected out all but the first matching shape from each document.`);
      }
      break;
    default:
      break;
  }
  return true;
}