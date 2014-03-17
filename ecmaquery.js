'use strict';

(function() {
  var $ = ecmaQuery;
  var dataMap = new Map();
  var proto;

  function ecmaQuery(selector, context) {
    return Object.create(proto).init(selector, context);
  }

// core
  proto = $.fn = $.prototype = {
    constructor: $,
    length: 0,
    init: function(x, context) {
      var elems;

      if (typeof x === 'function') {
        return this.ready(x);
      }
      if (typeof x === 'string') {
        if (x[0] === '<') {
          elems = $.parseHTML(x);
        } else {
          elems = $.find(x, context);
        }
      } else if (x instanceof $) {
        return x;
      } else if (x && !$.isArrayLike(x)) {
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
    add: function(x, context) {
      // XXX
      return this.pushStack($.merge(this, $.find(x, context)));
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
  };

  window.$ = $;

})();
