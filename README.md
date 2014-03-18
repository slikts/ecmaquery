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

## Standards used

### ES5

  * [Object.create](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create)
  * Object.getPrototypeOf
  * JSON.parse
  * Object.keys
  * Array.isArray
  * Array.forEach
  * Array.map
  * Array.reduce
  * Array.filter
  * Array.every
  * Array.some
  * Array.indexOf

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

## Structure

  * The constructor function is used as a namespace for all methods with a general utility
  * Prototype methods only host logic related to the objects and defer to utility methods
