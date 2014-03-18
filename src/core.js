'use strict';

(function(window) {
  var $_ = window.$;
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
    add: function(x, context) {
      // XXX
      return this.pushStack($.merge(this, $.find(x, context)));
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

  ecmaQuery.noConflict = function() {
    window.$ = $_;

    return $;
  };

  window.$ = window.ecmaQuery = $;
})(window);
