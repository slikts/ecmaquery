'use strict';

// dom methods
Object.assign($.fn, (function() {
  function _setProp(name, data) {
    if (data === undefined) {
      return this.length ? this[0][name] : undefined;
    }

    $.each(this, function(el) {
      el[name] = data;
    });
    
    return undefined;
  }

  function walk(el, prop, callback) {
    var node = el[prop];
    if (node && callback(node)) {
      walk(node, prop, callback);
    }
  }

  return {
    html: function html(data) {
      return _setProp.call(this, 'innerHTML', data) || this;
    },
    text: function text(data) {
      return _setProp.call(this, 'innerText', data) || this;
    },
    closest: function(selector, context) {
      var matches = [];
      $.each(this, function(el) {
        walk(el, 'parentNode', function(node) {
          if (node === context || node === document) {
            return false;
          }
          if ($.matchesSelector(node, selector)) {
            matches.push(node);

            return false;
          }
          
          return true;
        });
      });

      return this.pushStack(matches, context);
    },
    append: function() {
      var elems = $.flatten(arguments);
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
  var tempBlock = document.createElement('div');

  return {
    parseHTML: function(html) {
      var elems;

      tempBlock.innerHTML = html;
      elems = $.toArray(tempBlock.children);
      elems.forEach(tempBlock.removeChild, tempBlock);

      return elems;
    },
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
    matchesSelector: (function() {
      var elProto = Element.prototype;
      var fn = elProto.webkitMatchesSelector || elProto.mozMatchesSelector || elProto.oMatchesSelector || elProto.matchesSelector;

      function matchesSelector(el, selector) {
        if (!selector) {
          return undefined;
        }
        
        return fn.call(el, selector);
      }

      return matchesSelector;
    })()
  };
})());
