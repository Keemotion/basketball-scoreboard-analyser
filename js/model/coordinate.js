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
	Coordinate.getMiddle = function(arr){
		if(arr.length == 0)
			return new Coordinate('', '');
		var total_x = 0;
		var total_y = 0;
		for(var i = 0; i < arr.length; ++i){
			total_x += arr[i].getX();
			total_y += arr[i].getY();
		}
		total_x /= arr.length;
		total_y /= arr.length;
		return new Coordinate(total_x, total_y);
	};
	Coordinate.getSquareDistance = function(c1, c2){
		var dx = c1.getX()-c2.getX();
		var dy = c1.getY()-c2.getY();
		return dx*dx+dy*dy;
	};
    return Coordinate;
});
