import './../scss/base.scss';
import createScrollItem from './../../../widok-scroll-item';

window.scrollItem = createScrollItem('#item', {
  onScroll: scrollItem => changeColor(scrollItem),
});

function changeColor(scrollItem) {
  if (scrollItem.isCrossingScreenTop) {
    scrollItem.el.css({ backgroundColor: '#993932' });
  }
  if (scrollItem.isCrossingScreenBottom) {
    scrollItem.el.css({ backgroundColor: '#3b7478' });
  }
}
