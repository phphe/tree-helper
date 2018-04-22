/*!
 * tree-helper v1.0.5
 * phphe <phphe@outlook.com> (https://github.com/phphe)
 * https://github.com/phphe/tree-helper.git
 * Released under the MIT License.
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var hp = require('helper-js');

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function clone(obj) {
  var childrenKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'children';

  var cloned = void 0;
  if (hp.isArray(obj)) {
    cloned = obj.map(function (item) {
      return clone(item);
    });
  } else {
    cloned = Object.assign({}, obj);
    if (cloned[childrenKey]) {
      cloned[childrenKey] = clone(cloned[childrenKey]);
    }
  }
  return cloned;
}

// 旧版深度优先遍历
// old Depth-First-Search
function forIn(obj, handler) {
  var childrenKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'children';

  var rootChildren, rootParent, _func;
  if (hp.isArray(obj)) {
    rootChildren = obj;
    rootParent = null;
  } else {
    rootChildren = [obj];
    rootParent = null;
  }
  if (rootChildren) {
    _func = function func(children, parent) {
      for (var key in children) {
        var child = children[key];
        if (handler(child, key, parent) === false) {
          return false;
        }
        if (child[childrenKey] != null) {
          if (_func(child[childrenKey], child) === false) {
            return false;
          }
        }
      }
      return true;
    };
    _func(rootChildren, rootParent);
  }
  return obj;
}

// 深度优先遍历
// Depth-First-Search
function depthFirstSearch(obj, handler) {
  var childrenKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'children';
  var reverse = arguments[3];

  var rootChildren = hp.isArray(obj) ? obj : [obj];
  //
  var StopException = function StopException() {};
  var func = function func(children, parent) {
    if (reverse) {
      children = children.slice();
      children.reverse();
    }
    var len = children.length;
    for (var i = 0; i < len; i++) {
      var item = children[i];
      var r = handler(item, i, parent);
      if (r === false) {
        // stop
        throw new StopException();
      } else if (r === 'skip children') {
        continue;
      } else if (r === 'skip siblings') {
        break;
      }
      if (item[childrenKey] != null) {
        func(item[childrenKey], item);
      }
    }
  };
  try {
    func(rootChildren);
  } catch (e) {
    if (e instanceof StopException) {
      // stop
    } else {
      throw e;
    }
  }
}

// 广度优先遍历
// Breadth-First-Search
function breadthFirstSearch(obj, handler) {
  var childrenKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'children';
  var reverse = arguments[3];

  var rootChildren = hp.isArray(obj) ? obj : [obj];
  //
  var stack = rootChildren.map(function (v, i) {
    return { item: v, index: i };
  });
  if (reverse) {
    stack.reverse();
  }

  var _loop = function _loop() {
    var _stack$shift = stack.shift(),
        item = _stack$shift.item,
        index = _stack$shift.index,
        parent = _stack$shift.parent;

    var r = handler(item, index, parent);
    if (r === false) {
      // stop
      return {
        v: void 0
      };
    } else if (r === 'skip children') {
      return 'continue';
    } else if (r === 'skip siblings') {
      stack = stack.filter(function (v) {
        return v.parent !== parent;
      });
    }
    if (item.children) {
      var _stack;

      var children = item.children;
      if (reverse) {
        children = children.slice();
        children.reverse();
      }
      var pushStack = children.map(function (v, i) {
        return { item: v, index: i, parent: item };
      });
      (_stack = stack).push.apply(_stack, _toConsumableArray(pushStack));
    }
  };

  while (stack.length) {
    var _ret = _loop();

    switch (_ret) {
      case 'continue':
        continue;

      default:
        if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
    }
  }
}

function _changeParent(item, parent) {
  var childrenKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'children';
  var parentKey = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'parent';

  // remove item from original list
  if (item[parentKey]) {
    hp.arrayRemove(item[parentKey][childrenKey], item);
  }
  item[parentKey] = parent;
}

function getTreeDataFromFlat(data, idKey, parentIdKey) {
  data.forEach(function (item) {
    return item.children = data.filter(function (v) {
      return v[parentIdKey] === item[idKey];
    });
  });
  return data.filter(function (item) {
    return item[parentIdKey] == null;
  });
}
function insertBefore(item, target) {
  var childrenKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'children';
  var parentKey = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'parent';

  if (item === target) {
    return;
  }
  var siblings = target[parentKey][childrenKey];
  var index = siblings.indexOf(target);
  if (siblings[index - 1] !== item) {
    if (item[parentKey] === target[parentKey]) {
      hp.arrayRemove(siblings, item);
      index = siblings.indexOf(target);
    } else {
      _changeParent(item, target[parentKey]);
    }
    siblings.splice(index, 0, item);
  }
}
function insertAfter(item, target) {
  var childrenKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'children';
  var parentKey = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'parent';

  if (item === target) {
    return;
  }
  var targetParent = target[parentKey];
  var siblings = targetParent[childrenKey];
  var index = siblings.indexOf(target);
  if (siblings[index + 1] !== item) {
    if (item[parentKey] === target[parentKey]) {
      hp.arrayRemove(siblings, item);
      index = siblings.indexOf(target);
    } else {
      _changeParent(item, target[parentKey]);
    }
    siblings.splice(index + 1, 0, item);
  }
}
function prependTo(item, target) {
  var childrenKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'children';
  var parentKey = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'parent';

  if (item === target) {
    throw 'can\'t prepend to self';
  }
  var targetChildren = target[childrenKey];
  if (targetChildren[0] !== item) {
    _changeParent(item, target);
    targetChildren.splice(0, 0, item);
  }
}
function appendTo(item, target) {
  var childrenKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'children';
  var parentKey = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'parent';

  if (item === target) {
    throw 'can\'t append to self';
  }
  var targetChildren = target[childrenKey];
  var targetChildrenLast = targetChildren[targetChildren.length - 1];
  if (targetChildrenLast !== item) {
    _changeParent(item, target);
    targetChildren.push(item);
  }
}

exports.clone = clone;
exports.forIn = forIn;
exports.depthFirstSearch = depthFirstSearch;
exports.breadthFirstSearch = breadthFirstSearch;
exports.getTreeDataFromFlat = getTreeDataFromFlat;
exports.insertBefore = insertBefore;
exports.insertAfter = insertAfter;
exports.prependTo = prependTo;
exports.appendTo = appendTo;
