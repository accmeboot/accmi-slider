import './index.scss';
import './lib/accmi-slider.scss';

import AccmiSlider from './lib/accmi-slider';

const Slider = new AccmiSlider({
  visibileItem: 1,
  offsetRight: 0,
  duration: 1,
  dots: true,
  infinity: true,
  arrowLeftContent: '<div>prev</div>',
  arrowRightContent: '<div>next</div>',
  beforeChange: (e) => {
    // console.log(e);
  },
}, document.querySelector('.accmi-slider'));
