/*!
 * tree-helper v1.0.4
 * phphe <phphe@outlook.com> (https://github.com/phphe)
 * https://github.com/phphe/tree-helper.git
 * Released under the MIT License.
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.treeHelper = global.treeHelper || {})));
}(this, (function (exports) { 'use strict';

var _typeof2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/*!
 * helper-js v1.0.31
 * phphe <phphe@outlook.com> (https://github.com/phphe)
 * https://github.com/phphe/helper-js.git
 * Released under the MIT License.
 */

var _typeof = typeof Symbol === "function" && _typeof2(Symbol.iterator) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof2(obj);
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof2(obj);
};

// local store
var store = {};
// is 各种判断
function isset(v) {
  return typeof v !== 'undefined';
}
function isArray(v) {
  return Object.prototype.toString.call(v) === '[object Array]';
}
function isNumeric(v) {
  return isFinite(v);
}
function isObject(v) {
  return Object.prototype.toString.call(v) === '[object Object]';
}
function isFunction(v) {
  return typeof v === 'function';
}
// num
function numRand(min, max) {
  if (arguments.length === 1) {
    max = min;
    min = 0;
  }
  return Math.floor(Math.random() * (max - min + 1) + min);
}
function max(n, max) {
  return n < max ? n : max;
}

// str 字符
function studlyCase(str) {
  return str && str[0].toUpperCase() + str.substr(1);
}

function strRand() {
  var len = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 8;
  var prefix = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  var r = '';
  var seeds = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (var i = 0; i < len; i++) {
    r += seeds[numRand(seeds.length - 1)];
  }
  return prefix + r;
}
// array
function arrayRemove(arr, v) {
  var index = void 0;
  var count = 0;
  while ((index = arr.indexOf(v)) > -1) {
    arr.splice(index, 1);
    count++;
  }
  return count;
}
function arrayLast(arr) {
  return arr[arr.length - 1];
}
// source: http://stackoverflow.com/questions/8817394/javascript-get-deep-value-from-object-by-passing-path-to-it-as-string
function objectGet(obj, path) {
  var defaultValue = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

  var paths = path.split('.');
  var current = obj;
  var parent = null;

  for (var i = 0; i < paths.length; i++) {
    if (current[paths[i]] == null) {
      return defaultValue;
    } else {
      parent = current;
      current = current[paths[i]];
    }
  }

  var lastPath = arrayLast(paths);
  return parent.hasOwnProperty(lastPath) ? current : defaultValue;
}

// exclude: array or function
function cloneObj(obj, exclude) {
  var type = typeof obj === 'undefined' ? 'undefined' : _typeof(obj);
  switch (type) {
    case 'undefined':
    case 'boolean':
    case 'nuber':
    case 'string':
    case 'function':
      return obj;
      break;
    case 'object':
      if (obj === null) {
        // null is object
        return obj;
      }
      var r = void 0;
      if (isArray(obj)) {
        r = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = obj[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var item = _step.value;

            r.push(cloneObj(item, exclude));
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      } else {
        r = {};
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = Object.keys(obj)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var key = _step2.value;

            if (!exclude || isArray(exclude) && !exclude.includes(key) || !exclude(key, obj[key], obj)) {
              r[key] = cloneObj(obj[key], exclude);
            }
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      }
      return r;
      break;
    default:
      return obj;
      break;
  }
}
/* eslint-enable */
// dom
function uniqueId() {
  var prefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'id_';

  var id = prefix + strRand();
  if (!store.uniqueId) store.uniqueId = {};
  var generatedIds = store.uniqueId;
  if (document.getElementById(id) || generatedIds[id]) {
    return uniqueId(prefix);
  } else {
    generatedIds[id] = true;
    return id;
  }
}
function getOffsetWithoutScroll(el) {
  var elOffset = {
    x: el.offsetLeft,
    y: el.offsetTop
  };
  var parentOffset = { x: 0, y: 0 };
  if (el.offsetParent != null) parentOffset = getOffsetWithoutScroll(el.offsetParent);
  return {
    x: elOffset.x + parentOffset.x,
    y: elOffset.y + parentOffset.y
  };
}

// source: http://youmightnotneedjquery.com/
function hasClass(el, className) {
  if (el.classList) {
    return el.classList.contains(className);
  } else {
    return new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
  }
}

// advance
// binarySearch 二分查找
function binarySearch(arr, callback, start, end, returnNearestIfNoHit) {
  var max = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 1000;

  var midNum;
  var mid;
  if (start == null) {
    start = 0;
    end = arr.length - 1;
  }
  var i = 0;
  var r = void 0;
  while (start >= 0 && start <= end) {
    if (i >= max) {
      throw Error('binarySearch: loop times is over ' + max + ', you can increase the limit.');
    }
    midNum = Math.floor((end - start) / 2 + start);
    mid = arr[midNum];
    r = callback(mid, i);
    if (r > 0) {
      end = midNum - 1;
    } else if (r < 0) {
      start = midNum + 1;
    } else {
      return { index: midNum, value: mid, count: i + 1, hit: true };
    }
    i++;
  }
  return returnNearestIfNoHit ? { index: midNum, value: mid, count: i + 1, hit: false, bigger: r > 0 } : null;
}
function retry(func) {
  var limitTimes = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;

  if (!store.retry) store.retry = {};
  var counters = retry;
  var name = generateName();
  counters[name] = 0;
  return doFunc;
  function doFunc(arg1, arg2, arg3) {
    return func(arg1, arg2, arg3).then(function (data) {
      delete counters[name];
      return data;
    }).catch(function (e) {
      counters[name]++;
      if (counters[name] >= limitTimes) {
        delete counters[name];
        return Promise.reject(e);
      } else {
        return doFunc(arg1, arg2, arg3);
      }
    });
  }
  function generateName() {
    var name = Math.random() + '';
    if (counters[name]) {
      return generateName();
    } else {
      return name;
    }
  }
}

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

  if (item === target) {
    return;
  }
  var sibilings = target[parentKey][childrenKey];
  var index = sibilings.indexOf(target);
  if (sibilings[index - 1] !== item) {
    if (item[parentKey] === target[parentKey]) {
      arrayRemove(sibilings, item);
      index = sibilings.indexOf(target);
    } else {
      _changeParent(item, target[parentKey]);
    }
    sibilings.splice(index, 0, item);
  }
}
function insertAfter(item, target) {
  var childrenKey = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'children';
  var parentKey = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'parent';

  if (item === target) {
    return;
  }
  var targetParent = target[parentKey];
  var sibilings = targetParent[childrenKey];
  var index = sibilings.indexOf(target);
  if (sibilings[index + 1] !== item) {
    if (item[parentKey] === target[parentKey]) {
      arrayRemove(sibilings, item);
      index = sibilings.indexOf(target);
    } else {
      _changeParent(item, target[parentKey]);
    }
    sibilings.splice(index + 1, 0, item);
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
exports.getTreeDataFromFlat = getTreeDataFromFlat;
exports.insertBefore = insertBefore;
exports.insertAfter = insertAfter;
exports.prependTo = prependTo;
exports.appendTo = appendTo;

Object.defineProperty(exports, '__esModule', { value: true });

})));
