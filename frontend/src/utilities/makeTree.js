const makeTree = function (arr, guid = "id", parentId = "parentId", children = "children", root = null) {
  var tree = [],
      mappedArr = {},
      arrElem,
      mappedElem;

  // First map the nodes of the array to an object -> create a hash table.
  for(var i = 0, len = arr.length; i < len; i++) {
    arrElem = arr[i];
    mappedArr[arrElem[guid]] = arrElem;
    mappedArr[arrElem[guid]][children] = [];
  }


  for (var id in mappedArr) {
    if (mappedArr.hasOwnProperty(id)) {
      mappedElem = mappedArr[id];
      // If the element is not at the root level, add it to its parent array of children.
      if (mappedElem[parentId] !== root) {
        // console.log(mappedArr)
        mappedArr[mappedElem[parentId]][children].push(mappedElem);
      }
      // If the element is at the root level, add it to first level elements array.
      else {
        tree.push(mappedElem);
      }
    }
  }
  return tree;
}

const makeTreeFromObject = function (obj, parentId = "parent_guid", children = "children", root = null) {
  let tree = [],
    mappedArr = obj,
    mappedElem;

  for(let i in obj) {
    mappedArr[i][children] = [];
  }

  for (let id in mappedArr) {
    if (mappedArr.hasOwnProperty(id)) {
      mappedElem = mappedArr[id];
      console.log(mappedElem[parentId])
      // If the element is not at the root level, add it to its parent array of children.
      if (mappedElem[parentId] !== root) {
        // console.log(mappedArr)
        mappedArr[mappedElem[parentId]][children].push(mappedElem);
      }
      // If the element is at the root level, add it to first level elements array.
      else {
        tree.push(mappedElem);
      }
    }
  }
  return tree;
}

/* 
This function assumes that the list is ordered with parents / higher level components first.
doesn't currently work...

Based on StackOverflow question https://stackoverflow.com/questions/18017869/build-tree-array-from-flat-array-in-javascript
 */
function list_to_tree(list, id = "id", parentId = "parentId", depth = "depth", root = null) {
  var map = {}, node, roots = [], i;
  for (i = 0; i < list.length; i += 1) {
      map[list[i][id]] = i; // initialize the map
      list[i]['children'] = []; // initialize the children
      // console.log(i, list[i])
  }
  for (i = 0; i < list.length; i += 1) {
      node = list[i];
      if (node[parentId] !== root) {
          // if you have dangling branches check that map[node.parentId] exists
          console.log(parentId)
          console.log(node[parentId])
          console.log(map[node[parentId]])
          console.log(list[map[node[parentId]]])
          list[map[node[parentId]]].children.push(node);
      } else {
          roots.push(node);
      }
  }
  return roots;
}

module.exports = {
  makeTree,
  list_to_tree,
  makeTreeFromObject,
}