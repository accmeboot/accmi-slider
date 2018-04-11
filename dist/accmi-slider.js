'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function AccmiSlider() {
  var _this = this;

  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  this.init = function () {
    _this.userOptions = {
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
      typeChange: options.typeChange !== undefined ? options.typeChange : 'carousel'
    };

    _this.settings = {
      main: document.querySelector('.accmi-slider'),
      wrapper: document.querySelector('.accmi-slider-wrapper'),
      position: 0,
      maxPosition: document.querySelector('.accmi-slider-wrapper').children.length - _this.userOptions.visibileItem
    };

    _this.settings.wrapper.style.transition = 'transform ' + _this.userOptions.duration + 's ' + _this.userOptions.animation;

    _this.widthContainer = _this.settings.main.getBoundingClientRect().width;
    _this.touches = {
      start: 0,
      end: 0,
      endDetect: false,
      current: 0
    };

    if (_this.userOptions.arrows) _this.addArrows();
    if (_this.userOptions.visibileItem > 1) {
      [].forEach.call(_this.settings.wrapper.children, function (element, index) {
        element.style.flex = '0 0 ' + (100 / _this.userOptions.visibileItem - 5) + '%';

        if (index === _this.settings.wrapper.children.length - 1) return;

        element.style.paddingRight = _this.userOptions.offsetRight + '%';
      });
    }

    if (_this.userOptions.dots) _this.addDots();
    _this.proc = _this.userOptions.visibileItem > 1 ? _this.procInit() : 100;
    _this.listners();
    _this.settings.wrapper.classList.add(_this.userOptions.typeChange);
  };

  this.procInit = function () {
    var element = _this.settings.wrapper.children[0];
    var elementWidth = element.offsetWidth;
    var wrapperWidth = _this.settings.wrapper.offsetWidth;

    return 100 / (wrapperWidth / elementWidth);
  };

  this.addDots = function () {
    var dotsContainer = document.createElement('div');
    var countDots = _this.settings.maxPosition + 1;

    var _loop = function _loop(i) {
      var dot = document.createElement('div');

      dotsContainer.appendChild(dot);
      dot.setAttribute('class', 'accmi-slider-dots-container-dot');

      if (i === 0) dot.classList.add('active');

      dot.addEventListener('click', function () {
        _this.goToSlide(i);
      });
    };

    for (var i = 0; i < countDots; ++i) {
      _loop(i);
    }

    dotsContainer.setAttribute('class', 'accmi-slider-dots-container');

    _this.settings.main.appendChild(dotsContainer);

    _this.settings.dots = dotsContainer;
  };

  this.addArrows = function () {
    var prev = document.createElement('div');
    var next = document.createElement('div');

    _this.settings.main.appendChild(prev);
    _this.settings.main.appendChild(next);

    prev.setAttribute('class', 'accmi-slider-arrow-left');
    next.setAttribute('class', 'accmi-slider-arrow-right');

    prev.classList.add(_this.userOptions.arrowLeftClass);
    next.classList.add(_this.userOptions.arrowRightClass);

    _this.settings.prev = prev;
    _this.settings.next = next;
  };

  this.listners = function () {

    if (_this.userOptions.arrows) {
      _this.settings.next.addEventListener('click', function () {
        _this.nextSlide();
      });

      _this.settings.prev.addEventListener('click', function () {
        _this.prevSlide();
      });
    }

    _this.settings.wrapper.addEventListener('mousedown', _this.touchStart);
    _this.settings.wrapper.addEventListener('mousemove', _this.touchMove);
    _this.settings.wrapper.addEventListener('mouseup', _this.touchEnd);

    [].forEach.call(_this.settings.wrapper.children, function (element, index) {
      if (_this.userOptions.typeChange !== 'carousel') {
        element.style.transition = 'opacity ' + _this.userOptions.duration + 's ' + _this.userOptions.animation + ', \n          transform ' + _this.userOptions.duration + 's ' + _this.userOptions.animation;
        if (index === _this.settings.position) {
          element.classList.add(_this.userOptions.typeChange === 'fade' ? 'fadeIn' : 'zoomIn');

          return;
        }

        element.classList.add(_this.userOptions.typeChange === 'fade' ? 'fadeOut' : 'zoomOut');
      }

      element.addEventListener('touchstart', _this.touchStart);
      element.addEventListener('touchend', _this.touchEnd);
      element.addEventListener('touchmove', _this.touchMove);
    });
  };

  this.touchStart = function (e) {
    _this.touches.start = e.touches !== undefined ? e.touches[0].clientX : e.clientX;
    _this.touches.endDetect = true;
    _this.settings.wrapper.style.transition = 'transform 0s ' + _this.userOptions.animation;
  };

  this.touchEnd = function (e) {
    var x = e.changedTouches !== undefined ? e.changedTouches[0].clientX : e.clientX;
    var proc = 100 / (_this.widthContainer / (_this.touches.start - x));

    _this.settings.wrapper.style.transition = 'transform ' + _this.userOptions.duration + 's ' + _this.userOptions.animation;
    _this.touches.end = x;
    _this.touches.endDetect = false;

    if (Math.abs(proc) > 20) {
      proc > 0 ? _this.nextSlide() : _this.prevSlide();
    } else {
      _this.settings.wrapper.style.transform = 'translate3d(' + -_this.settings.position * _this.proc + '%, 0, 0)';
    }
  };

  this.touchMove = function (e) {
    if (_this.touches.endDetect) {
      var x = e.touches !== undefined ? e.touches[0].clientX : e.clientX;
      var proc = 100 / (_this.widthContainer / (_this.touches.start - x));

      _this.touches.current = x;

      _this.settings.wrapper.style.transform = 'translate3d(' + (-_this.settings.position * _this.proc + -proc) + '%, 0, 0)';
    }
  };

  this.nextSlide = function () {
    _this.typeOut(_this.settings.position);

    var newPostition = function newPostition() {
      if (_this.userOptions.infinity) {
        _this.settings.position = _this.settings.position >= _this.settings.maxPosition ? 0 : ++_this.settings.position;

        return;
      }

      _this.settings.position = _this.settings.position >= _this.settings.maxPosition ? _this.settings.position : ++_this.settings.position;
    };

    newPostition();

    var transform = function transform() {
      _this.settings.wrapper.style.transform = 'translate3d(' + -_this.settings.position * _this.proc + '%, 0, 0)';
      _this.typeIn(_this.settings.position);
    };

    _this.userOptions.typeChange !== 'carousel' ? setTimeout(transform, _this.userOptions.duration * 1000) : transform();

    _this.changesDot();
    _this.userOptions.beforeChange(_this.settings.position);
  };

  this.prevSlide = function () {
    _this.typeOut(_this.settings.position);

    var newPostition = function newPostition() {
      if (_this.userOptions.infinity) {
        _this.settings.position = _this.settings.position <= 0 ? _this.settings.maxPosition : --_this.settings.position;

        return;
      }

      _this.settings.position = _this.settings.position <= 0 ? _this.settings.position : --_this.settings.position;
    };

    newPostition();

    var transform = function transform() {
      _this.settings.wrapper.style.transform = 'translate3d(' + -_this.settings.position * _this.proc + '%, 0, 0)';
      _this.typeIn(_this.settings.position);
    };

    _this.userOptions.typeChange !== 'carousel' ? setTimeout(transform, _this.userOptions.duration * 1000) : transform();

    _this.changesDot();
    _this.userOptions.beforeChange(_this.settings.position);
  };

  this.goToSlide = function (index) {
    _this.settings.position = index;
    _this.settings.wrapper.style.transform = 'translate3d(' + -_this.settings.position * _this.proc + '%, 0, 0)';

    _this.changesDot();
    _this.userOptions.beforeChange(index);
  };

  this.changesDot = function () {
    if (!_this.userOptions.dots) return;

    [].forEach.call(_this.settings.dots.children, function (element, index) {
      _this.settings.dots.children[index].classList.remove('active');

      if (index === _this.settings.position) _this.settings.dots.children[index].classList.add('active');
    });
  };

  this.typeIn = function (index) {
    if (_this.userOptions.typeChange === 'carousel') return;

    _this.settings.wrapper.children[index].classList.remove(_this.userOptions.typeChange === 'fade' ? 'fadeOut' : 'zoomOut');
    _this.settings.wrapper.children[index].classList.add(_this.userOptions.typeChange === 'fade' ? 'fadeIn' : 'zoomIn');
  };

  this.typeOut = function (index) {
    if (_this.userOptions.typeChange === 'carousel') return;

    _this.settings.wrapper.children[index].classList.remove(_this.userOptions.typeChange === 'fade' ? 'fadeIn' : 'zoomIn');
    _this.settings.wrapper.children[index].classList.add(_this.userOptions.typeChange === 'fade' ? 'fadeOut' : 'zoomOut');
  };

  this.init();
}

window.AccmiSlider = AccmiSlider;

exports.default = AccmiSlider;