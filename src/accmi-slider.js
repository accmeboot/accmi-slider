'use strict';
function AccmiSlider(options = {}) {
  this.init = () => {
    this.userOptions = {
      arrows: options.arrows !== undefined ? options.arrows : true,
      durration: options.durration !== undefined ? options.durration : 0.8,
      animation: options.animation !== undefined ? options.animation : 'ease',
      visibileItem: options.visibileItem !== undefined ? options.visibileItem : 1
    }
    this.settings = {
      main: document.querySelector('.accmi-slider'),
      wrapper: document.querySelector('.accmi-slider-wrapper'),
      position: 0,
      maxPosition: document.querySelector('.accmi-slider-wrapper').children.length - 1
    }

    this.proc = this.userOptions.visibileItem > 1 ? (this.userOptions.visibileItem-0.2) : 1;

    this.settings.wrapper.style.transition = `transform ${this.userOptions.durration}s ${this.userOptions.animation}`;

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
        
        if (index === this.settings.maxPosition) return;

        element.style.marginRight = '10%';
      }) 
    }

    this.listners();
  }

  this.addArrows = () => {
    const prev = document.createElement('div');
    const next = document.createElement('div');

    this.settings.main.appendChild(prev);
    this.settings.main.appendChild(next);

    prev.setAttribute('class', 'accmi-slider-arrow-left');
    next.setAttribute('class', 'accmi-slider-arrow-right');

    this.settings.prev = prev;
    this.settings.next = next;
  }

  this.listners = () => {

    if (this.userOptions.arrows) {
      this.settings.next.addEventListener('click', () => {
        this.nextSlide();
      });
  
      this.settings.prev.addEventListener('click', () => {
        this.prevSlide();
      });
    }

    this.settings.wrapper.addEventListener('mousedown', this.touchStart);
    this.settings.wrapper.addEventListener('mousemove', this.touchMove);
    this.settings.wrapper.addEventListener('mouseup', this.touchEnd);

    [].forEach.call(this.settings.wrapper.children, element => {
      element.addEventListener('touchstart', this.touchStart);
      element.addEventListener('touchend', this.touchEnd);
      element.addEventListener('touchmove', this.touchMove);
    });
  }

  this.touchStart = (e) => {
    this.touches.start = e.touches !== undefined ? e.touches[0].clientX : e.clientX;
    this.touches.endDetect = true;
    this.settings.wrapper.style.transition = `transform 0s ${this.userOptions.animation}`;
  }

  this.touchEnd = (e) => {
    const x = e.changedTouches !== undefined ? e.changedTouches[0].clientX : e.clientX;
    const proc = 100 / (this.widthContainer / (this.touches.start - x)); 

    this.settings.wrapper.style.transition = `transform ${this.userOptions.durration}s ${this.userOptions.animation}`;
    this.touches.end = x;
    this.touches.endDetect = false;

    if (Math.abs(proc) > 20) {
      proc > 0 ? this.nextSlide() : this.prevSlide();
    } else {
      this.settings.wrapper.style.transform = `translate3d(${(-this.settings.position * 100) / this.proc}%, 0, 0)`;
    }
  }

  this.touchMove = (e) => {
    if (this.touches.endDetect) {
      const x = e.touches !== undefined ? e.touches[0].clientX : e.clientX;
      const proc = 100 / (this.widthContainer / (this.touches.start - x));
    
      this.touches.current = x;

      this.settings.wrapper.style.transform = `translate3d(${(-this.settings.position * 100  / this.proc) + (-proc)}%, 0, 0)`;
    }
  }

  this.nextSlide = () => {
    this.settings.position = this.settings.position >= this.settings.maxPosition ? 0 : ++this.settings.position;
    this.settings.wrapper.style.transform = `translate3d(${-this.settings.position * 100  / this.proc}%, 0, 0)`;
  }

  this.prevSlide = () => {
    this.settings.position = this.settings.position <= 0 ? this.settings.position : --this.settings.position;
    this.settings.wrapper.style.transform = `translate3d(${-this.settings.position * 100  / this.proc}%, 0, 0)`;
  }

  this.init();
}

export default AccmiSlider;
