const flattenToArray = function (
  tree,
  getChildNodes, // function like node => node.children, obtain child nodes
  convertNode, // function like node => node
  generateId // function like node => node.guid
) {
  const stack = tree && tree.length ? [{
    pointer: tree,
    offset: 0
  }] : [];
  const flat = [];
  const flatObject = {}
  let current

  while (stack.length) {
    current = stack.pop();

    while (current.offset < current.pointer.length) {
      const node = current.pointer[current.offset];
      const nodeId = generateId(node);
      const children = getChildNodes(node);

      flat.push(convertNode(node, current.node, nodeId, current.nodeId));
      flatObject[nodeId] = convertNode(node, current.node, nodeId, current.nodeId)

      current.offset += 1;

      if (children) {
        stack.push(current);

        current = {
          pointer: children,
          offset: 0,
          node,
          nodeId
        };
      }
    }
  }
  console.log("Flat AccountMap", flatObject)
  return flat;
}

const flattenToObject = function (
  tree,
  getChildNodes, // function like node => node.children, obtain child nodes
  convertNode, // function like node => node
  generateId // function like node => node.guid
) {
  const stack = tree && tree.length ? [{
    pointer: tree,
    offset: 0
  }] : [];
  const flatObject = {}
  let current

  while (stack.length) {
    current = stack.pop();

    while (current.offset < current.pointer.length) {
      const node = current.pointer[current.offset];
      const nodeId = generateId(node);
      const children = getChildNodes(node);

      flatObject[nodeId] = convertNode(node, current.node, nodeId, current.nodeId)

      current.offset += 1;

      if (children) {
        stack.push(current);

        current = {
          pointer: children,
          offset: 0,
          node,
          nodeId
        };
      }
    }
  }
  return flatObject;
}

module.exports = {
  flattenToArray,
  flattenToObject
}