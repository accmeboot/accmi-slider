'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AccmiSlider = exports.AccmiSlider = function () {
  function AccmiSlider() {
    var _this = this;

    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var container = arguments[1];

    _classCallCheck(this, AccmiSlider);

    this.userOptions = {
      arrows: options.arrows !== undefined ? options.arrows : true,
      duration: options.duration !== undefined ? options.duration : 0.8,
      animation: options.animation !== undefined ? options.animation : 'ease',
      visibileItem: options.visibileItem !== undefined ? options.visibileItem : 1,
      arrowLeftClass: options.arrowLeftClass !== undefined ? options.arrowLeftClass : 'prev',
      arrowRightClass: options.arrowRightClass !== undefined ? options.arrowRightClass : 'next',
      offsetRight: options.offsetRight !== undefined ? options.offsetRight : 0,
      dots: options.dots !== undefined ? options.dots : true,
      beforeChange: options.beforeChange !== undefined ? function (e) {
        return options.beforeChange(e);
      } : function () {
        return null;
      },
      infinity: options.infinity !== undefined ? options.infinity : false,
      typeChange: options.typeChange !== undefined ? options.typeChange : 'carousel',
      arrowLeftContent: options.arrowLeftContent !== undefined ? options.arrowLeftContent : '<span>prev</span>',
      arrowRightContent: options.arrowRightContent !== undefined ? options.arrowRightContent : '<span>next</span>'
    };

    this.settings = {
      main: container,
      wrapper: container.querySelector('.accmi-slider-wrapper'),
      position: 0,
      maxPosition: container.querySelector('.accmi-slider-wrapper').children.length - this.userOptions.visibileItem
    };

    this.settings.wrapper.style.transition = 'transform ' + this.userOptions.duration + 's ' + this.userOptions.animation;

    this.widthContainer = this.settings.main.getBoundingClientRect().width;
    this.touches = {
      start: 0,
      end: 0,
      endDetect: false,
      current: 0
    };

    if (this.userOptions.arrows) this.addArrows();
    if (this.userOptions.visibileItem > 1) {
      [].forEach.call(this.settings.wrapper.children, function (element, index) {
        element.style.flex = '0 0 ' + (100 / _this.userOptions.visibileItem - 5) + '%';

        if (index === _this.settings.wrapper.children.length - 1) return;

        element.style.marginRight = _this.userOptions.offsetRight + '%';
      });
    }

    if (this.userOptions.dots) this.addDots();
    this.proc = this.userOptions.visibileItem > 1 ? this.procInit() : 100;
    this.listners();
    this.settings.wrapper.classList.add(this.userOptions.typeChange);
  }

  _createClass(AccmiSlider, [{
    key: 'procInit',
    value: function procInit() {
      var element = this.settings.wrapper.children[0];
      var elementWidth = element.offsetWidth + parseInt(getComputedStyle(element).marginRight);
      var wrapperWidth = this.settings.wrapper.offsetWidth;

      return 100 / (wrapperWidth / elementWidth);
    }
  }, {
    key: 'addDots',
    value: function addDots() {
      var _this2 = this;

      var dotsContainer = document.createElement('div');
      var countDots = this.settings.maxPosition + 1;

      var _loop = function _loop(i) {
        var dot = document.createElement('div');

        dotsContainer.appendChild(dot);
        dot.setAttribute('class', 'accmi-slider-dots-container-dot');

        if (i === 0) dot.classList.add('active');

        dot.addEventListener('click', function () {
          _this2.goToSlide(i);
        });
      };

      for (var i = 0; i < countDots; ++i) {
        _loop(i);
      }

      dotsContainer.setAttribute('class', 'accmi-slider-dots-container');

      this.settings.main.appendChild(dotsContainer);

      this.settings.dots = dotsContainer;
    }
  }, {
    key: 'addArrows',
    value: function addArrows() {
      var prev = document.createElement('div');
      var next = document.createElement('div');

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
  }, {
    key: 'listners',
    value: function listners() {
      var _this3 = this;

      if (this.userOptions.arrows) {
        this.settings.next.addEventListener('click', function () {
          _this3.nextSlide();
        });

        this.settings.prev.addEventListener('click', function () {
          _this3.prevSlide();
        });
      }

      this.settings.wrapper.addEventListener('mousedown', this.touchStart.bind(this));
      this.settings.wrapper.addEventListener('mousemove', this.touchMove.bind(this));
      this.settings.wrapper.addEventListener('mouseup', this.touchEnd.bind(this));

      [].forEach.call(this.settings.wrapper.children, function (element, index) {
        if (_this3.userOptions.typeChange !== 'carousel') {
          element.style.transition = 'opacity ' + _this3.userOptions.duration + 's ' + _this3.userOptions.animation + ', \n            transform ' + _this3.userOptions.duration + 's ' + _this3.userOptions.animation;
          if (index === _this3.settings.position) {
            element.classList.add(_this3.userOptions.typeChange === 'fade' ? 'fadeIn' : 'zoomIn');

            return;
          }

          element.classList.add(_this3.userOptions.typeChange === 'fade' ? 'fadeOut' : 'zoomOut');
        }

        element.addEventListener('touchstart', _this3.touchStart.bind(_this3));
        element.addEventListener('touchend', _this3.touchEnd.bind(_this3));
        element.addEventListener('touchmove', _this3.touchMove.bind(_this3));
      });
    }
  }, {
    key: 'touchStart',
    value: function touchStart(e) {
      this.scrollDisable();
      this.touches.start = e.touches !== undefined ? e.touches[0].clientX : e.clientX;
      this.touches.endDetect = true;
      this.settings.wrapper.style.transition = 'transform 0s ' + this.userOptions.animation;
    }
  }, {
    key: 'touchEnd',
    value: function touchEnd(e) {
      this.scrollEnabled();
      var x = e.changedTouches !== undefined ? e.changedTouches[0].clientX : e.clientX;
      var proc = 100 / (this.widthContainer / (this.touches.start - x));

      this.settings.wrapper.style.transition = 'transform ' + this.userOptions.duration + 's ' + this.userOptions.animation;
      this.touches.end = x;
      this.touches.endDetect = false;

      if (Math.abs(proc) > 20) {
        proc > 0 ? this.nextSlide() : this.prevSlide();
      } else {
        this.settings.wrapper.style.transform = 'translate3d(' + -this.settings.position * this.proc + '%, 0, 0)';
      }
    }
  }, {
    key: 'touchMove',
    value: function touchMove(e) {
      if (this.touches.endDetect && this.userOptions.typeChange === 'carousel') {
        var x = e.touches !== undefined ? e.touches[0].clientX : e.clientX;
        var proc = 100 / (this.widthContainer / (this.touches.start - x));

        this.touches.current = x;

        this.settings.wrapper.style.transform = 'translate3d(' + (-this.settings.position * this.proc + -proc) + '%, 0, 0)';
      }
    }
  }, {
    key: 'nextSlide',
    value: function nextSlide() {
      var _this4 = this;

      this.typeOut(this.settings.position);

      var newPostition = function newPostition() {
        if (_this4.userOptions.infinity) {
          _this4.settings.position = _this4.settings.position >= _this4.settings.maxPosition ? 0 : ++_this4.settings.position;

          return;
        }

        _this4.settings.position = _this4.settings.position >= _this4.settings.maxPosition ? _this4.settings.position : ++_this4.settings.position;
      };

      newPostition();

      var transform = function transform() {
        _this4.settings.wrapper.style.transform = 'translate3d(' + -_this4.settings.position * _this4.proc + '%, 0, 0)';
        _this4.typeIn(_this4.settings.position);
      };

      this.userOptions.typeChange !== 'carousel' ? setTimeout(transform, this.userOptions.duration * 1000) : transform();

      this.changesDot();
      this.userOptions.beforeChange(this.settings.position);
    }
  }, {
    key: 'prevSlide',
    value: function prevSlide() {
      var _this5 = this;

      this.typeOut(this.settings.position);

      var newPostition = function newPostition() {
        if (_this5.userOptions.infinity) {
          _this5.settings.position = _this5.settings.position <= 0 ? _this5.settings.maxPosition : --_this5.settings.position;

          return;
        }

        _this5.settings.position = _this5.settings.position <= 0 ? _this5.settings.position : --_this5.settings.position;
      };

      newPostition();

      var transform = function transform() {
        _this5.settings.wrapper.style.transform = 'translate3d(' + -_this5.settings.position * _this5.proc + '%, 0, 0)';
        _this5.typeIn(_this5.settings.position);
      };

      this.userOptions.typeChange !== 'carousel' ? setTimeout(transform, this.userOptions.duration * 1000) : transform();

      this.changesDot();
      this.userOptions.beforeChange(this.settings.position);
    }
  }, {
    key: 'goToSlide',
    value: function goToSlide(index) {
      this.settings.position = index;
      this.settings.wrapper.style.transform = 'translate3d(' + -this.settings.position * this.proc + '%, 0, 0)';

      this.changesDot();
      this.userOptions.beforeChange(index);
    }
  }, {
    key: 'changesDot',
    value: function changesDot() {
      var _this6 = this;

      if (!this.userOptions.dots) return;

      [].forEach.call(this.settings.dots.children, function (element, index) {
        _this6.settings.dots.children[index].classList.remove('active');

        if (index === _this6.settings.position) _this6.settings.dots.children[index].classList.add('active');
      });
    }
  }, {
    key: 'typeIn',
    value: function typeIn(index) {
      if (this.userOptions.typeChange === 'carousel') return;

      this.settings.wrapper.children[index].classList.remove(this.userOptions.typeChange === 'fade' ? 'fadeOut' : 'zoomOut');
      this.settings.wrapper.children[index].classList.add(this.userOptions.typeChange === 'fade' ? 'fadeIn' : 'zoomIn');
    }
  }, {
    key: 'typeOut',
    value: function typeOut(index) {
      if (this.userOptions.typeChange === 'carousel') return;

      this.settings.wrapper.children[index].classList.remove(this.userOptions.typeChange === 'fade' ? 'fadeIn' : 'zoomIn');
      this.settings.wrapper.children[index].classList.add(this.userOptions.typeChange === 'fade' ? 'fadeOut' : 'zoomOut');
    }
  }, {
    key: 'scrollDisable',
    value: function scrollDisable() {
      var body = document.querySelector('body');
      var html = document.querySelector('html');

      body.style.position = 'relative';
      body.style.overflowY = 'hidden';
      html.style.overflowY = 'hidden';
    }
  }, {
    key: 'scrollEnabled',
    value: function scrollEnabled() {
      var body = document.querySelector('body');
      var html = document.querySelector('html');

      body.style.overflowY = 'auto';
      html.style.overflowY = 'auto';
    }
  }]);

  return AccmiSlider;
}();

exports.default = AccmiSlider;


window.AccmiSlider = AccmiSlider;