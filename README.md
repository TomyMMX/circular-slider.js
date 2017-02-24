#circular-slider.js

A nice reusable circular slider class in javascript.  
  
##Functionality
- Multiple sliders can be rendered in the same container.
- Each slider has his own max/min limit and step value.
- Value number in the legend changes in real time based on the slider’s position.
- Slider value changes when you drag the handle or if you tap the desired spot on a slider.
- Works on mobile devices.
- No external JS libraries are used.

##Usage
The page where you want to include the slider only needs a suitable container:
```html
<div id="container"></div>
```
And then you can add circular sliders to it like this:

```javascript
var slider1 = makeCircularSlider(
  {
    container: "container", //the id of the container the slider will render in
    color: "#ff3366", //the color of the slider
    maxValue: 360, //the maximal value that can be selected with this slider
    minValue: 0, //the minimal value
    step: 1, //step size in which the value can change
    radius: 100, //radius of the slider
    bandWidth: 17, //width of the slider band/arc
    startValue: 0, //the value that the slider initialises with
    description: "Unknown", //the description of this slider... also seen under the selected value in the legend
    valuePrefix: "$", //if you need some prefix in the value display.. for example currency signs
    valueSuffix: "" //and the suffix.. can be useful when selecting % or something similar
  }            
);
```
All options but the container option are optional, but I strongly suggest you set them since otherwise the slider won't be really useful :)

##Demo
A demo can be found here: [https://tomymmx.github.io/circular-slider.js/]([https://tomymmx.github.io/circular-slider.js/](https://tomymmx.github.io/circular-slider.js/))
