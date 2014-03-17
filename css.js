'use strict';

Object.assign($, (function(getComputedStyle) {
  function normalizePropName(prop) {
    return prop.replace(/([A-Z])/g, '-$1').toLowerCase();
  }

  return {
    getStyle: function(el, prop, pseudo) {
      prop = normalizePropName(prop);

      if (pseudo) {
        return getComputedStyle(el, pseudo)[prop];
      }

      return el.style[prop] || getComputedStyle(el)[prop];
    },
    setStyle: function(el, prop, value) {
      prop = normalizePropName(prop);

      if (!value) {
        return el.style.removeProperty(prop);
      }

      return el.style.setProperty(prop, value);
    }
  };
})(window.getComputedStyle));

Object.assign($.fn, (function() {
  return {
    css: function(prop, value) {
      if (value === undefined) {
        return $.getStyle(this[0], prop);
      }

      this.each(function() {
        $.setStyle(this, prop, value);
      });

      return this;
    },
    hide: function() {
      return this.css('display', 'none');
    },
    show: function() {
      return this.css('display', null);
    }
  };
})());
