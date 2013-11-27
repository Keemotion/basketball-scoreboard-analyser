define(["../../model/coordinate"], function(Coordinate){
	var Transformation = function(imagePointOnCenter, scale, canvas_width, canvas_height, display_ratio){
		this.imagePointOnCenter = imagePointOnCenter;
		this.scale = scale;
		this.canvas_width = canvas_width;
		this.canvas_height = canvas_height;
		this.display_ratio = display_ratio;
	};
	Transformation.prototype.setScale = function(scale){
		this.scale = scale;
		this.scale = Math.min(this.scale, 1);
	};
	Transformation.prototype.setDisplayRatio = function(ratio){
		this.display_ratio = ratio;
	};
	Transformation.prototype.setCanvasWidth = function(width){
		this.canvas_width = width;
	};
	Transformation.prototype.setCanvasHeight = function(height){
		this.canvas_height = height;
	};
	Transformation.prototype.setImagePointOnCenter = function(x, y){
		this.imagePointOnCenter = new Coordinate(x, y);
	};
	Transformation.prototype.getScale = function(){
		return this.scale;
	};
	Transformation.prototype.getDisplayRatio = function(){
		return this.display_ratio;
	};
	Transformation.prototype.getCanvasWidth = function(){
		return this.canvas_width;
	};
	Transformation.prototype.getCanvasHeight = function(){
		return this.canvas_height;
	};
	Transformation.prototype.getImagePointOnCenter = function(){
		return this.imagePointOnCenter;
	};
	Transformation.prototype.transformImageCoordinateToCanvasCoordinate = function(coordinate){
		var c = new Coordinate(coordinate.x, coordinate.y);
		c.x -= this.imagePointOnCenter.x;
		c.y -= this.imagePointOnCenter.y;
		c.x *= this.display_ratio/this.scale;
		c.y *= this.display_ratio/this.scale;
		c.x += this.canvas_width/2;
		c.y += this.canvas_height/2;
		return c;
	};
	Transformation.prototype.transformCanvasCoordinateToImageCoordinate = function(coordinate){
		var c = new Coordinate(coordinate.x, coordinate.y);
		c.x -= this.canvas_width/2;
		c.y -= this.canvas_height/2;
		c.x /= this.display_ratio/this.scale;
		c.y /= this.display_ratio/this.scale;
		c.x += this.imagePointOnCenter.x;
		c.y += this.imagePointOnCenter.y;
		return c;
	};
	return Transformation;
});
