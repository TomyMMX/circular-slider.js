var makeCircularSlider = function(args) {
        
    var defaultOptions = {
        color: "#ff3366", //the celtra logo color is set if no color is defined ;)
        maxValue: 255,
        minValue: 0,        
        step: 1,
        radius: 100,
    };
    
    //TODO: will we have optional arguments??
    for (var def in defaultOptions) {
        if (args[def] === undefined)
            args[def] = defaultOptions[def];
    }        
    
    var CircularSlider = function(args) {
        
        (function() {
            //constructor
        })();
        
        //private stuff
        
        //public stuff
        return {
        };
    }
    
    return new CircularSlider(args);
}