'use strict';

Object.assign($.fn, (function() {
  var dataMap = new Map();

  return {
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
    }
  };
})());
