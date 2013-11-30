define([],function(){
    var Coordinate = function(x, y){
        this.x = x;
        this.y = y;
    };
	Coordinate.prototype.getX = function(){
		return this.x;
	};
	Coordinate.prototype.getY = function(){
		return this.y;
	};
	Coordinate.prototype.isValid = function(){
		return this.x && this.y;
	};
    Coordinate.prototype.type = "coordinate";
    return Coordinate;
});
