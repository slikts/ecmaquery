'use strict';

Object.assign(ecmaQuery, (function($, getComputedStyle) {
  var sizeProps = /width|height|top|right|bottom|left|margin.*|padding.*|min-.+/;

  function checkPropValue(prop, value) {
    if ((typeof value === 'number' || /^\d+$/.test(value))
        && sizeProps.test(prop)) {
      value += 'px';
    }

    return value;
  }

  function normalizePropName(prop) {
    return prop.replace(/([A-Z])/g, '-$1').toLowerCase();
  }

  function getStyle(el, prop, pseudo) {
    prop = normalizePropName(prop);

    if (pseudo) {
      return getComputedStyle(el, pseudo)[prop];
    }

    return el.style[prop] || getComputedStyle(el)[prop];
  }

  function getHeight(el, outer) {
    return el.offsetHeight;
  }

  function getWidth(el, outer) {
    return el.offsetWidth;
  }

  return {
    isVisible: function(el) {
      return getHeight(el) > 0 && getWidth(el) > 0
          && getStyle(el, 'display') !== 'none';
    },
    setStyle: function(el, prop, value) {
      prop = normalizePropName(prop);

      if (!value && value !== 0) {
        return el.style.removeProperty(prop);
      }

      return el.style.setProperty(prop, checkPropValue(prop, value));
    },
    getStyle: getStyle,
    getHeight: getHeight,
    getWidth: getWidth
  };
})(ecmaQuery, window.getComputedStyle));

Object.assign(ecmaQuery.fn, (function($) {
  function dimension(name, value) {
    if (value === undefined) {
      return $['get' + name[0].toUpperCase() + name.substr(1)](this[0]);
    }

    this.each(function() {
      $.setStyle(this, name, value);
    });

    return this;
  }

  return {
    css: function(x, value) {
      var props;

      if (typeof x === 'string') {
        if (value === undefined) {
          return $.getStyle(this[0], x);
        }

        props = {};
        props[x] = value;
      } else {
        props = x;
      }

      this.each(function(i, el) {
        $.each(props, function(value, prop) {
          $.setStyle(el, prop, value);
        });
      });

      return this;
    },
    hide: function() {
      return this.css('display', 'none');
    },
    show: function() {
      return this.css('display', null);
    },
    visible: function() {
      return this.pushStack($.filter(this, $.isVisible));
    },
    hidden: function() {
      return this.pushStack($.reject(this, $.isVisible));
    },
    offset: function() {
      var el = this[0];

      return {
        top: el.offsetTop,
        left: el.offsetLeft
      };
    },
    height: $.partial(dimension, 'height'),
    width: $.partial(dimension, 'width')
  };
})(ecmaQuery));
