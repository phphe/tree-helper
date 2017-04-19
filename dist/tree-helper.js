/*!
 * tree-helper v1.0.1
 * phphe <phphe@outlook.com> (https://github.com/phphe)
 * https://github.com/phphe/tree-helper.git
 * Released under the MIT License.
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.treeHelper = global.treeHelper || {})));
}(this, (function (exports) { 'use strict';

/*!
 * helper-js v1.0.6
 * phphe <phphe@outlook.com> (https://github.com/phphe)
 * https://github.com/phphe/helper-js.git
 * Released under the MIT License.
 */

// is 各种判断
function isset(v) {
  return typeof v !== 'undefined';
}
function isArray(v) {
  return Object.prototype.toString.call(v) === '[object Array]';
}
function isNumber(v) {
  return Object.prototype.toString.call(v) === '[object Number]';
}
function isNumeric(v) {
  var num = parseFloat(v);
  return !isNaN(num) && isNumber(num);
}
function isObject(v) {
  return Object.prototype.toString.call(v) === '[object Object]';
}
function isFunction(v) {
  return typeof v === 'function';
}
// str 字符
function studlyCase(str) {
  return str && str[0].toUpperCase() + str.substr(1);
}
// array
function arrayRemove(arr, v) {
  var index = arr.indexOf(v);
  if (index > -1) {
    arr.splice(index, 1);
  }
  return arr;
}
var storeOfWaitFor = {};

function clone(obj) {
  var childrenKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'children';

  var cloned = void 0;
  if (isArray(obj)) {
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

function forIn(obj, handler) {
  var childrenKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'children';

  var rootChildren, rootParent, _func;
  if (isArray(obj)) {
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
function _changeParent(item, parent) {
  var childrenKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'children';
  var parentKey = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'parent';

  // remove item from original list
  if (item[parentKey]) {
    arrayRemove(item[parentKey][childrenKey], item);
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

  var sibilings = target[parentKey][childrenKey];
  var index = sibilings.indexOf(target);
  if (sibilings[index - 1] !== item) {
    _changeParent(item, target[parentKey]);
    sibilings.splice(index, 0, item);
  }
}
function insertAfter(item, target) {
  var childrenKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'children';
  var parentKey = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'parent';

  var targetParent = target[parentKey];
  var sibilings = targetParent[childrenKey];
  var index = sibilings.indexOf(target);
  if (sibilings[index + 1] !== item) {
    _changeParent(item, target[parentKey]);
    sibilings.splice(index + 1, 0, item);
  }
}
function prependTo(item, target) {
  var childrenKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'children';
  var parentKey = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'parent';

  var targetChildren = target[childrenKey];
  if (targetChildren[0] !== item) {
    _changeParent(item, target);
    targetChildren.splice(0, 0, item);
  }
}
function appendTo(item, target) {
  var childrenKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'children';
  var parentKey = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'parent';

  var targetChildren = target[childrenKey];
  var targetChildrenLast = targetChildren[targetChildren.length - 1];
  if (targetChildrenLast !== item) {
    _changeParent(item, target);
    targetChildren.push(item);
  }
}

exports.clone = clone;
exports.forIn = forIn;
exports.getTreeDataFromFlat = getTreeDataFromFlat;
exports.insertBefore = insertBefore;
exports.insertAfter = insertAfter;
exports.prependTo = prependTo;
exports.appendTo = appendTo;

Object.defineProperty(exports, '__esModule', { value: true });

})));
