# ecmaQuery

ecmaQuery is an attempt at a minimalistic implementation of jQuery's API for
modern environments.

### Principles

  * Always defer to standard methods
  * Avoid any code targeting cross-browser quirks

Missing native support can be addressed with polyfills like
[es5-shim](https://github.com/es-shims/es5-shim). The benefit of this
approach is less code and increased readibility of the main library,
and improved performance in modern environments.

### Rationale

The basic purpose of ecmaQuery is to avoid having to use code like this:

```
[].forEach.call(document.getElementById('foo').getElementsByClassName('bar'), function(el) {
  el.addEventListener('click', function(e) {
    this.querySelector('.baz').appendChild(document.createElement('span'));
    e.preventDefault();
  });
});
```

…and to be able to use something like this instead:

```
$('#foo .bar').each(function() {
  $(this).click(function() {
    $('.baz', this).append($('<span>'));
    return false;
  });
});
```

In other words, it's to make it easier to read and write code dealing with
things like browser DOM.

#### Why jQuery?

jQuery is veinconsistencies, which makes it less suited for use in certain contexts.
ry widely used, so many developers can benefit from familiarity
with its API, but the library itself is largely focused on fixing cross-browser
inconsistencies, which makes it less suited for use in certain contexts.

ecmaQuery can also provide browser behavior normalization to the extent
that it can be done with polyfills, but it's also smaller and faster,
and more appropriate for things like browser add-on development, where a
certain level of support for modern standards can be relied upon.

## Standards used

### ES5

  * [`Object.create`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create)
  * `Object.getPrototypeOf`
  * `JSON.parse`
  * `Object.keys`
  * `Array.isArray`
  * `Array.forEach`
  * `Array.map`
  * `Array.reduce`
  * `Array.filter`
  * `Array.every`
  * `Array.some`
  * `Array.indexOf`

### ES6

  * [Object.assign](http://people.mozilla.org/~jorendorff/es6-draft.html#sec-19.1.2.1)
  * [Map](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-map-constructor)

### Selectors API

  * [Element.querySelector](https://developer.mozilla.org/en-US/docs/Web/API/Element.querySelector)
  * [Element.matches](https://developer.mozilla.org/en-US/docs/Web/API/Element.matches)

### HTML5

  * [HTMLElement.dataset](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement.dataset)
  * [Element.classList](https://developer.mozilla.org/en-US/docs/Web/API/Element.classList)

### CSS Object Model

  * [Window.getComputedStyle](http://dev.w3.org/csswg/cssom/#dom-window-getcomputedstyle)

## Notes

  * The constructor function (`$` or `ecmaQuery`) is used as a namespace for all 
    methods with a general utility
  * Prototype methods only host logic directly related to the constructed objects
    and defer everything else to the constructor's utility methods
  * No `for` or `while` loops are used (for readability)
  * Method argument names consistently reflect the type of input they accept
    (`x` means variable input, `arr` are array-like objects etc.)
  * The library includes a small host of utility functions for working with
    objects and array-like objects, for instance, so that the same `map` method
    could be used for both types of objects
    * It should be possible in the future to swap this out with underscore/lodash 
      (or something else) to avoid duplicating any functionality

