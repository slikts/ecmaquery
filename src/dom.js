'use strict';

// dom utils
Object.assign(ecmaQuery, (function($) {
  var tempBlock = document.createElement('div');
  var tagRegex = /^<(\w+)>$/;

  return {
    removeNode: function(node) {
      var parent = node.parentNode;

      if (!parent) {
        return;
      }

      parent.removeChild(node);
    },
    parseHTML: function(html) {
      var elems;
      var match = tagRegex.exec(html);

      if (match) {
        elems = [document.createElement(match[1])];
      } else {
        tempBlock.innerHTML = html;
        elems = $.clone(tempBlock.children);
        elems.forEach(tempBlock.removeChild, tempBlock);
      }

      return elems;
    }
  };
})(ecmaQuery));
