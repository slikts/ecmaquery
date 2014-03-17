'use strict';

Object.assign($, (function() {
  return {
  };
})());

Object.assign($.fn, (function() {
  var matchesSelector = (function() {
    var elProto = Element.prototype;
    var fn = elProto.webkitMatchesSelector || elProto.mozMatchesSelector || elProto.oMatchesSelector || elProto.matchesSelector;

    function matchesSelector(el, selector) {
      if (!selector) {
        return undefined;
      }

      return fn.call(el, selector);
    }

    return matchesSelector;
  })();

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
    matchesSelector: matchesSelector
  };
})());
