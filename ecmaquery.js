'use strict';

(function() {
  var $ = ecmaQuery;
  var tempBlock = document.createElement('div');
  var dataMap = new Map();
  var proto;

  function ecmaQuery(selector, context) {
    return Object.create(proto).init(selector, context);
  }

  // core
  proto = $.prototype = {
    constructor: $,
    length: 0,
    init: function(selector, context) {
      var elems;

      if (typeof selector === 'function') {
        return this.ready(selector);
      }
      if (typeof selector === 'string') {
        if (selector[0] === '<') {
          tempBlock.innerHTML = selector;
          elems = $.clone(tempBlock.children);
          elems.forEach(tempBlock.removeChild, tempBlock);
        } else {
          elems = $.find(selector, context);
        }
      } else if (selector instanceof $) {
        return selector;
      } else if (selector && !selector.length) {
        elems = [selector];
      } else {
        elems = selector;
      }
      this.pushStack(elems, context);

      return this;
    },
    pushStack: function(elems, context) {
      elems = elems || [];
      context = context || this.context || document;

      if (!this.context) {
        $.extend(this, elems);
        this.length = elems.length;
        this.context = context;

        return this;
      }

      var ret = $(elems, context);
      ret.prevObject = this;

      return ret;
    },
    get: function(i) {
      return $.get(this, i);
    },
    end: function() {
      return this.prevObject || $();
    },
    find: function(selector) {
      return this.pushStack($.find(selector, this), this.context);
    },
    first: function() {
      return this.eq(0);
    },
    last: function() {
      return this.eq(-1);
    },
    eq: function(i) {
      return this.pushStack([this.get(i)]);
    },
    html: function(html) {
      if (html === undefined) {
        return this.length === 1 ? this.first().innerHTML : undefined;
      }

    },
    data: function(key, value) {
      if (!this.length) {
        return undefined;
      }

      var elem = this[0];
      var data = dataMap.get(elem);
      var dataset = elem.dataset;

      if (!data) {
        data = $.map(clone(dataset), function(key) {
          var value = dataset[key];

          try {
            return JSON.parse(value);
          } catch (err) {
            if (err instanceof SyntaxError) {
              return value;
            }
            throw err;
          }
        });
        dataMap.set(elem, data);
      }

      if (!key) {
        return data;
      }
      if (value !== undefined) {
        data[key] = value;
        return this;
      }
      return data[key];
    },
    each: function(callback) {
      arrProto.every.call(this, function(item, i) {
        return callback.call(item, i, item) !== false;
      });

      return this;
    },
    is: function(selector) {
      var test;

      if (typeof selector === 'string') {
        return arrProto.some.call(this, testSelector.bind(this, selector));
      }
    },
    add: function(selector, context) {

    },
    index: function(elem) {

    },
    closest: function(selector, context) {

    },
    has: function(selector, context) {

    },
    filter: function(selector) {
      return this.pushStack($.filterMatches(this, selector));
    },
    map: function(callback) {

    },
    toArray: function() {
      return slice.call(this);
    },
    splice: Array.prototype.splice
        //parent
        //parents
        //parentsUntil
        //nextUntil
        //prevUntil
        //nextAll
        //prevAll
        //children
        //contents
        //siblings

        //append
        //prepend
        //before
        //after
        //text
        //empty
        //clone
        //html
        //replaceWith

        //css
  };

  // dom utils
  Object.assign($, (function() {

    return {
      find: function find(selector, context) {
        if (!context) {
          context = [document];
        } else if (!context.length) {
          context = [context];
        } else {
          context = $.clone(context);
        }
        return $.flatten($.map(context, function(item) {
          return item.querySelectorAll(selector);
        }));
      },
      filterMatches: function filterMatches(elems, selector, not) {
        if (not) {
          selector = [':not(', selector, ')'].join('');
        }
        // XXX $.bindRight
        return $.filter(elems, function(el) {
          return $.matchesSelector(el, selector);
        });
      },
      matchesSelector: (function() {
        var elProto = Element.prototype;
        var fn = elProto.webkitMatchesSelector || elProto.mozMatchesSelector || elProto.oMatchesSelector || elProto.matchesSelector;

        return function matchesSelector(el, selector) {
          return fn.call(el, selector);
        };
      })()
    };
  })());

  // array/object utils
  Object.assign($, (function() {
    var objKeys = Object.keys;
    var objAssign = Object.assign;
    var objCreate = Object.create;
    var objGetPrototypeOf = Object.getPrototypeOf;
    var objGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
    var objGetOwnPropertyNames = Object.getOwnPropertyNames;

    var arrProto = Array.prototype;
    var arrForEach = arrProto.forEach;
    var arrMap = arrProto.map;
    var arrReduce = arrProto.reduce;
    var arrFilter = arrProto.filter;
    var arrEvery = arrProto.every;
    var arrSome = arrProto.some;

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
      return arrReduce.call(arguments, function(a, b) {
        return objAssign(a, b);
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

    // array-like only
    function unique(obj) {
      return arrFilter.call(obj, function(val, i, arr) {
        return (i <= arr.indexOf(val));
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
          prop.value = clone(prop.value);
        }

        descriptors[name] = prop;
      });

      return objCreate(objGetPrototypeOf(obj), descriptors);
    }

    function _posMod(a, b) {
      a = a % b;
      if (a < 0) {
        a += b;
      }
      return a;
    }

    function get(obj, i) {
      if (!isArrayLike(obj)) {
        obj = objKeys(obj).sort();
      }
      return obj[_posMod(i, obj.length)];
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
    function flatten(obj, deep) {
      var ret = [];

      arrForEach.call(obj, function(value) {
        arrForEach.call(value, function(subValue) {
          ret.push(subValue);
        });
      });

      return ret;
    }

    function values(obj) {
      return objKeys(obj).map(function(key) {
        return obj[key];
      });
    }

    function toArrayLike(obj) {
      if (isArrayLike(obj)) {
        return obj;
      }

      var ret = objCreate(null);

      ret[0] = obj;
      ret.length = 1;

      return ret;
    }

    // XXX
    function bindRight() {
      var self = this;
      var args = arrProto.slice.call(arguments);
      return function() {
        return self.apply(this, arrProto.slice.call(arguments).concat(args));
      };
    }

    return {
      every: every,
      some: some,
      map: map,
      each: each,
      clone: clone,
      unique: unique,
      filter: filter,
      extend: extend,
      last: last,
      first: first,
      get: get,
      flatten: flatten,
      toArrayLike: toArrayLike,
      values: values,
      bindRight: bindRight
    };
  })());

  window.$ = $;

})();
