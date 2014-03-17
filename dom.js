'use strict';

// dom methods
Object.assign($.fn, (function() {
  function prop(name, data) {
    if (data === undefined) {
      return this.length ? this[0][name] : undefined;
    }

    $.each(this, function(el) {
      el[name] = data;
    });

    return this;
  }

  function walk(el, prop, callback) {
    var node = el[prop];
    if (node && callback(node)) {
      walk(node, prop, callback);
    }
  }

  return {
    html: $.partial(prop, 'innerHTML'),
    text: $.partial(prop, 'innerText'),
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

      return this.each(function(i) {
        var target = this;
        $.each(elems, function(node) {
          $.appendNode(i ? node.cloneNode(true) : node, target);
        });
      });
    },
    remove: function(selector) {
      var elems = this.length && selector ? $.filterMatches(this, selector) : this;

      $.each(elems, function(el) {
        $.removeNode(el);
      });

      return this;
    },
    empty: function() {
      return this.each(function() {
        $.each($.toArray(this.childNodes), $.removeNode);
      });
    },
    parent: function(selector) {
      var elems = $.map($.toArray(this), function(el) {
        return el.parentNode;
      });
      if (selector) {
        elems = $.filterMatches(elems, selector);
      }

      return this.pushStack(elems);
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
    }
  };
})());

// dom utils
Object.assign($, (function() {
  var tempBlock = document.createElement('div');
  var tagRegex = /^<(\w+)>$/;

  return {
    appendNode: function(node, target) {
      target.appendChild(node);
    },
    removeNode: function(node) {
      var parent = node.parentNode;

      if (!parent) {
        return;
      }

      parent.removeChild(node);
    },
    parseHTML: function(html) {
      var elems;
      var match = tagRegex.exec(html);

      if (match) {
        elems = [document.createElement(match[1])];
      } else {
        tempBlock.innerHTML = html;
        elems = $.toArray(tempBlock.children);
        elems.forEach(tempBlock.removeChild, tempBlock);
      }

      return elems;
    }
  };
})());
