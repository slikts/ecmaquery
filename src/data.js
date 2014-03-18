'use strict';

Object.assign(ecmaQuery, (function($) {
  var dataMap = new Map();

  return {
    data: function(el, key, value) {
      var data = dataMap.get(el);
      var dataset = el.dataset;

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
        dataMap.set(el, data);
      }

      if (!key) {
        return data;
      }
      if (value !== undefined) {
        data[key] = value;
        return undefined;
      }

      return data[key];
    }
  };
})(ecmaQuery));
