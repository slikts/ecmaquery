# ecmaQuery

ecmaQuery is an attempt at a 'clean' implementation of jQuery's API for
modern environments.

### Principles

  * Strictly rely on standard APIs
  * Avoid any code targeting cross-browser quirks

Cross-browser or legacy support can be provided (to an extent) by polyfills like es5-shim.

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