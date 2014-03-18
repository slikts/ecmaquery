'use strict';

Object.assign($.fn, (function($) {
  return {
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
    has: function(selector, context) {

    },
    filter: function(selector) {
      return this.pushStack($.filterMatches(this, selector));
    }
  };
})(ecmaQuery));
