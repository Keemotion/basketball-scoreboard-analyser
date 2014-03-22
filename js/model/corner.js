define(['./coordinate','./proxy/corner_proxy', './data_base_class'], function(Coordinate, CornerProxy, DataBaseClass){
    var Corner = function(parent_digit, coordinate, id, messaging_system){
        this.messaging_system = messaging_system;
		this.init();
        this.id = id;
        this.setCoordinate(coordinate);
        this.parent_digit = parent_digit;
        this.proxy = new CornerProxy(this);
    };
	Corner.prototype = new DataBaseClass("corner");
    Corner.prototype.getCoordinate = function(){
        return this.coordinate;
    };
    Corner.prototype.setCoordinate = function(coordinate){
        this.coordinate = coordinate;
        this.notifyGroupChanged();
    };
    Corner.prototype.getTitle = function(){
        return "x: "+(this.getCoordinate().x + "").substr(0, 10)+" y: "+(this.getCoordinate().y+"").substr(0, 10);
    };
	Corner.prototype.load = function(corner_data, warn_listeners){
		this.id = corner_data.id;
		this.setCoordinate(corner_data.coordinate);
		if(warn_listeners){
			this.notifyGroupChanged();
		}
	};
	Corner.prototype.update = function(data){
		this.setCoordinate(data.coordinate);
	};
    return Corner;
});
