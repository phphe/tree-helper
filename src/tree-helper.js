import { isArray, arrayRemove } from 'helper-js'

export function clone(obj, childrenKey = 'children') {
  let cloned
  if (isArray(obj)) {
    cloned = obj.map(item => clone(item))
  } else {
    cloned = Object.assign({}, obj)
    if (cloned[childrenKey]) {
      cloned[childrenKey] = clone(cloned[childrenKey])
    }
  }
  return cloned
}

export function forIn(obj, handler, childrenKey = 'children') {
  var rootChildren, rootParent, func
  if (isArray(obj)) {
    rootChildren = obj
    rootParent = null
  } else {
    rootChildren = [obj]
    rootParent = null
  }
  if (rootChildren) {
    func = function(children, parent) {
      for (const key in children) {
        const child = children[key]
        if (handler(child, key, parent) === false) {
          return false
        }
        if (child[childrenKey] != null) {
          if (func(child[childrenKey], child) === false) {
            return false
          }
        }
      }
      return true
    }
    func(rootChildren, rootParent)
  }
  return obj
}
function _changeParent(item, parent, childrenKey = 'children', parentKey = 'parent') {
  if (item[parentKey] === parent) {
    return
  }
  // remove item from original list
  if (item[parentKey]) {
    arrayRemove(item[parentKey][childrenKey], item)
  }
  item[parentKey] = parent
}

export function getTreeDataFromFlat(data, idKey, parentIdKey) {
  data.forEach(item => (item.children = data.filter(v => v[parentIdKey] === item[idKey])))
  return data.filter(item => item[parentIdKey] == null)
}
export function insertBefore(item, target, childrenKey = 'children', parentKey = 'parent') {
  if (item === target) {
    return
  }
  const sibilings = target[parentKey][childrenKey]
  const index = sibilings.indexOf(target)
  if (sibilings[index - 1] !== item) {
    _changeParent(item, target[parentKey])
    sibilings.splice(index, 0, item)
  }
}
export function insertAfter(item, target, childrenKey = 'children', parentKey = 'parent') {
  if (item === target) {
    return
  }
  const targetParent = target[parentKey]
  const sibilings = targetParent[childrenKey]
  const index = sibilings.indexOf(target)
  if (sibilings[index + 1] !== item) {
    _changeParent(item, target[parentKey])
    sibilings.splice(index + 1, 0, item)
  }
}
export function prependTo(item, target, childrenKey = 'children', parentKey = 'parent') {
  if (item === target) {
    throw `can't prepend to self`
  }
  const targetChildren = target[childrenKey]
  if (targetChildren[0] !== item) {
    _changeParent(item, target)
    targetChildren.splice(0, 0, item)
  }
}
export function appendTo(item, target, childrenKey = 'children', parentKey = 'parent') {
  if (item === target) {
    throw `can't append to self`
  }
  const targetChildren = target[childrenKey]
  const targetChildrenLast = targetChildren[ targetChildren.length - 1 ]
  if (targetChildrenLast !== item) {
    _changeParent(item, target)
    targetChildren.push(item)
  }
}
