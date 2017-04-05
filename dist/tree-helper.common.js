/*!
 * tree-helper v1.0.0
 * phphe <phphe@outlook.com> (https://github.com/phphe)
 * https://github.com/phphe/tree-helper.git
 * Released under the MIT License.
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var helperJs = require('helper-js');

function clone(obj) {
  var childrenKey = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'children';

  var cloned = void 0;
  if (helperJs.isArray(obj)) {
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
  if (helperJs.isArray(obj)) {
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
    helperJs.arrayRemove(item[parentKey][childrenKey], item);
  }
  item[parentKey] = parent;
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
exports.insertBefore = insertBefore;
exports.insertAfter = insertAfter;
exports.prependTo = prependTo;
exports.appendTo = appendTo;