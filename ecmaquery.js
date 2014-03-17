'use strict';

//(function() {
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


// dom methods
Object.assign(proto, (function() {
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
      ;

      return matchesSelector;
    })()
  };
})());

//window.$ = $;

//})();
