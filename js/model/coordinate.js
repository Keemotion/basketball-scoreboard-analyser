define([],function(){
	//A few helper methods for working with coordinates
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
		//TODO: find a better validation function
		//can we use this one? http://stackoverflow.com/questions/18082/validate-numbers-in-javascript-isnumeric?page=1&tab=votes#tab-top
		return this.x && this.y;
	};
    Coordinate.prototype.type = "coordinate";
	//Calculates the center of the coordinates in an array (equal weights)
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
	//Convert floating point coordinates to integer coordinates for use on the canvas
	Coordinate.prototype.round = function(){
		this.x = Math.round(this.x);
		this.y = Math.round(this.y);
	};
	Coordinate.prototype.roundUp = function(){
		this.x = Math.ceil(this.x);
		this.y = Math.ceil(this.y);
	};
	Coordinate.prototype.roundDown = function(){
		this.x = Math.floor(this.x);
		this.y = Math.floor(this.y);
	};
    return Coordinate;
});
