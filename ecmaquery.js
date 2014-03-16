'use strict';

(function() {
    var tempBlock = document.createElement('div');
    var dataMap = new Map();
    var proto;

    function ecmaQuery(selector, context) {
        return Object.create(proto).init(selector, context);
    }

    proto = ecmaQuery.prototype = {
        length: 0,
        init: function(selector, context) {
            var elems = [];

            context = context || document;

            if (typeof selector === 'function') {
                return this.ready(selector);
            }
            if (typeof selector === 'string') {
                if (selector[0] === '<') {
                    tempBlock.innerHTML = selector;
                    elems = ecmaQuery.clone(tempBlock.children);
                    elems.forEach(tempBlock.removeChild, tempBlock);
                } else {
                    elems = context.querySelectorAll(selector);
                }
            } else if (selector instanceof ecmaQuery) {
                return selector;
            } else if (selector && !selector.length) {
                elems = [selector];
            }
            Object.assign(this, elems);

            return this;
        },
        find: function(selector) {
            this.selector = selector;

        },
        html: function(html) {
            if (html === undefined) {
                return this[0] ? this[0].innerHTML : undefined;
            }


        },
        data: function(key, value) {
            if (!this.length) {
                return undefined;
            }

            var elem = this[0];
            var data = dataMap.get(elem);
            var dataset = elem.dataset;

            if (!data) {
                data = ecmaQuery.map(clone(dataset), function(key) {
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
            arrProto.every.call(this, function(item, i) {
                return callback.call(item, i, item) !== false;
            });

            return this;
        },
        is: function(selector) {
            var test;

            if (typeof selector === 'string') {
                return arrProto.some.call(this, testSelector.bind(this, selector));
            }
        },
        add: function(selector, context) {

        },
        pushStack: function(elems) {

        },
        end: function() {
            return this.prevObject || this.constructor(null);
        },
        index: function(elem) {

        },
        closest: function(selector, context) {

        },
        has: function(selector, context) {

        },
        filter: function(selector, context) {

        },
        map: function(callback) {

        },
        first: function() {
            return this.eq(0);
        },
        last: function() {
            return this.eq(-1);
        },
        eq: function(i) {
            var len = this.length,
                    j = +i + (i < 0 ? len : 0);
            return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
        },
        get: function(num) {

        },
        toArray: function() {
            return slice.call(this);
        },
        splice: Array.prototype.splice
                //parent
                //parents
                //parentsUntil
                //nextUntil
                //prevUntil
                //nextAll
                //prevAll
                //children
                //contents
                //siblings

                //append
                //prepend
                //before
                //after
                //text
                //empty
                //clone
                //html
                //replaceWith

                //css
    };


    Object.assign(ecmaQuery, {
        find: function(selector, elems) {
            if (!elems.length) {
                elems = [elems];
            } else {
                elems = ecmaQuery.clone(elems);
            }
            console.log(elems)
            return arrProto.concat(ecmaQuery.map(elems, function(item) {
                return item.querySelectorAll(selector);
            }));
        },
        filter: function(selector, elems, not) {


        }
    });

    // util
    (function() {
        var keys = Object.keys;
        var assign = Object.assign;
        var create = Object.create;
        var getPrototypeOf = Object.getPrototypeOf;
        var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
        var getOwnPropertyNames = Object.getOwnPropertyNames;
        var arrProto = Array.prototype;
        var arrForEach = arrProto.forEach;
        var arrMap = arrProto.map;
        var arrReduce = arrProto.reduce;
        var arrFilter = arrProto.filter;
        var arrEvery = arrProto.every;

        function every(obj, callback, thisArg) {
            if (obj.length) {
                return arrEvery.call(obj, callback, thisArg);
            }

            return keys(obj).every(function(key) {
                return callback.call(thisArg, obj[key], key, obj);
            });
        }

        function map(obj, callback, thisArg) {
            if (obj.length) {
                return arrMap.call(obj, callback, thisArg);
            }

            each(keys(obj), function(value, key) {
                obj[key] = callback.apply(thisArg, arguments);
            }, thisArg);

            return obj;
        }

        function extend() {
            return arrReduce.call(arguments, function(a, b) {
                return assign(a, b);
            });
        }

        function filter(obj, callback, thisArg) {
            callback = callback || function(value) {
                return value;
            };

            if (obj.length) {
                return arrFilter.call(obj, callback, thisArg);
            }

            var ret = create(getPrototypeOf(obj));

            each(keys(obj).filter(function(key) {
                return callback.call(thisArg, obj[key], key, obj);
            }), function(key) {
                ret[key] = obj[key];
            });

            return ret;
        }

        function each(obj, callback, thisArg) {
            if (obj.length) {
                return arrForEach.call(obj, callback, thisArg);
            }

            arrForEach.call(keys(obj), function(key) {
                callback.call(thisArg, obj[key], key, obj);
            }, thisArg);
        }

        // array-like only
        function unique(obj) {
            return arrFilter.call(obj, function(val, i, arr) {
                return (i <= arr.indexOf(val));
            });
        }

        function clone(obj, deep, callback) {
            if (!(obj instanceof Object)) {
                return obj;
            }

            var descriptors = {};

            getOwnPropertyNames(obj).forEach(function(name) {
                var prop = getOwnPropertyDescriptor(obj, name);

                if (deep) {
                    prop.value = clone(prop.value);
                }

                descriptors[name] = prop;
            });

            return create(getPrototypeOf(obj), descriptors);
        }

        function last(obj) {
            if (obj.length) {
                return obj[obj.length - 1];
            }

            return obj[last(keys(obj).sort())];
        }

        function first(obj) {
            if (obj.length) {
                return obj[0];
            }

            return obj[keys(obj).sort()[0]];
        }

        assign(ecmaQuery, {
            every: every,
            map: map,
            each: each,
            clone: clone,
            unique: unique,
            filter: filter,
            extend: extend,
            last: last,
            first: first
        });
    })();



    // ??
    function testSelector(selector, item) {
        var parent = item.parentNode;
        if (!parent) {
            parent = document.createDocumentFragment();
            parent.appendChild(item);
        }
        return !!~arrProto.indexOf.call(parent.querySelectorAll(selector), item);
    }

    window.$ = ecmaQuery;

})();
