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
        maxValue: 360,
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
        var currentValue = 0;
        
        //parts of the slider
        var sliderCircle;  
        var sliderCenter;
        var slidingButton;
        var buttonCircle;
        
        //center position of slider on screen
        var center;   
        
        //constructor
        (function() {            
            initSliderVisuals();
            initSliderPosition();
            
            //calculate center position of this slider on screen
            var boundingRect = sliderCircle.getBoundingClientRect();
            center = {
                x: boundingRect.left + boundingRect.width / 2,
                y: boundingRect.top + boundingRect.height / 2
            };
            
            //event listeners
            //add mousemove listener when mousedown on buttonCirlce
            buttonCircle.addEventListener("mousedown", function() {
                document.addEventListener("mousemove", moveSlider);
            });
            
            //remove mousemove listener
            document.addEventListener("mouseup", function() {
                document.removeEventListener("mousemove", moveSlider);
            });
                     
            //and the same for touch events
            buttonCircle.addEventListener("touchstart", function() {
                document.addEventListener("touchmove", moveSlider);
            });                        
            document.addEventListener("touchend", function() {
                document.removeEventListener("touchmove", moveSlider);
            });
            
            //click or touch event on the slider circle
            sliderCircle.addEventListener("click", function(){
                moveSlider(event, true);
            });
            sliderCircle.addEventListener("touchstart", function() {
                moveSlider(event, true);
            });
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
            slidingButton.style.width = (4 + args.radius) + "px";   

            sliderCircle.style.zIndex = sliderCount;
        }
        
        function initSliderPosition() {
            setCurrentAngleAndCalculateValue(calculateAngleFromValue(args.startValue));
            slidingButton.style.transform = 'rotate('+ (currentAngle - 90) +'deg)';
        }
        
        function calculateAngleFromValue(val) {
            //0 degrees is equal ot minValue and 360 is equal to maxValue
            return val / (args.maxValue - args.minValue) * 360;
        }
        
        function calculateAngleFromMousePosition(x, y) {
            //distances from the center
            var distX = x - center.x;
            var distY = y - center.y;
            
            var angle360 = 0;
            var angle180_180 = Math.atan2(distY, distX) * 180 / Math.PI;
            //the upper formula gives us the angle in the format -180 to 180... we want that in the 0 to 360 range
            //so 0 degrees is equal to minValue and 360 is equal to maxValue
            if(angle180_180 >= -90 && angle180_180 <= 0){
                angle360 = 90 + angle180_180;
            }else if (angle180_180 < -90 && angle180_180 >= -180){
                angle360 = 360 + 90 + angle180_180;
            }else{
                angle360 = angle180_180 + 90;                
            }
            
            return angle360;
        };
        
        function moveSlider(event, isClick) {
            event.preventDefault();
                                    
            var calculatedAngle = calculateAngleFromMousePosition(event.pageX, event.pageY);   
            
            if(isClick){
                setCurrentAngleAndCalculateValue(calculatedAngle);
            }
            else{         
                //prevent sliding over the min/max value
                if(currentAngle>270 && calculatedAngle < 90){
                    setCurrentAngleAndCalculateValue(360);                
                }else if (currentAngle < 90 && calculatedAngle > 270){
                    setCurrentAngleAndCalculateValue(0);                
                }else{                
                    setCurrentAngleAndCalculateValue(calculatedAngle);
                } 
            }            
                  
            slidingButton.style.transform = 'rotate('+ (currentAngle - 90) +'deg)';  
               
            return false;
        }
        
        function setCurrentAngleAndCalculateValue(angle){
            //calculate closest legal value for angle
            var exactValue = (args.maxValue-args.minValue) * (angle/360) + args.minValue;            
            currentValue = Math.round(exactValue/args.step) * args.step;
            
            currentAngle = Math.round(currentValue / (args.maxValue - args.minValue) * 360);            
        }
        
        //public stuff
        return {
        };
    }
    
    return new CircularSlider(args);
}