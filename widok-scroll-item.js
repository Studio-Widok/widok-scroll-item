/**
 * create new scroll item
 * @param {selector} element element to scroll
 * @param {object} options extra options
 * @param {function} options.onScroll function(scrollItem)
 * @param {function} options.onStateChange function(prop, value, scrollItem)
 * @returns {object} scrollItem
 */

const $ = require('cash-dom');
const throttle = require('widok-throttle');
const widok = require('widok');

const createScrollItem = (function () {
  class ScrollItem {
    constructor(element, options) {
      this.el = $(element);
      this.offset = 0;
      this.height = 0;
      this.addClasses = options.addClasses;
      this.isAboveScreen = false;
      this.isCrossingScreenTop = false;
      this.isCrossingScreenBottom = false;
      this.isBelowScreen = false;
      this.isOnScreen = false;
      this.options = options;
      this.onStateChange = this.options.onStateChange;
      this.onScroll = this.options.onScroll;
    }
    _onResize() {
      this.offset = this.el.offset().top;
      this.height = this.el.outerHeight();
      this._onScroll();
    }
    _onScroll() {
      this.checkScreenRelation();
      if (this.onScroll !== void 0) {
        this.onScroll.call(this, this);
      }
    }
    checkScreenRelation() {
      if (this.offset + this.height < widok.s) {
        this.setPropClass('AboveScreen', true);
        this.setPropClass('CrossingScreenTop', false);
        this.setPropClass('CrossingScreenBottom', false);
        this.setPropClass('BelowScreen', false);
        this.setPropClass('OnScreen', false);
        return;
      }
      if (this.offset > widok.s + widok.h) {
        this.setPropClass('AboveScreen', false);
        this.setPropClass('CrossingScreenTop', false);
        this.setPropClass('CrossingScreenBottom', false);
        this.setPropClass('BelowScreen', true);
        this.setPropClass('OnScreen', false);
        return;
      }
      this.setPropClass('AboveScreen', false);
      this.setPropClass('BelowScreen', false);
      this.setPropClass('OnScreen', true);
      this.setPropClass(
        'CrossingScreenTop',
        this.offset < widok.s && this.offset + this.height > widok.s
      );
      this.setPropClass(
        'CrossingScreenBottom',
        this.offset < widok.s + widok.h &&
          this.offset + this.height > widok.s + widok.h
      );
    }
    setPropClass(prop, value) {
      if (this['is' + prop] !== value) {
        this['is' + prop] = value;
        if (this.addClasses) {
          if (value) this.el.addClass(prop);
          else this.el.removeClass(prop);
        }
        if (this.onStateChange !== void 0) {
          this.onStateChange.call(this, prop, value, this);
        }
      }
    }
    screenPos(heightOffset) {
      if (heightOffset === void 0) heightOffset = 0;
      return (this.offset + this.height * heightOffset - widok.s) / widok.h;
    }
  }

  const scrollItemCollection = [];

  window.addEventListener('afterLayoutChange', function () {
    scrollItemCollection.map(function (e) {
      e._onResize();
    });
  });

  window.addEventListener(
    'scroll',
    throttle(100, function () {
      scrollItemCollection.map(function (e) {
        e._onScroll();
      });
    })
  );

  return function (element, options) {
    if (options === undefined) options = {};
    const scrollItem = new ScrollItem(element, options);
    scrollItemCollection.push(scrollItem);
    return scrollItem;
  };
})();

if (typeof module !== 'undefined') module.exports = createScrollItem;
