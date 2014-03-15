'use strict';

if (!Object.assign) {
    Object.assign = function(target, source) {
        return Object.keys(source).reduce(function(target, key) {
            target[key] = source[key];
            return target;
        }, target);
    };
}

(function() {
    if (window.Map) {
        return;
    }

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
        if (!(this instanceof Map)) {
            throw new TypeError("Constructor Map requires 'new'");
        }

        var mapKey = makeUniqueKey();
        var data = {};

        this.set = set.bind(this, data, mapKey);
        this.get = get.bind(this, data, mapKey);
    }

    window.Map = Map;
})();
