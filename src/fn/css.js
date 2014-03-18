'use strict';

Object.assign(ecmaQuery.fn, (function($) {
  function dimension(name, value) {
    if (value === undefined) {
      return $['get' + $.capitalize(name)](this[0]);
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
    addClass: function() {

    },
    removeClass: function() {

    },
    toggleClass: function() {

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
