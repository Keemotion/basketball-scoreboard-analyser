define(["./proxy/dot_proxy", './coordinate', './data_base_class'], function(DotProxy, Coordinate, DataBaseClass){
	//represents leds on the scoreboard
    var Dot = function(parent, data, messaging_system){
        this.messaging_system = messaging_system;
		this.init();
        this.setParent(parent);
        this.loadData(data);
		this.setProxy(new DotProxy(this));
    };
	Dot.prototype = new DataBaseClass();
	Dot.prototype.type = "dot";
	//loads the data for the current dot
	//when no data is provided, the coordinate is set to be empty and the default properties are applied to this dot
	Dot.prototype.loadData = function(data){
		if(data == null){
			//default
			this.setConfigurationKeys(Dot.default_configuration_keys);
			this.coordinate = new Coordinate("", "");
		}else{
			this.setConfigurationKeys(data.configuration_keys);
			this.coordinate = new Coordinate(data.coordinate.x, data.coordinate.y); 
			this.extra_value = data.extra_led_value;
		}
	};
	Dot.prototype.getCoordinate = function(){
		return this.coordinate;
	};
	Dot.prototype.setCoordinate = function(coordinate){
		this.coordinate = coordinate;
	};
	//Collects all data about this dot in an Object that can be converted to JSON by the export function
    Dot.prototype.getStringifyData = function(){
        var d = new Object();
        d.type = this.getType();
		d.coordinate = this.getCoordinate();
		d.extra_value = this.extra_value;
        return d;
    };
	//loads the data for this dot
    Dot.prototype.load = function(data, warn_listeners){
        if(warn_listeners == null)
            warn_listeners = true;
        this.setCoordinate(data.coordinate);
        if(warn_listeners){
			this.notifyGroupChanged();
  		}     
    };
	//returns all data that can be accessed by the view through the proxies
    Dot.prototype.getData = function(){
    	var object = new Object();
    	object.name = this.name;
    	object.coordinate = this.getCoordinate();
    	object.extra_value = this.extra_value;
    	return object;
    };
	//updates the data for this dot
    Dot.prototype.update = function(data, warn_listeners){
    	if(warn_listeners == null)
            warn_listeners = true;
		this.name = data.name;
		this.setCoordinate(data.coordinate);
		if(warn_listeners){
			this.notifyGroupChanged();
		}
    };
	//return whether the coordinate of this dot is within 5 canvas pixels of the given coordinate
	//the distance is calculated using a Transformation object
    Dot.prototype.isAtCanvasCoordinate = function(coordinate, transformation){
		var canvas_coordinate = transformation.transformRelativeCoordinateToCanvasCoordinate(this.getCoordinate());
		if(canvas_coordinate.getSquareDistance(coordinate) < 25){
			return true;
		}
	};
	Dot.prototype.canBeMoved = function(){
		return true;
	};
	Dot.prototype.move = function(translation){
		this.setCoordinate(this.getCoordinate().add(translation));
	};
    return Dot;
});
