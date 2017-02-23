var sliderCount = 0;
var makeCircularSlider = function (args) {

    //we have to know which container to use to draw the slider
    if (args.container === undefined)
        return {};

    //our container
    var mainContainer = document.getElementById(args.container);
    var container = document.getElementById("sliderContainer");
    var legendContainer = document.getElementById("sliderLegend");

    if (container === null) {
        container = document.createElement('div');
        container.setAttribute("id", "sliderContainer");
        legendContainer = document.createElement('div');
        legendContainer.setAttribute("id", "sliderLegend");
        legendContainer.setAttribute('class', 'clearfix');
        mainContainer.appendChild(legendContainer);
        mainContainer.appendChild(container);
    }

    var ch = container.style.height;
    ch = ch.substring(0, ch.length - 2);
    if (ch < args.radius * 2 + 20) {
        container.style.height = (args.radius * 2 + 20) + "px";
        container.style.width = (args.radius * 2 + 20) + "px";
    }

    sliderCount++;

    var defaultOptions = {
        color: "#ff3366", //the celtra logo color is set if no color is defined ;)
        maxValue: 360,
        minValue: 0,
        step: 1,
        radius: 100,
        startValue: 0,
        description: "Unknown",
        valuePrefix: "",
        valueSuffix: ""
    };

    //fill options with defaults where undefined
    for (var def in defaultOptions) {
        if (args[def] === undefined)
            args[def] = defaultOptions[def];
    }

    var CircularSlider = function (args) {
        var currentAngle = -90;
        var currentValue = 0;

        //parts of the slider
        var sliderCircle;
        var slidingButton;
        var buttonCircle;

        //div with the value
        var valueDisplay;

        //the hidden input
        var input;

        //center position of slider on screen
        var center;

        //constructor
        (function () {
            initSliderVisuals();
            initHiddenInput();
            calculateSliderCenter();
            initSliderPosition();
            
            //event listeners
            //add mousemove listener when mousedown on buttonCirlce
            buttonCircle.addEventListener("mousedown", function () {
                calculateSliderCenter();
                document.addEventListener("mousemove", moveSlider);
            });

            //remove mousemove listener
            document.addEventListener("mouseup", function () {
                document.removeEventListener("mousemove", moveSlider);
            });

            //and the same for touch events
            buttonCircle.addEventListener("touchstart", function () {
                calculateSliderCenter();
                document.addEventListener("touchmove", moveSlider);
            });
            document.addEventListener("touchend", function () {
                document.removeEventListener("touchmove", moveSlider);
            });

            //click or touch event on the slider circle
            sliderCircle.addEventListener("click", function () {
                calculateSliderCenter();
                moveSlider(event, true);
            });
            sliderCircle.addEventListener("touchstart", function () {
                calculateSliderCenter();
                moveSlider(event, true);
            });
        })();

        //private stuff
        function initSliderVisuals() {
            //main circle of the slider
            sliderCircle = document.createElement('div');
            sliderCircle.setAttribute("class", "sliderCircle");
            container.appendChild(sliderCircle);
            sliderCircle.style.width = 2 * args.radius + "px";
            sliderCircle.style.height = 2 * args.radius + "px";
            sliderCircle.style["background-color"] = args.color;
            
            //add some fancy lines
            initLines();

            //masking circle... so it covers the center and we only see the edge of the main circle
            var sliderCenter = document.createElement('div');
            sliderCenter.setAttribute("class", "sliderCenter");
            sliderCircle.appendChild(sliderCenter);
            sliderCenter.style.width = (2 * args.radius - 34) + "px";
            sliderCenter.style.height = (2 * args.radius - 34) + "px";

            //actual sliding button
            slidingButton = document.createElement('div');
            buttonCircle = document.createElement('div');
            slidingButton.setAttribute("class", "slidingButton");
            buttonCircle.setAttribute("class", "buttonCircle");
            sliderCircle.appendChild(slidingButton);
            slidingButton.appendChild(buttonCircle);
            slidingButton.style.width = (4 + args.radius) + "px";

            setZIndexFroSliders();

            //legend element 
            var legendElement = document.createElement('div');
            legendElement.setAttribute('class', 'legendElement clearfix')
            legendContainer.appendChild(legendElement);
            valueDisplay = document.createElement('div');
            valueDisplay.setAttribute('class', 'legendElementValue');
            legendElement.appendChild(valueDisplay);
            var elementName = document.createElement('div');
            elementName.setAttribute('class', 'legendElementName');
            elementName.innerHTML = args.description;
            elementName.style["background-color"] = args.color;
            legendElement.appendChild(elementName);
        }

        function initHiddenInput() {
            input = document.createElement("input");
            input.setAttribute("type", "hidden");
            input.setAttribute("name", "circularSlider_" + sliderCount);
            input.id = "circularSlider_" + sliderCount;
            sliderCircle.appendChild(input);
        }

        function initSliderPosition() {
            setCurrentAngleAndCalculateValue(calculateAngleFromValue(args.startValue));
        }
        
        function initLines(){
            //lines that make the slider more fancy
            //make the lines of equal distance on the edges 9px
            var lineNum = Math.round((2 * args.radius * Math.PI) / 9);
            var lineAngle = 360 / lineNum;
            for (var i = 0; i < lineNum; i++) {
                var line = document.createElement("div");
                line.setAttribute('class', 'fancyLine');
                line.style.width = args.radius+'px';
                sliderCircle.appendChild(line);
                line.style.transform = 'rotate(' + (i * lineAngle - 90) + 'deg)';
            }
        }
        
        function setZIndexFroSliders() {
            var allSliders = [];
            //get all existing sliders and save their indexes and sizes
            for(var i=0;i<container.childNodes.length;i++){
                allSliders[i] = {index: i, width: container.childNodes[i].clientWidth};                                 
            }
            
            //order by size
            allSliders.sort(function(a,b){
                return b.width - a.width;
            });

            //set zIndex, so the widest slider is on bottom and the smallest on top
            for(var i=0;i<allSliders.length;i++){
                 container.childNodes[allSliders[i].index].style.zIndex = i+1;                
            }
        }
        
        function calculateSliderCenter(){
            //calculate center position of this slider on screen
            var boundingRect = sliderCircle.getBoundingClientRect();
            center = {
                x: boundingRect.left + boundingRect.width / 2,
                y: boundingRect.top + boundingRect.height / 2
            };
        }

        function calculateAngleFromValue(val) {
            //0 degrees is equal ot minValue and 360 is equal to maxValue
            return (val - args.minValue) / (args.maxValue - args.minValue) * 360;
        }

        function calculateAngleFromMousePosition(x, y) {
            //distances from the center
            var distX = x - center.x;
            var distY = y - center.y;

            var angle360 = 0;
            var angle180_180 = Math.atan2(distY, distX) * 180 / Math.PI;
            //the upper formula gives us the angle in the format -180 to 180... we want that in the 0 to 360 range
            //so 0 degrees is equal to minValue and 360 is equal to maxValue
            if (angle180_180 >= -90 && angle180_180 <= 0) {
                angle360 = 90 + angle180_180;
            } else if (angle180_180 < -90 && angle180_180 >= -180) {
                angle360 = 360 + 90 + angle180_180;
            } else {
                angle360 = angle180_180 + 90;
            }

            return angle360;
        };

        function moveSlider(event, isClick) {
            var X = event.pageX;
            var Y = event.pageY;

            //if touch input then the coordinates are in the touches array of the event
            if (X === undefined) {
                X = event.touches[0].clientX;
            }
            if (Y === undefined) {
                Y = event.touches[0].clientY;
            }

            var calculatedAngle = calculateAngleFromMousePosition(X, Y);

            if (isClick) {
                setCurrentAngleAndCalculateValue(calculatedAngle);
            }
            else {
                //prevent sliding over the min/max value
                if (currentAngle > 270 && calculatedAngle < 90) {
                    setCurrentAngleAndCalculateValue(360);
                } else if (currentAngle < 90 && calculatedAngle > 270) {
                    setCurrentAngleAndCalculateValue(0);
                } else {
                    setCurrentAngleAndCalculateValue(calculatedAngle);
                }
            }            

            return false;
        }

        function colorSlider() {
            if (currentAngle >= 0 && currentAngle <= 180) {
                sliderCircle.style["background-image"] = "linear-gradient(" + (currentAngle + 91) + "deg, transparent 50%, #cfcfd0 50%), linear-gradient(90deg, #cfcfd0 50%, transparent 50%)";
            } else {
                sliderCircle.style["background-image"] = "linear-gradient(" + (currentAngle - 91) + "deg, transparent 50%, " + args.color + " 50%), linear-gradient(90deg, #cfcfd0 50%, transparent 50%)";
            }
        }

        function setCurrentAngleAndCalculateValue(angle) {         
            //calculate closest legal value for angle
            var exactValue = (args.maxValue - args.minValue) * (angle / 360) + args.minValue;
            currentValue = Math.round(exactValue / args.step) * args.step;

            //display the new value
            valueDisplay.innerHTML = args.valuePrefix + currentValue + args.valueSuffix;
            input.setAttribute("value", currentValue);
            
            //don't change the visuals if they are too small to notice
            if(Math.abs(currentAngle-angle) < 1){
                return;
            }            
            currentAngle = Math.round((currentValue - args.minValue) / (args.maxValue - args.minValue) * 360);

            //change visuals
            colorSlider();            
            slidingButton.style.transform = 'rotate(' + (currentAngle - 90) + 'deg)';
        }

        //public stuff
        return {
            getValue: function () {
                return currentValue;
            }
        };
    }

    return new CircularSlider(args);
}