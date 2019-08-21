// currently just a search need to utilize function
export const depthFirst = function(tree, func) {
  let collection = [...tree] 

  while (collection.length) {
    let node = collection.shift()
    
    // my edits
    if (node.children) {
      if (node.children.length) {
        collection.unshift(...node.children)
      }
    }
    // end my edits

    if (node.data === value) {
      return true
    } else {
      collection.unshift(...node.children)
    }
    return false
  }
}

export const traverseDF = function(tree, callback) {
  for (let root of tree) {
    // this is a recurse and immediately-invoking function 
    (function recurse(currentNode) {
        // step 2
        for (var i = 0, length = currentNode.children.length; i < length; i++) {
            // step 3
            recurse(currentNode.children[i]);
        }
  
        // step 4
        callback(currentNode);
         
        // step 1
    })(root)
  }

};

