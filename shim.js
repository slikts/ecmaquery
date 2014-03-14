'use strict';

(function() {
    if (!Object.assign) {
        Object.assign = function(target, source) {
            return Object.keys(source).reduce(function(target, key) {
                target[key] = source[key];
                return target;
            }, target);
        };
    }
})();
