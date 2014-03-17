'use strict';

// array/object utils
Object.assign(ecmaQuery, (function($) {
  var objKeys = Object.keys;
  var objAssign = Object.assign;
  var objCreate = Object.create;
  var objGetPrototypeOf = Object.getPrototypeOf;
  var objGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
  var objGetOwnPropertyNames = Object.getOwnPropertyNames;

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

  function indexOf(obj, x) {
    return arrIndexOf.call(obj, x);
  }

  function every(obj, callback, thisArg) {
    if (isArrayLike(obj)) {
      return arrEvery.call(obj, callback, thisArg);
    }

    return objKeys(obj).every(function(key) {
      return callback.call(thisArg, obj[key], key, obj);
    });
  }

  function some(obj, callback, thisArg) {
    if (isArrayLike(obj)) {
      return arrSome.call(obj, callback, thisArg);
    }

    return objKeys(obj).some(function(key) {
      return callback.call(thisArg, obj[key], key, obj);
    });
  }

  function each(obj, callback, thisArg) {
    if (isArrayLike(obj)) {
      return arrForEach.call(obj, callback, thisArg);
    }

    return arrForEach.call(objKeys(obj), function(key) {
      callback.call(thisArg, obj[key], key, obj);
    }, thisArg);
  }

  function map(obj, callback, thisArg) {
    if (isArrayLike(obj)) {
      return arrMap.call(obj, callback, thisArg);
    }

    var ret = clone(obj);

    each(objKeys(ret), function(value, key) {
      ret[key] = callback.apply(thisArg, arguments);
    }, thisArg);

    return ret;
  }

  function extend() {
    return arrReduce.call(arguments, function(target, source) {
      return objAssign(target, source);
    });
  }

  function filter(obj, callback, thisArg) {
    callback = callback || function(value) {
      return value;
    };

    if (obj.length) {
      return arrFilter.call(obj, callback, thisArg);
    }

    var ret = objCreate(objGetPrototypeOf(obj));

    each(objKeys(obj).filter(function(key) {
      return callback.call(thisArg, obj[key], key, obj);
    }), function(key) {
      ret[key] = obj[key];
    });

    return ret;
  }

  function reject(obj, callback, thisArg) {
    return filter(obj, negate(callback), thisArg);
  }

  // function only
  function negate(func) {
    return function() {
      return !func.apply(this, arguments);
    };
  }

  // array-like only
  function unique(obj) {
    return arrFilter.call(obj, function(val, i, arr) {
      return (i <= arrIndexOf.call(arr, val));
    });
  }

  function clone(obj, deep, callback) {
    if (!(obj instanceof Object)) {
      return obj;
    }

    var descriptors = {};

    objGetOwnPropertyNames(obj).forEach(function(name) {
      var prop = objGetOwnPropertyDescriptor(obj, name);

      if (deep) {
        prop.value = $.clone(prop.value);
      }

      descriptors[name] = prop;
    });

    return objCreate(objGetPrototypeOf(obj), descriptors);
  }

  function get(obj, i) {
    if (!isArrayLike(obj)) {
      obj = objKeys(obj).sort();
    }

    var len = obj.length;
    if (i < 0) {
      i += len;
    }

    return obj[i];
  }

  function isArrayLike(obj) {
    return obj.length !== undefined;
  }

  function last(obj) {
    return get(obj, -1);
  }

  function first(obj) {
    return get(obj, 0);
  }

  // array-like only
  function flatten(obj, deep, level, ret) {
    if (!deep && every(obj, isArrayLike)) {
      return merge.apply(this, obj);
    }

    level = level || 0;
    ret = ret || [];

    arrForEach.call(obj, function(value) {
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

  // array-like only
  function toArray(obj) {
    return arrSlice.call(obj);
  }

  // function only
  function bindRight() {
    var self = this;
    var args = toArray(arguments);

    return function() {
      return self.apply(this, toArray(arguments).concat(args));
    };
  }

  // array-like only
  function difference(arr) {
    var rest = flatten(arrSlice.call(arguments, 1));

    return $.filter(arr, function(value) {
      return !contains(rest, value);
    });
  }

  // array-like only
  function contains(arr, item) {
    return !!~arrIndexOf.call(arr, item);
  }

  // array-like only
  function merge() {
    return arrConcat.apply([], map(arguments, function(value) {
      if (!arrIsArray(value) && isArrayLike(value)) {
        value = toArray(value);
      }

      return value;
    }));
  }

  // function only
  function partial(func) {
    var boundArgs = arrSlice.call(arguments, 1);

    return function() {
      return func.apply(this, merge(boundArgs.slice(), arguments));
    };
  }

  // string only
  function capitalize(str) {
    return str[0].toUpperCase() + str.substr(1);
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
    toArray: toArray,
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
