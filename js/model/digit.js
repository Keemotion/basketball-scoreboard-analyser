define(["./corner", "./proxy/digit_proxy", './coordinate', './data_base_class'], function(Corner, DigitProxy, Coordinate, DataBaseClass){
	var Digit = function(parent/*, id*/, data, messaging_system){
		this.messaging_system = messaging_system;
		this.init();
		this.setParent(parent);
		this.setProxy(new DigitProxy(this));
		this.lockNotification();
		this.loadData(data);
		this.unlockNotification();
	};
	Digit.prototype = new DataBaseClass("digit");
	Digit.default_configuration_keys = {};
	//loads the digit
	//when no data is provided, 4 empty corners are generated and all default properties are set to this digit
	Digit.prototype.loadData = function(data){
		if(data == null){
			//default
			this.resetCorners();
			this.setConfigurationKeys(Digit.default_configuration_keys);
			this.extra_value = 0.0033333334;
		}else{
			this.setCorners(data.corners);
			this.setConfigurationKeys(data.configuration_keys);
			this.extra_value = data.extra_value;
		}
	};
	Digit.prototype.resetCorners = function(){
		this.clearSubNodes();
		for(var i = 0; i < 4; ++i){
			this.addSubNode(new Corner(this, new Coordinate("", ""), i, this.messaging_system));
		}
	};
	//collects all data about this digit in an Object that can be converted to JSON by the export function
	Digit.prototype.getStringifyData = function(){
		var d = new Object();
		d.sub_nodes = new Array();
		d.type = this.getType();
		var corners = this.getSubNodes();
		for(var i = 0; i < corners.length; ++i){
			var c = new Object();
			c.coordinate = new Object();
			c.coordinate.x = corners[i].getCoordinate().getX();
			c.coordinate.y = corners[i].getCoordinate().getY();
			d.sub_nodes.push(c);
		}
		d.extra_value = this.extra_value;
		return d;
	};
	Digit.prototype.updateCorners = function(corners_data, warn_listeners){
		if(warn_listeners == null)
			warn_listeners = true;
		for(var i = 0; i < 4; ++i){
			this.changeCorner(i, corners_data[i].coordinate.x, corners_data[i].coordinate.y, false);
		}
		if(warn_listeners){
			this.notifyGroupChanged();
		}
	};
	Digit.prototype.setCorners = function(corners_data, warn_listeners){
		this.resetCorners();
		if(corners_data){
			this.updateCorners(corners_data, false);
		}
		if(warn_listeners){
			this.notifyGroupChanged();
		}
	};
	Digit.prototype.load = function(data, warn_listeners){
		if(warn_listeners == null)
			warn_listeners = true;
		this.setCorners(data.corners, false);
		if(warn_listeners){
			this.notifyGroupChanged();
		}
	};
	Digit.prototype.update = function(data, warn_listeners){
		if(warn_listeners == null)
			warn_listeners = true;
		this.name = data.name;
		this.updateCorners(data.corners, false);
		if(warn_listeners){
			this.notifyGroupChanged();
		}
	};
	//getData is used by the proxy. It collects all data that can be accessed via the proxy
	Digit.prototype.getData = function(){
		var object = new Object();
		object.name = this.name;
		object.corners = new Array();
		for(var i = 0; i < this.sub_nodes.length; ++i){
			var o = new Object();
			o.coordinate = this.sub_nodes[i].getCoordinate();
			object.corners.push(o);
		}
		object.extra_value = this.extra_value;
		return object;
	};
	//changing the coordinate of a corner
	Digit.prototype.changeCorner = function(corner_index, x, y, warn_listeners){
		if(warn_listeners == null)
			warn_listeners = true;
		var corners = this.getSubNodes();
		corners[corner_index].setCoordinate(new Coordinate(x, y));
		if(warn_listeners){
			this.notifyGroupChanged();
		}
	};
	Digit.prototype.reset = function(){
		for(var i = 0; i < this.sub_nodes.length; ++i){
			this.sub_nodes[i].reset();
		}
	};
	return Digit;
});
