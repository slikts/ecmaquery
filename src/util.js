'use strict';

/*
 * argument naming:
 *
 * x = accepts both objects and array-like objects
 * arr = array-like objects only
 * obj = objects only
 * func = functions
 * str = strings
 */

Object.assign(ecmaQuery, (function($) {
  var objKeys = Object.keys;
  var objAssign = Object.assign;
  var objCreate = Object.create;
  var objGetPrototypeOf = Object.getPrototypeOf;

  var arrProto = Array.prototype;
  var arrIsArray = Array.isArray;
  var arrForEach = arrProto.forEach;
  var arrMap = arrProto.map;
  var arrReduce = arrProto.reduce;
  var arrFilter = arrProto.filter;
  var arrEvery = arrProto.every;
  var arrSome = arrProto.some;
  var arrIndexOf = arrProto.indexOf;
  var arrSlice = arrProto.slice;
  var arrConcat = arrProto.concat;

  function every(x, callback, thisArg) {
    if (isArrayLike(x)) {
      return arrEvery.call(x, callback, thisArg);
    }

    return objKeys(x).every(function(key) {
      return callback.call(thisArg, x[key], key, x);
    });
  }

  function some(x, callback, thisArg) {
    if (isArrayLike(x)) {
      return arrSome.call(x, callback, thisArg);
    }

    return objKeys(x).some(function(key) {
      return callback.call(thisArg, x[key], key, x);
    });
  }

  function each(x, callback, thisArg) {
    if (isArrayLike(x)) {
      return arrForEach.call(x, callback, thisArg);
    }

    return arrForEach.call(objKeys(x), function(key) {
      callback.call(thisArg, x[key], key, x);
    }, thisArg);
  }

  function map(x, callback, thisArg) {
    if (isArrayLike(x)) {
      return arrMap.call(x, callback, thisArg);
    }

    var ret = clone(x);

    each(objKeys(ret), function(value, key) {
      ret[key] = callback.apply(thisArg, arguments);
    }, thisArg);

    return ret;
  }

  // XXX arrays?
  function extend() {
    return arrReduce.call(arguments, function(target, source) {
      return objAssign(target, source);
    });
  }

  function filter(x, callback, thisArg) {
    callback = callback || function(value) {
      return value;
    };

    if (isArrayLike(x)) {
      return arrFilter.call(x, callback, thisArg);
    }

    var ret = objCreate(objGetPrototypeOf(x));

    each(objKeys(x).filter(function(key) {
      return callback.call(thisArg, x[key], key, x);
    }), function(key) {
      ret[key] = x[key];
    });

    return ret;
  }

  function reject(x, callback, thisArg) {
    return filter(x, negate(callback), thisArg);
  }

  function negate(func) {
    return function() {
      return !func.apply(this, arguments);
    };
  }

  function unique(arr) {
    return arrFilter.call(arr, function(val, i, arr) {
      return (i <= arrIndexOf.call(arr, val));
    });
  }

  function clone(x) {
    if (!(x instanceof Object)) {
      return x;
    }

    return isArrayLike(x) ? arrSlice.call(x) : objAssign(objCreate(null), x);
  }

  function get(x, i) {
    if (!isArrayLike(x)) {
      x = objKeys(x).sort();
    }

    var len = x.length;
    if (i < 0) {
      i += len;
    }

    return x[i];
  }

  function isArrayLike(x) {
    return x.length !== undefined;
  }

  function last(x) {
    return get(x, -1);
  }

  function first(x) {
    return get(x, 0);
  }

  // array-like only
  function flatten(arr, deep, level, ret) {
    if (!deep && every(arr, isArrayLike)) {
      return merge.apply(this, arr);
    }

    level = level || 0;
    ret = ret || [];

    arrForEach.call(arr, function(value) {
      if (!value || !isArrayLike(value) || (!deep && level)) {
        ret.push(value);

        return;
      }

      flatten(value, deep, level + 1, ret);
    });

    return ret;
  }

  function values(obj) {
    return objKeys(obj).map(function(key) {
      return obj[key];
    });
  }

  // function only
  function bindRight() {
    var self = this;
    var args = clone(arguments);

    return function() {
      return self.apply(this, clone(arguments).concat(args));
    };
  }

  function difference(arr) {
    var rest = flatten(arrSlice.call(arguments, 1));

    return $.filter(arr, function(value) {
      return !contains(rest, value);
    });
  }

  function contains(arr, item) {
    return !!~arrIndexOf.call(arr, item);
  }

  // array-like only
  function merge() {
    return arrConcat.apply([], map(arguments, function(value) {
      if (!arrIsArray(value) && isArrayLike(value)) {
        value = clone(value);
      }

      return value;
    }));
  }

  function partial(func) {
    var boundArgs = arrSlice.call(arguments, 1);

    return function() {
      return func.apply(this, merge(boundArgs.slice(), arguments));
    };
  }

  function capitalize(str) {
    return str[0].toUpperCase() + str.substr(1);
  }

  function indexOf(value, arr) {
    return arrIndexOf.call(value, arr);
  }

  return {
    every: every,
    some: some,
    map: map,
    each: each,
    clone: clone,
    unique: unique,
    filter: filter,
    reject: reject,
    extend: extend,
    last: last,
    first: first,
    get: get,
    flatten: flatten,
    isArrayLike: isArrayLike,
    values: values,
    bindRight: bindRight,
    indexOf: indexOf,
    difference: difference,
    contains: contains,
    merge: merge,
    negate: negate,
    partial: partial,
    capitalize: capitalize
  };
})(ecmaQuery));
