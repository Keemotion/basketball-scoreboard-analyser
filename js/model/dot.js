define(["./proxy/dot_proxy", './coordinate', './data_base_class'], function(DotProxy, Coordinate, DataBaseClass){
    var Dot = function(parent, /*id, */data, messaging_system){
        this.messaging_system = messaging_system;
		this.init();
        this.setParent(parent);
        this.loadData(data);
		this.setProxy(new DotProxy(this));
    };
	Dot.prototype = new DataBaseClass();
	Dot.prototype.type = "dot";
	Dot.prototype.loadData = function(data){
		if(data == null){
			//default
			this.setConfigurationKeys(Dot.default_configuration_keys);
			this.coordinate = new Coordinate("", "");
		}else{
			this.setConfigurationKeys(data.configuration_keys);
			this.coordinate = new Coordinate(data.coordinate.x, data.coordinate.y); 
		}
	};
	Dot.prototype.getCoordinate = function(){
		return this.coordinate;
	};
	Dot.prototype.setCoordinate = function(coordinate){
		this.coordinate = coordinate;
	};
    Dot.prototype.getStringifyData = function(){
        var d = new Object();
        d.type = this.getType();
		d.coordinate = this.getCoordinate();
        return d;
    };
    Dot.prototype.load = function(data, warn_listeners){
        if(warn_listeners == null)
            warn_listeners = true;
        this.setCoordinate(data.coordinate);
        if(warn_listeners){
			this.notifyGroupChanged();
  		}     
    };
    Dot.prototype.getData = function(){
    	var object = new Object();
    	object.name = this.name;
    	object.coordinate = this.getCoordinate();
    	return object;
    };
    Dot.prototype.update = function(data, warn_listeners){
    	if(warn_listeners == null)
            warn_listeners = true;
		this.name = data.name;
		this.setCoordinate(data.coordinate);
		if(warn_listeners){
			this.notifyGroupChanged();
		}
    };
    Dot.prototype.isAtCanvasCoordinate = function(coordinate, transformation){
		var canvas_coordinate = transformation.transformRelativeCoordinateToCanvasCoordinate(this.getCoordinate());
		if(canvas_coordinate.getSquareDistance(coordinate) < 25){
			return true;
		}
	};
    return Dot;
});
