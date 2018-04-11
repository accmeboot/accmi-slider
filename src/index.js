import './index.scss';
import './lib/accmi-slider.scss';

import AccmiSlider from './lib/accmi-slider';

const Slider = new AccmiSlider({
  visibileItem: 1,
  offsetRight: 0,
  durration: 0.8,
  dots: true,
  infinity: true,
  beforeChange: (e) => {
    // console.log(e);
  }
});
