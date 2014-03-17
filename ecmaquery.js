'use strict';

(function() {
  var $ = ecmaQuery;
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
        // x is a ready handler
        return this.ready(x);
      }
      if (typeof x === 'string') {
        if (x[0] === '<') {
          // x is HTML
          elems = $.parseHTML(x);
        } else {
          // x is a CSS selector
          elems = $.find(x, context);
        }
      } else if (x instanceof $) {
        // x is $()
        return x;
      } else if (x && !$.isArrayLike(x)) {
        // x is a single element
        elems = [x];
      } else {
        // x is a collection of elements
        elems = x;
      }

      return this.pushStack(elems, context);
    },
    pushStack: function(elems, context) {
      if (elems && elems.length) {
        elems = $.unique($.filter(elems));
      } else {
        elems = [];
      }
      context = context || this.context || document;

      if (!this.context) {
        // this is a new $()
        $.extend(this, elems);
        this.length = elems.length;
        this.context = context;

        return this;
      }

      var ret = $(elems, context);
      ret.prevObject = this;

      return ret;
    },
    end: function() {
      return this.prevObject || $();
    },
    get: function(i) {
      return $.get(this, i);
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
    each: function(callback) {
      $.every(this, function(item, i) {
        return callback.call(item, i, item) !== false;
      });

      return this;
    },


    // selectors
    find: function(x) {
      // XXX handle collections, elements
      return this.pushStack($.find(x, this), this.context);
    },
    not: function(selector) {
      // XXX
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
