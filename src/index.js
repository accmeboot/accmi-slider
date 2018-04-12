import './index.scss';
import './lib/accmi-slider.scss';

import AccmiSlider from '../dist/accmi-slider';

const Slider = new AccmiSlider({
  visibileItem: 3,
  offsetRight: 7.5,
  duration: 0.8,
  dots: true,
  infinity: true,
  beforeChange: (e) => {
    // console.log(e);
  }
});
