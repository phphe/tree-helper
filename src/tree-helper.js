import * as hp from 'helper-js'

export function clone(obj, childrenKey = 'children') {
  let cloned
  if (hp.isArray(obj)) {
    cloned = obj.map(item => clone(item))
  } else {
    cloned = Object.assign({}, obj)
    if (cloned[childrenKey]) {
      cloned[childrenKey] = clone(cloned[childrenKey])
    }
  }
  return cloned
}

// 旧版深度优先遍历
// old Depth-First-Search
export function forIn(obj, handler, childrenKey = 'children') {
  var rootChildren, rootParent, func
  if (hp.isArray(obj)) {
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

// 深度优先遍历
// Depth-First-Search
export function depthFirstSearch(obj, handler, childrenKey = 'children', reverse) {
  const rootChildren = hp.isArray(obj) ? obj : [obj]
  //
  const StopException = () => {}
  const func = (children, parent) => {
    if (reverse) {
      children = children.slice()
      children.reverse()
    }
    const len = children.length
    for (let i = 0; i < len; i++) {
      const item = children[i]
      const r = handler(item, i, parent)
      if (r === false) {
        // stop
        throw new StopException()
      } else if (r === 'skip children') {
        continue
      } else if (r === 'skip siblings') {
        break
      }
      if (item[childrenKey] != null) {
        func(item[childrenKey], item)
      }
    }
  }
  try {
    func(rootChildren)
  } catch (e) {
    if (e instanceof StopException) {
     // stop
   } else {
     throw e
   }
  }
}

// 广度优先遍历
// Breadth-First-Search
export function breadthFirstSearch(obj, handler, childrenKey = 'children', reverse) {
  const rootChildren = hp.isArray(obj) ? obj : [obj]
  //
  let stack = rootChildren.map((v, i) => ({item: v, index: i}))
  if (reverse) {
    stack.reverse()
  }
  while (stack.length) {
    const {item, index, parent} = stack.shift()
    const r = handler(item, index, parent)
    if (r === false) {
      // stop
      return
    } else if (r === 'skip children') {
      continue
    } else if (r === 'skip siblings') {
      stack = stack.filter(v => v.parent !== parent)
    }
    if (item.children) {
      let children = item.children
      if (reverse) {
        children = children.slice()
        children.reverse()
      }
      const pushStack = children.map((v, i) => ({item: v, index: i, parent: item}))
      stack.push(...pushStack)
    }
  }
}

function _changeParent(item, parent, childrenKey = 'children', parentKey = 'parent') {
  // remove item from original list
  if (item[parentKey]) {
    hp.arrayRemove(item[parentKey][childrenKey], item)
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
  const siblings = target[parentKey][childrenKey]
  let index = siblings.indexOf(target)
  if (siblings[index - 1] !== item) {
    if (item[parentKey] === target[parentKey]) {
      hp.arrayRemove(siblings, item)
      index = siblings.indexOf(target)
    } else {
      _changeParent(item, target[parentKey])
    }
    siblings.splice(index, 0, item)
  }
}
export function insertAfter(item, target, childrenKey = 'children', parentKey = 'parent') {
  if (item === target) {
    return
  }
  const targetParent = target[parentKey]
  const siblings = targetParent[childrenKey]
  let index = siblings.indexOf(target)
  if (siblings[index + 1] !== item) {
    if (item[parentKey] === target[parentKey]) {
      hp.arrayRemove(siblings, item)
      index = siblings.indexOf(target)
    } else {
      _changeParent(item, target[parentKey])
    }
    siblings.splice(index + 1, 0, item)
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
