export class AccmiSlider {
  constructor(options = {}, container) {
    this.userOptions = {
      arrows: options.arrows !== undefined ? options.arrows : true,
      duration: options.duration !== undefined ? options.duration : 0.8,
      animation: options.animation !== undefined ? options.animation : 'ease',
      visibileItem: options.visibileItem !== undefined ? options.visibileItem : 1,
      arrowLeftClass: options.arrowLeftClass !== undefined ? options.arrowLeftClass : 'prev',
      arrowRightClass: options.arrowRightClass !== undefined ? options.arrowRightClass : 'next',
      offsetRight: options.offsetRight !== undefined ? options.offsetRight : 0,
      dots: options.dots !== undefined ? options.dots : true,
      beforeChange: options.beforeChange !== undefined ? (e) => options.beforeChange(e) : () => null,
      infinity: options.infinity !== undefined ? options.infinity : false,
      typeChange: options.typeChange !== undefined ? options.typeChange : 'carousel',
      arrowLeftContent: options.arrowLeftContent !== undefined ? options.arrowLeftContent : '<span>prev</span>',
      arrowRightContent: options.arrowRightContent !== undefined ? options.arrowRightContent : '<span>next</span>',
    }

    this.settings = {
      main: container,
      wrapper: container.querySelector('.accmi-slider-wrapper'),
      position: 0,
      maxPosition: container.querySelector('.accmi-slider-wrapper').children.length - this.userOptions.visibileItem
    }

    this.settings.wrapper.style.transition = `transform ${this.userOptions.duration}s ${this.userOptions.animation}`;

    this.widthContainer = this.settings.main.getBoundingClientRect().width;
    this.touches = {
      start: 0,
      end: 0,
      endDetect: false,
      current: 0
    }

    if (this.userOptions.arrows) this.addArrows();
    if (this.userOptions.visibileItem > 1) {
      [].forEach.call(this.settings.wrapper.children, (element, index) => {
        element.style.flex = `0 0 ${(100/this.userOptions.visibileItem)-5}%`;

        if (index === this.settings.wrapper.children.length-1) return;

        element.style.marginRight = `${this.userOptions.offsetRight}%`;
      })
    }

    if (this.userOptions.dots) this.addDots();
    this.proc = this.userOptions.visibileItem > 1 ? this.procInit() : 100;
    this.listners();
    this.settings.wrapper.classList.add(this.userOptions.typeChange);
  }

  procInit() {
    const element = this.settings.wrapper.children[0];
    const elementWidth = element.offsetWidth + parseInt(getComputedStyle(element).marginRight);
    const wrapperWidth = this.settings.wrapper.offsetWidth;

    return 100 / (wrapperWidth / elementWidth);
  };

  addDots() {
    const dotsContainer = document.createElement('div');
    const countDots = this.settings.maxPosition + 1;

    for (let i=0; i < countDots; ++i) {
      const dot = document.createElement('div');

      dotsContainer.appendChild(dot);
      dot.setAttribute('class', 'accmi-slider-dots-container-dot');

      if (i === 0) dot.classList.add('active');

      dot.addEventListener('click', () => {
        this.goToSlide(i);
      });
    }

    dotsContainer.setAttribute('class', 'accmi-slider-dots-container');

    this.settings.main.appendChild(dotsContainer);

    this.settings.dots = dotsContainer;
  }

  addArrows() {
    const prev = document.createElement('div');
    const next = document.createElement('div');

    this.settings.main.appendChild(prev);
    this.settings.main.appendChild(next);

    prev.setAttribute('class', 'accmi-slider-arrow-left');
    next.setAttribute('class', 'accmi-slider-arrow-right');

    prev.innerHTML = this.userOptions.arrowLeftContent;
    next.innerHTML = this.userOptions.arrowRightContent;

    prev.classList.add(this.userOptions.arrowLeftClass);
    next.classList.add(this.userOptions.arrowRightClass);

    this.settings.prev = prev;
    this.settings.next = next;
  }

  listners() {
    if (this.userOptions.arrows) {
      this.settings.next.addEventListener('click', () => {
        this.nextSlide();
      });

      this.settings.prev.addEventListener('click', () => {
        this.prevSlide();
      });
    }

    this.settings.wrapper.addEventListener('mousedown', this.touchStart.bind(this));
    this.settings.wrapper.addEventListener('mousemove', this.touchMove.bind(this));
    this.settings.wrapper.addEventListener('mouseup', this.touchEnd.bind(this));

    [].forEach.call(this.settings.wrapper.children, (element, index) => {
      if (this.userOptions.typeChange !== 'carousel') {
        element.style.transition = `opacity ${this.userOptions.duration}s ${this.userOptions.animation}, 
            transform ${this.userOptions.duration}s ${this.userOptions.animation}`;
        if (index === this.settings.position) {
          element.classList.add(this.userOptions.typeChange === 'fade' ? 'fadeIn' : 'zoomIn');

          return;
        }

        element.classList.add(this.userOptions.typeChange === 'fade' ? 'fadeOut' : 'zoomOut');
      }

      element.addEventListener('touchstart', this.touchStart.bind(this));
      element.addEventListener('touchend', this.touchEnd.bind(this));
      element.addEventListener('touchmove', this.touchMove.bind(this));
    });
  }

