(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ? define(factory) : (global.Rx = factory());
}(this, (function () {
  'use strict';

  var index = {
    say: 'hello'
  }

  return index;

})));
