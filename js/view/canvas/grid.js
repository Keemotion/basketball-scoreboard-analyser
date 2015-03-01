define(["../../model/coordinate"], function(Coordinate){
	var Grid = function(){
		this.setTopRight(new Coordinate(1, 1));
		this.setBottomRight(new Coordinate(1, -1));
		this.setBottomLeft(new Coordinate(-1, -1));
		this.setTopLeft(new Coordinate(-1, 1));
	};
	Grid.prototype.draw = function(context, transformation){
		var topright = transformation.transformRelativeImageCoordinateToCanvasCoordinate(this.getTopRight());
		var bottomright = transformation.transformRelativeImageCoordinateToCanvasCoordinate(this.getBottomRight());
		var bottomleft = transformation.transformRelativeImageCoordinateToCanvasCoordinate(this.getBottomLeft());
		var topleft = transformation.transformRelativeImageCoordinateToCanvasCoordinate(this.getTopLeft());

		context.beginPath();
		context.moveTo(topright.getX(), topright.getY());
		context.lineTo(bottomright.getX(), bottomright.getY());
		context.lineTo(bottomleft.getX(), bottomleft.getY());
		context.lineTo(topleft.getX(), topleft.getY());
		context.lineTo(topright.getX(), topright.getY());

		context.stroke();
	};
	Grid.prototype.setTopRight = function(coordinate){
		this.top_right = coordinate;
	};
	Grid.prototype.setBottomRight = function(coordinate){
		this.bottom_right = coordinate;
	};
	Grid.prototype.setTopLeft = function(coordinate){
		this.top_left = coordinate;
	};
	Grid.prototype.setBottomLeft = function(coordinate){
		this.bottom_left = coordinate;
	};
	Grid.prototype.getBottomLeft = function(){
		return this.bottom_left;
	};
	Grid.prototype.getTopLeft = function(){
		return this.top_left;
	};
	Grid.prototype.getBottomRight = function(){
		return this.bottom_right;
	};
	Grid.prototype.getTopRight = function(){
		return this.top_right;
	};

	return Grid;
});