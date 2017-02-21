var sliderCount = 0;

var makeCircularSlider = function(args) {
    
    //we have to know which container to use to draw the slider
    if (args.container === undefined)
        return {};
        
    //our container
    var container = document.getElementById(args.container);
    
    sliderCount++;
    
    var defaultOptions = {
        color: "#ff3366", //the celtra logo color is set if no color is defined ;)
        maxValue: 255,
        minValue: 0,        
        step: 1,
        radius: 100,
        startValue: 0
    };
    
    //TODO: will we have optional arguments??
    for (var def in defaultOptions) {
        if (args[def] === undefined)
            args[def] = defaultOptions[def];
    }        
    
    var CircularSlider = function(args) {
        var currentAngle = -90;
        
        //parts of the slider
        var sliderCircle;  
        var sliderCenter;
        var slidingButton;
        var buttonCircle;
        
        (function() {
            //constructor
            initSliderVisuals();
            initSliderPosition();
        })();
        
        //private stuff
        function initSliderVisuals() { 
            //main circle of the slider
            sliderCircle = document.createElement('div');
            sliderCircle.setAttribute("id", "sliderCircle" + sliderCount);
            container.appendChild(sliderCircle);            
            sliderCircle.style.width = 2 * args.radius + "px";
            sliderCircle.style.height = 2 * args.radius + "px";
            sliderCircle.style.background = "#cfcfd0";
            
            //masking circle... so it covers the center and we only see the edge of the main circle
            sliderCenter = document.createElement('div');
            sliderCenter.setAttribute("id", "sliderCenter" + sliderCount);
            sliderCircle.appendChild(sliderCenter);            
            sliderCenter.style.width = (2 * args.radius - 34) + "px";
            sliderCenter.style.height = (2 * args.radius - 34) + "px";
            
            //actual sliding button
            slidingButton = document.createElement('div');
            buttonCircle = document.createElement('div');
            slidingButton.setAttribute("id", "slidingButton" + sliderCount);
            buttonCircle.setAttribute("id", "buttonCircle" + sliderCount);  
            sliderCircle.appendChild(slidingButton);
            slidingButton.appendChild(buttonCircle);
            slidingButton.style.width = (5+args.radius) + "px";   

            sliderCircle.style.zIndex = sliderCount;
        }
        
        function initSliderPosition() {
            currentAngle = calculateAngleFromValue(args.startValue);
            slidingButton.style.transform = 'rotate('+ currentAngle +'deg)';
        }
        
        function calculateAngleFromValue(val) {
            var angle = Math.round(val / (args.maxValue - args.minValue) * 360 - 90);
            
            return angle;
        }
        
        //public stuff
        return {
        };
    }
    
    return new CircularSlider(args);
}