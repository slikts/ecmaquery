'use strict';

Object.assign(ecmaQuery, (function($, getComputedStyle) {
  var sizeProps = /width|height|top|right|bottom|left|margin.*|padding.*|min-.+/;
  var getHeight = $.partial(getDimension, 'Height');
  var getWidth = $.partial(getDimension, 'Width');

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

  function getDimension(name, el, outer) {
    return el['offset' + name];
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
