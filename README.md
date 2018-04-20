# Accmi-slider

## Carousel with vanilla.js

##### Carousel with vanilla.js, mobile touch and desktop click.

## Package Managers

```npm
npm i accmi-slider
```

## Example
```html
    <link rel="stylesheet" href="../accmi-slider.css">
    <div class='accmi-slider'>
      <div class='accmi-slider-wrapper'>

        <div class='accmi-slider-wrapper-item'>
          <img src='./images/1.jpg' alt="">
        </div>

        <div class='accmi-slider-wrapper-item'>
          <img src='./images/2.jpg' alt="">
        </div>

        <div class='accmi-slider-wrapper-item'>
          <img src='./images/3.jpg' alt="">
        </div>

        <div class='accmi-slider-wrapper-item'>
          <img src='./images/1.jpg' alt="">
        </div>
      </div>
    </div>
    
    <script src="../accmi-slider.js"></script>
    <script >
        new AccmiSlider({
          arrows: true,
          duration: 0.8,
          animation: 'ease',
          visibileItem: 1,
          arrowLeftClass: 'prev',
          arrowRightClass: 'next',
          offsetRight: 0,
          dots: true,
          beforeChange: (e) => {
            console.log(e);
          },
          infinity: true,
          typeChange: 'carousel'
        }, document.querySelector('accmi-slider'));
    </script>
```

![GitHub Logo](./src/images/gameplay.gif)


### Settings

Option          | Type    | Default  | Description
--------------- | --------| -------- | --------------
arrows          | boolean | true     | enable arrows
duration        | number  | 0.8      | transition-duration 
animation       | string  | ease     | animation-timing-function
visibileItem    | number  | 1        | count visible elements
arrowLeftClass  | string  | prev     | 
arrowRightClass | string  | next     |
arrowLeftContent| string  | <span>prev</span> | content from arrow container
arrowRightContent| string  | <span>next</span> | content from arrow container
offsetRight     | number  | 0        | padding-right in % for element
dots            | boolean | true     | enable dots (pagination)
beforeChange    | void    | ()=>null | callback before sliding
infinity        | boolean | false    | infinity sliding
typeChange      | string  | carousel | type animation change (no stable) carousel | zoom | fade


### Methods

Method             | Description
------------------ | --------------
nextSlide          | 
prevSlide          | 
goToSlide(index)   | index = number slide

## Development

```sh
npm run dev
```


#### License
Copyright (c) 2018 Vjalov Mikhail

Licensed under the MIT license.