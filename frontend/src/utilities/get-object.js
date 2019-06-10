export default function getObject(theObject, value) {
  var result = null;
  if(theObject instanceof Array) {
      for(var i = 0; i < theObject.length; i++) {
          result = getObject(theObject[i]);
      }
  }
  else
  {
    for(var prop in theObject) {
      if(prop == 'id') {
        if(theObject[prop] == value) {
          // console.log(prop + ': ' + theObject[prop]);
          return theObject;
        }
      }
      if(theObject[prop] instanceof Object || theObject[prop] instanceof Array) {
        result = getObject(theObject[prop]);
      }
    }
  }
  return result;
}