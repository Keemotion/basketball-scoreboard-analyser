define([],function(){
    var CornerProxy = function(corner){
        this.corner = corner;
    };
    CornerProxy.prototype.getTitle = function(){
        return this.corner.getTitle();
    };
    CornerProxy.prototype.getId = function(){
        return this.corner.getId();
    };
    CornerProxy.prototype.getSubNodes = function(){
        return new Array();
    };
	CornerProxy.prototype.getX = function(){
		return this.getCoordinate().getX();
	};
	CornerProxy.prototype.getY = function(){
		return this.getCoordinate().getY();
	};
	CornerProxy.prototype.getCoordinate = function(){
		return this.corner.getCoordinate();
	};
	CornerProxy.prototype.getUpdateEvents = function(){
		return [];
	};
    return CornerProxy;
});
