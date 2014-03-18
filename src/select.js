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
