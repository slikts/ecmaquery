'use strict';

//(function() {
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
  init: function(x, context) {
    var elems;

    if (typeof x === 'function') {
      return this.ready(x);
    }
    if (typeof x === 'string') {
      if (x[0] === '<') {
        tempBlock.innerHTML = x;
        elems = $.clone(tempBlock.children);
        elems.forEach(tempBlock.removeChild, tempBlock);
      } else {
        elems = $.find(x, context);
      }
    } else if (x instanceof $) {
      return x;
    } else if (x && !x.length) {
      elems = [x];
    } else {
      elems = x;
    }
    this.pushStack(elems, context);

    return this;
  },
  pushStack: function(elems, context) {
    if (elems && elems.length) {
      elems = $.unique($.filter(elems));
    } else {
      elems = [];
    }
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
    // XXX handle collections, elements
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
  data: function(key, value) {
    if (!this.length) {
      return undefined;
    }

    var elem = this[0];
    var data = dataMap.get(elem);
    var dataset = elem.dataset;

    if (!data) {
      data = $.map($.clone(dataset), function(key) {
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
    $.every(this, function(item, i) {
      return callback.call(item, i, item) !== false;
    });

    return this;
  },
  not: function(selector) {
    return this.pushStack($.filterMatches(this, selector, true));
  },
  is: function(x) {
    // XXX handle functions, collections and elements
    return !!$.filterMatches(this, x).length;
  },
  add: function(selector, context) {
    return this.pushStack($.merge(this, $.find(selector, context)));
  },
  index: function(x) {
    var el;

    if (x === undefined) {
      el = this[0];
      if (!el.parentNode) {
        return -1;
      }
      return $.indexOf(el.parentNode.children, el);
    }

    if (typeof x === 'string') {
      el = $.filterMatches(this, x)[0];
    } else if ($.isArrayLike(x) && x.length) {
      x = x[0];
    }

    return $.indexOf(this, el);
  },
  has: function(selector, context) {

  },
  filter: function(selector) {
    return this.pushStack($.filterMatches(this, selector));
  },
  map: function(callback) {
    return this.pushStack($.map(this.toArray(), function(el, i) {
      return callback.call(el, i, el);
    }));
  },
  toArray: function() {
    return $.toArray(this);
  },
  clone: function() {
    return this.pushStack(this);
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


// dom methods
Object.assign(proto, (function() {
  function _prop(name, content) {
    if (content === undefined) {
      return this.length ? this[0][name] : undefined;
    }

    $.each(this, function(el) {
      el[name] = content;
    });
    return undefined;
  }

  return {
    html: function html(data) {
      return _prop.call(this, 'innerHTML', data) || this;
      return this;
    },
    text: function text(data) {
      return _prop.call(this, 'innerText', data) || this;
      return this;
    },
    closest: function() {

    },
    parent: function(selector) {
      var elems = $.map($.toArray(this), function(el) {
        return el.parentNode;
      });
      if (selector) {
        elems = $.filterMatches(elems, selector);
      }

      return this.pushStack(elems);
    }
  };
})());

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
    filterElems: function(elems, selector, not) {
      if (selector === 'string') {
        return $.filterMatches(elems, selector, not);
      }

      var callback;

      if (typeof selector === 'function') {
        return $.filter(elems, function(el, i) {
          return selector.call(el, i);
        });
      }
      // XXX
      //return $.indexOf()

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

  // XXX
  function toArrayLike(obj) {
    if (isArrayLike(obj)) {
      return obj;
    }

    var ret = objCreate(null);

    ret[0] = obj;
    ret.length = 1;

    return ret;
  }

  function toArray(obj) {
    return arrSlice.call(obj, 0);
  }

  // XXX
  function bindRight() {
    var self = this;
    var args = arrProto.slice.call(arguments);
    return function() {
      return self.apply(this, arrProto.slice.call(arguments).concat(args));
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
    return ~arrIndexOf.call(arr, item);
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
    toArray: toArray,
    values: values,
    bindRight: bindRight,
    indexOf: indexOf,
    difference: difference,
    contains: contains,
    merge: merge
  };
})());

window.$ = $;

//})();
