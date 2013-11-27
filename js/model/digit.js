define(["./corner", "./proxy/digit_proxy", './coordinate', './data_base_class'], function(Corner, DigitProxy, Coordinate, DataBaseClass){
    var Digit = function(parent_label, id, data, messaging_system){
		this.init();
        this.parent_label = parent_label;
        this.messaging_system = messaging_system;
        this.id = id;
		this.name = "test";
        this.corners = new Array();
		this.setProxy(new DigitProxy(this));
        this.resetCorners();
    };
	DataBaseClass.applyMethods(Digit.prototype);
	Digit.prototype.type = "digit";
    Digit.prototype.resetCorners = function(){
        this.corners.length = 0;
		this.sub_nodes_proxies.length = 0;
        for(var i = 0; i < 4; ++i){
            this.corners.push(new Corner(this, new Coordinate(2, 1), i, this.messaging_system));
            this.sub_nodes_proxies.push(this.corners[i].getProxy());
        }
    };
    Digit.prototype.getStringifyData = function(){
        var d = new Object();
        d.corners = new Array();
        for(var i = 0; i < this.corners.length; ++i){
            var c = new Object();
            c.x = this.corners[i].getCoordinate().getX();
            c.y = this.corners[i].getCoordinate().getY();
            d.corners.push(c);
        }
        return d;
    };
    Digit.prototype.setCorners = function(corners_data, warn_listeners){
        for(var i = 0; i < 4; ++i){
			this.changeCorner(i, corners_data[i].coordinate.x, corners_data[i].coordinate.y, false);
        }
        if(warn_listeners){
			this.notifyLabelChanged();
		}      
    }
    Digit.prototype.load = function(data, warn_listeners = true){
        this.setCorners(data.corners, false);
        if(warn_listeners){
			this.notifyLabelChanged();
  		}      
    };
	Digit.prototype.update = function(data, warn_listeners = true){
		this.name+='1';
		this.setCorners(data.corners, false);
		if(warn_listeners){
			this.notifyLabelChanged();
		}
	};
    Digit.prototype.changeCorner = function(corner_index, x, y, warnListeners = true){
		this.corners[corner_index].setCoordinate(new Coordinate(x, y));
        //this.corners[corner_index].setX(x);
        //this.corners[corner_index].setY(y);
        if(warnListeners){
			this.notifyLabelChanged();
        }
    };
    return Digit;
});
