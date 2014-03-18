'use strict';

Object.assign(ecmaQuery.fn, (function($) {
  return {
    data: function(key, value) {
      if (!this.length) {
        return undefined;
      }

      return $.data(this[0], key, value) || this;
    }
  };
})(ecmaQuery));
