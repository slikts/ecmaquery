'use strict';

(function(window, document) {
    var log = console.log.bind(console);
    var tempBlock = document.createElement('div');
    var dataMap = new Map();
    var arr = Array.prototype;
    var proto, ecmaQuery;

    function map(elems, callback, thisArg) {
        if (elems.length) {
            return arr.map.call(elems, callback, thisArg);
        } else {
            arr.forEach.call(Object.keys(elems), function(key) {
                elems[key] = callback.apply(thisArg, arguments);
            }, thisArg);
            return elems;
        }
    }

    function merge() {
        return arr.reduce.call(arguments, function(a, b) {
            return Object.assign(a, b);
        });
    }

    function clone(obj) {
        return merge({}, obj);
    }

    proto = {
        init: function(selector, context) {
            var elems = [];

            if (selector) {

                context = context || document;

                if (typeof selector === 'string') {
                    if (selector[0] === '<') {
                        tempBlock.innerHTML = selector;
                        elems = arr.splice.call(tempBlock.children, 0);
                        elems.forEach(tempBlock.removeChild, tempBlock);
                    } else {
                        elems = context.querySelectorAll(selector);
                    }
                } else if (Object.getPrototypeOf(selector) === proto) {
                    return selector;
                } else if (!selector.length) {
                    elems = [selector];
                }
                Object.assign(this, elems);
            }
            this.length = elems.length;

            return this;
        },
        data: function(key, value) {
            if (!this.length) {
                return undefined;
            }

            var elem = this[0];
            var data = dataMap.get(elem);
            var dataset = elem.dataset;

            if (!data) {
                data = map(clone(dataset), function(key) {
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
        },
        each: function(callback) {
            arr.every.call(this, function(item, i) {
                return callback.call(item, i, item) !== false;
            });

            return this;
        },
        is: function(selector) {
            var test;

            if (typeof selector === 'string') {
                test = function(item) {
                    var parent = item.parentNode;
                    if (!parent) {
                        parent = document.createDocumentFragment();
                        parent.appendChild(item);
                    }
                    return !!~arr.indexOf.call(parent.querySelectorAll(selector), item);
                };
            }


            return arr.some.call(this, test);
        },
        splice: arr.splice
    };

    ecmaQuery = function(selector, context) {
        return Object.create(proto).init(selector, context);
    };

    ecmaQuery.fn = proto;

    window.$ = ecmaQuery;

})(window, document);
