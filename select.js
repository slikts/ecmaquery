'use strict';

Object.assign(ecmaQuery, (function($) {
  var matchesSelector = Element.prototype.matches;

  return {
    find: function(selector, context) {
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
    filterElems: function(elems, x, not) {
      if (x === 'string') {
        return $.filterMatches(elems, x, not);
      }

      if (typeof x === 'function') {
        return $.filter(elems, function(el, i) {
          return x.call(el, i);
        });
      }
      // XXX
      //return $.indexOf()

    },
    filterMatches: function(elems, selector, not) {
      if (not) {
        selector = [':not(', selector, ')'].join('');
      }
      // XXX $.bindRight
      return $.filter(elems, function(el) {
        return $.matchesSelector(el, selector);
      });
    },
    matchesSelector: function(el, selector) {
      if (!selector) {
        return undefined;
      }

      return matchesSelector.call(el, selector);
    }
  };
})(ecmaQuery));

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
