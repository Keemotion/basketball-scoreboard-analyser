define(["./corner", "./proxy/digit_proxy", './coordinate'],function(Corner, DigitProxy, Coordinate){
    var Digit = function(parent_label, id, data, messaging_system){
        this.parent_label = parent_label;
        this.messaging_system = messaging_system;
        this.id = id;
        this.corners = new Array();
        this.sub_nodes_proxies = new Array();
        this.resetCorners();
        this.proxy = new DigitProxy(this);
    };
    Digit.prototype.resetCorners = function(){
        this.corners.length = 0;
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
			this.corners[i].load(corners_data[i], false);
        }
        if(warn_listeners){
            this.messaging_system.fire(this.messaging_system.events.LabelChanged, this.parent_label);
        }
    };
    Digit.prototype.load = function(data, warn_listeners = true){
        this.setCorners(data.corners, false);
        if(warn_listeners){
            this.messaging_system.fire(this.messaging_system.events.LabelChanged, this.parent_label); 
        }
    };
	Digit.prototype.update = function(data, warn_listeners = true){
		this.setCorners(data.corners, false);
		if(warn_listeners){
			this.messaging_system.fire(this.messaging_system.events.LabelChanged, this.parent_label); 
		}
	};
    Digit.prototype.changeCorner = function(corner_index, x, y, warnListeners = true){
        this.corners[corner_index].x = x;
        this.corners[corner_index].y = y;
        if(warnListeners){
            this.messaging_system.fire(this.messaging_system.events.LabelChanged, this.parent_label);
        }
    };
    Digit.prototype.getSubNodesProxies = function(){
        return this.sub_nodes_proxies;
    };
    Digit.prototype.getProxy = function(){
        return this.proxy;
    };
    Digit.prototype.getTitle = function(){
        return "digit";
    };
    Digit.prototype.getId = function(){
        return this.id;
    };
    Digit.prototype.type = "digit";
    return Digit;
});
