'use strict';

(function(window, document) {
    var log = console.log.bind(console);

    var arr = Array.prototype;

    if (!Object.assign) {
        Object.assign = function(target, source) {
            return Object.keys(source).reduce(function(target, key) {
                target[key] = source[key];
                return target;
            }, target);
        };
    }

    var tempBlock = document.createElement('div');

    var proto = {
        init: function(selector, context) {
            var elems = [];

            if (!selector) {
                return this;
            }

            context = context || document;

            if (typeof selector === 'string') {
                if (selector[0] === '<'
                        && selector[selector.length - 1] === '>'
                        && selector.length >= 3) {
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
            this.length = elems.length;
            Object.assign(this, elems);

            return this;
        },
        data: function(key, value) {
        },
        each: function(callback) {
            arr.every.call(this, function(item, i) {
                return callback.call(item, i, item) !== false;
            });

            return this;
        },
        splice: arr.splice
    };

    var $ = function(selector, context) {
        return Object.create(proto).init(selector, context);
    };

    proto.is = function(selector) {
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


        return arr.any.call(this, test);
    };


    $.fn = proto;

    window.$ = $;

})(window, document);
