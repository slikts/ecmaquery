'use strict';

if (!Object.assign) {
    Object.assign = function(target, source) {
        return Object.keys(source).reduce(function(target, key) {
            target[key] = source[key];
            return target;
        }, target);
    };
}

window.Map = window.Map || (function() {
    var keyCache = [];

    function makeUniqueKey() {
        var key = ['__map_key', Math.random(), '__'].join('');

        if (!~keyCache.indexOf(key)) {
            keyCache.push(key);

            return key;
        }

        return makeUniqueKey();
    }

    function get(data, mapKey, obj) {
        if (obj instanceof Object) {
            return obj[mapKey];
        }

        var type = typeof obj;

        return data[type] ? data[type][obj[mapKey]] : undefined;
    }

    function set(data, mapKey, obj, value) {
        var type;

        if (obj instanceof Object) {
            if (!obj.hasOwnProperty(mapKey)) {
                Object.defineProperty(obj, mapKey, {
                    enumerable: false,
                    writable: true,
                    configurable: false,
                    value: value
                });
            } else {
                obj[mapKey] = value;
            }
        } else {
            type = typeof obj;
            if (!data[type]) {
                data[type] = {};
            }
            data[type][obj] = value;
        }
    }

    function Map() {
        var mapKey = makeUniqueKey();
        var self = Object.create(Map.prototype);
        var data = {};

        self.set = set.bind(self, data, mapKey);
        self.get = get.bind(self, data, mapKey);

        return self;
    }

    return Map;
})();
