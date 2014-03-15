define(["./corner", "./proxy/digit_proxy", './coordinate', './data_base_class'], function(Corner, DigitProxy, Coordinate, DataBaseClass){
    var Digit = function(parent, id, data, messaging_system){
        this.messaging_system = messaging_system;
		this.init();
        this.setParent(parent);
        this.setConfigurationKeys(data.configuration_keys);
        this.id = id;
		this.name = "digit";
		this.setProxy(new DigitProxy(this));
		this.lockNotification();
        this.setCorners((data?data.corners:null), false);
        this.unlockNotification();
    };
	Digit.prototype = new DataBaseClass("digit");

    Digit.prototype.resetCorners = function(){
        this.clearSubNodes();
        for(var i = 0; i < 4; ++i){
        	this.addSubNode(new Corner(this, new Coordinate("", ""), i, this.messaging_system));
        }
    };
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
			c.name = corners[i].getTitle();
			c.id = corners[i].getId();
            d.sub_nodes.push(c);
        }
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
    Digit.prototype.changeCorner = function(corner_index, x, y, warn_listeners){
        if(warn_listeners == null)
            warn_listeners = true;
        var corners = this.getSubNodes();
		corners[corner_index].setCoordinate(new Coordinate(x, y));
        if(warn_listeners){
			this.notifyGroupChanged();
        }
    };
    return Digit;
});
