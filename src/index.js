import './index.scss';
import './lib/accmi-slider.scss';

import AccmiSlider from '../dist/accmi-slider';

const Slider = new AccmiSlider({
  visibileItem: 3,
  offsetRight: 7.5,
  duration: 0.8,
  dots: true,
  infinity: true,
  arrowLeftContent: '<div>prev</div>',
  arrowRightContent: '<div>next</div>',
  beforeChange: (e) => {
    // console.log(e);
  }
});
