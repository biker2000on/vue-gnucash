export function getDescendants(key, descendants) { // key: string | number, descendants: NodeArray = []
  const children = this.nodes[key].children

  descendants.push(...children)

  for (let i = 0; i < children.length; i++) {
    descendants = this.getDescendants(children[i], descendants)
  }

  return descendants
}

export function getParents(key) { //: string | number
  let parent = this.nodes[key].parent

  const parents = []
  while (parent !== null) {
    parents.push(parent)
    parent = this.nodes[parent].parent
  }

  return parents
}

export function buildTree(items, itemKey = 'children', parent = null) { //items: any[], parent: (string | number | null) = null
  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    const key = getObjectValueByPath(item, itemKey)
    const children = getObjectValueByPath(item, this.itemChildren, [])
    const oldNode = this.nodes.hasOwnProperty(key) ? this.nodes[key] : {
      isSelected: false,
      isIndeterminate: false,
      isActive: false,
      isOpen: false,
      vnode: null
    }

    const node = {
      vnode: oldNode.vnode,
      parent,
      children: children.map((c) => getObjectValueByPath(c, itemKey)),
      item
    }

    this.buildTree(children, itemKey, key)

    // This fixed bug with dynamic children resetting selected parent state
    if (!this.nodes.hasOwnProperty(key) && parent !== null && this.nodes.hasOwnProperty(parent)) {
      node.isSelected = this.nodes[parent].isSelected
      node.isIndeterminate = this.nodes[parent].isIndeterminate
    } else {
      node.isSelected = oldNode.isSelected
      node.isIndeterminate = oldNode.isIndeterminate
    }

    node.isActive = oldNode.isActive
    node.isOpen = oldNode.isOpen

    this.nodes[key] = !children.length ? node : this.calculateState(node, this.nodes)

    this.updateVnodeState(key)
  }
}

export function getObjectValueByPath(obj, path, fallback = null) { //obj: object, path: string, fallback?: any
  // credit: http://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-with-string-key#comment55278413_6491621
  if (!path || path.constructor !== String) return fallback
  path = path.replace(/\[(\w+)\]/g, '.$1') // convert indexes to properties
  path = path.replace(/^\./, '') // strip a leading dot
  return getNestedValue(obj, path.split('.'), fallback)
}

export function getNestedValue(obj, path, fallback = null) { // obj: any, path: (string | number)[], fallback?: any
  const last = path.length - 1

  if (last < 0) return obj === undefined ? fallback : obj

  for (let i = 0; i < last; i++) {
    if (obj == null) {
      return fallback
    }
    obj = obj[path[i]]
  }

  if (obj == null) return fallback

  return obj[path[last]] === undefined ? fallback : obj[path[last]]
}

export function filterTreeItem(item, search, textKey) {
  const text = getObjectValueByPath(item, textKey)

  return text.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) > -1
}

export function filterTreeItems(
  filter,         //   filter: FilterTreeItemFunction,
  item,           //   item: any,
  search,         //   search: string,
  idKey,          //   idKey: string,
  textKey,        //   textKey: string,
  childrenKey,    //   childrenKey: string,
  excluded        //   excluded: Set<string | number>
) {
  if (filter(item, search, textKey)) {
    return true
  }

  const children = getObjectValueByPath(item, childrenKey)

  if (children) {
    let match = false
    for (let i = 0; i < children.length; i++) {
      if (filterTreeItems(filter, children[i], search, idKey, textKey, childrenKey, excluded)) {
        match = true
      }
    }

    if (match) return true
  }

  excluded.add(getObjectValueByPath(item, idKey))

  return false
}