  touchStart(e) {
    this.touches.start = e.touches !== undefined ? e.touches[0].clientX : e.clientX;
    this.touches.endDetect = true;
    this.settings.wrapper.style.transition = `transform 0s ${this.userOptions.animation}`;
  }

  touchEnd(e) {
    this.scrollEnabled();
    const x = e.changedTouches !== undefined ? e.changedTouches[0].clientX : e.clientX;
    const proc = 100 / (this.widthContainer / (this.touches.start - x));

    this.settings.wrapper.style.transition = `transform ${this.userOptions.duration}s ${this.userOptions.animation}`;
    this.touches.end = x;
    this.touches.endDetect = false;

    if (Math.abs(proc) > 20) {
      proc > 0 ? this.nextSlide() : this.prevSlide();
    } else {
      this.settings.wrapper.style.transform = `translate3d(${(-this.settings.position * this.proc)}%, 0, 0)`;
    }
  }

  touchMove(e) {
    if (this.touches.endDetect && this.userOptions.typeChange === 'carousel') {
      const x = e.touches !== undefined ? e.touches[0].clientX : e.clientX;
      const proc = 100 / (this.widthContainer / (this.touches.start - x));
  
      if (Math.abs(proc) > 15) this.scrollDisable();

      this.touches.current = x;

      this.settings.wrapper.style.transform = `translate3d(${(-this.settings.position * this.proc) + (-proc)}%, 0, 0)`;
    }
  }

  nextSlide() {
    this.typeOut(this.settings.position);

    const newPostition = () => {
      if (this.userOptions.infinity) {
        this.settings.position = this.settings.position >= this.settings.maxPosition ? 0 : ++this.settings.position;

        return;
      }

      this.settings.position = this.settings.position >= this.settings.maxPosition ? this.settings.position : ++this.settings.position;
    }

    newPostition();

    const transform = () => {
      this.settings.wrapper.style.transform = `translate3d(${-this.settings.position * this.proc}%, 0, 0)`;
      this.typeIn(this.settings.position);
    }

    this.userOptions.typeChange !== 'carousel' ? setTimeout(transform, (this.userOptions.duration * 1000)) : transform();

    this.changesDot();
    this.userOptions.beforeChange(this.settings.position);
  }

  prevSlide() {
    this.typeOut(this.settings.position);

    const newPostition = () => {
      if (this.userOptions.infinity) {
        this.settings.position = this.settings.position <= 0 ? this.settings.maxPosition : --this.settings.position;

        return;
      }

      this.settings.position = this.settings.position <= 0 ? this.settings.position : --this.settings.position;
    }

    newPostition();

    const transform = () => {
      this.settings.wrapper.style.transform = `translate3d(${-this.settings.position * this.proc}%, 0, 0)`;
      this.typeIn(this.settings.position);
    }

    this.userOptions.typeChange !== 'carousel' ? setTimeout(transform, this.userOptions.duration * 1000) : transform();

    this.changesDot();
    this.userOptions.beforeChange(this.settings.position);
  }

  goToSlide(index) {
    this.settings.position = index;
    this.settings.wrapper.style.transform = `translate3d(${-this.settings.position * this.proc}%, 0, 0)`;

    this.changesDot();
    this.userOptions.beforeChange(index);
  }

  changesDot() {
    if (!this.userOptions.dots) return;

    [].forEach.call(this.settings.dots.children, (element, index) => {
      this.settings.dots.children[index].classList.remove('active');

      if (index === this.settings.position) this.settings.dots.children[index].classList.add('active');
    });
  }

  typeIn(index) {
    if (this.userOptions.typeChange === 'carousel') return;

    this.settings.wrapper.children[index].classList.remove(this.userOptions.typeChange === 'fade' ? 'fadeOut' : 'zoomOut');
    this.settings.wrapper.children[index].classList.add(this.userOptions.typeChange === 'fade' ? 'fadeIn' : 'zoomIn');
  }

  typeOut(index) {
    if (this.userOptions.typeChange === 'carousel') return;

    this.settings.wrapper.children[index].classList.remove(this.userOptions.typeChange === 'fade' ? 'fadeIn' : 'zoomIn');
    this.settings.wrapper.children[index].classList.add(this.userOptions.typeChange === 'fade' ? 'fadeOut' : 'zoomOut');
  }

  scrollDisable() {
    const body = document.querySelector('body');
    const html = document.querySelector('html');

    body.style.position = 'relative';
    body.style.overflowY = 'hidden';
    html.style.overflowY = 'hidden';
  }

  scrollEnabled() {
    const body = document.querySelector('body');
    const html = document.querySelector('html');

    body.style.overflowY = 'auto';
    html.style.overflowY = 'auto';
  }
}

export default AccmiSlider;

window.AccmiSlider = AccmiSlider;
