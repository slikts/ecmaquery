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
    if (Map) {
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
        var typeData = data[typeof obj];

        if (!typeData) {
            return;
        }

        return typeData[obj[mapKey]];
    }

    function set(data, mapKey, obj, value) {
        var type = typeof obj;
        var objKey;
        var store;

        if (!data[type]) {
            data[type] = {};
        }
        store = data[type];

        if (type === 'object' || type === 'function') {
            if (!obj.hasOwnProperty(mapKey)) {
                objKey = makeUniqueKey();
                Object.defineProperty(obj, mapKey, {
                    enumerable: false,
                    writable: false,
                    configurable: false,
                    value: objKey
                });
            } else {
                objKey = obj[mapKey];
            }
            store[objKey] = value;
        } else {
            store[obj] = value;
        }
    }

    function Map() {
        if (!(this instanceof Map)) {
            throw new TypeError('Constructor Map requires \'new\'');
        }

        var mapKey = makeUniqueKey();
        var data = {};

        this.set = set.bind(this, data, mapKey);
        this.get = get.bind(this, data, mapKey);
    }

    window.Map = Map;
})();
