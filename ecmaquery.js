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

      context = context || document;

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
      }
      this.pushStack(elems, context);

      return this;
    },
    pushStack: function(elems, context) {
      elems = elems || [];

      if (!this.context) {
        $.extend(this, elems);
        this.context = context;

        return this;
      }

      var ret = $(elems, context);
      ret.prevObject = this;

      return ret;
    },
    get: function(i) {
      $.get(this, i);
    },
    end: function() {
      return this.prevObject || $();
    },
    find: function(selector) {
      this.selector = selector;

    },
    first: function() {
      return this.eq(0);
    },
    last: function() {
      return this.eq(-1);
    },
    eq: function(i) {
      var len = this.length,
              j = +i + (i < 0 ? len : 0);
      return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
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
    filter: function(selector, context) {

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
      find: function(selector, elems) {
        if (!elems.length) {
          elems = [elems];
        } else {
          elems = $.clone(elems);
        }
        console.log(elems)
        return arrProto.concat($.map(elems, function(item) {
          return item.querySelectorAll(selector);
        }));
      },
      filter: function(selector, elems, not) {


      }
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
      if (obj.length) {
        return arrEvery.call(obj, callback, thisArg);
      }

      return objKeys(obj).every(function(key) {
        return callback.call(thisArg, obj[key], key, obj);
      });
    }

    function some(obj, callback, thisArg) {
      if (obj.length) {
        return arrSome.call(obj, callback, thisArg);
      }

      return objKeys(obj).some(function(key) {
        return callback.call(thisArg, obj[key], key, obj);
      });
    }

    function each(obj, callback, thisArg) {
      if (obj.length) {
        return arrForEach.call(obj, callback, thisArg);
      }

      return arrForEach.call(objKeys(obj), function(key) {
        callback.call(thisArg, obj[key], key, obj);
      }, thisArg);
    }

    function map(obj, callback, thisArg) {
      if (obj.length) {
        return arrMap.call(obj, callback, thisArg);
      }

      each(objKeys(obj), function(value, key) {
        obj[key] = callback.apply(thisArg, arguments);
      }, thisArg);

      return obj;
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

    // array-like only
    function get(arr, i) {
      var len = arr.length;

      i = i % len;
      if (i < 0) {
        i += len;
      }
      return arr[i];
    }

    function last(obj) {
      if (obj.length) {
        return get(obj, - 1);
      }

      return obj[last(objKeys(obj).sort())];
    }

    function first(obj) {
      if (obj.length) {
        return obj[0];
      }

      return obj[objKeys(obj).sort()[0]];
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
      get: get
    };
  })());



  // ??
  function testSelector(selector, item) {
    var parent = item.parentNode;
    if (!parent) {
      parent = document.createDocumentFragment();
      parent.appendChild(item);
    }
    return !!~arrProto.indexOf.call(parent.querySelectorAll(selector), item);
  }

  window.$ = $;

})();
