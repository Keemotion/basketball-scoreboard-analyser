define(["../../model/coordinate"], function(Coordinate){
	var Transformation = function(canvas_center, scale, canvas_width, canvas_height, /*display_ratio*/image_width, image_height){
		//this.imagePointOnCenter = imagePointOnCenter;
		this.setCanvasCenter(canvas_center);
		this.setScale(scale);
		this.setCanvasWidth(canvas_width);
		this.setCanvasHeight(canvas_height);
		this.setImageWidth(image_width);
		this.setImageHeight(image_height);
		//this.display_ratio = display_ratio;
	};
	Transformation.prototype.setScale = function(scale){
		this.scale = scale;
		this.scale = Math.min(this.scale, 1);
	};
	/*Transformation.prototype.setDisplayRatio = function(ratio){
		this.display_ratio = ratio;
	};*/
	Transformation.prototype.setCanvasWidth = function(width){
		this.canvas_width = width;
	};
	Transformation.prototype.setCanvasHeight = function(height){
		this.canvas_height = height;
	};
	Transformation.prototype.setCanvasCenter = function(center){
		this.canvas_center = center;
	};
	Transformation.prototype.getCanvasCenter = function(){
		return this.canvas_center;
	};
	//point of the image that's displayed in the center of the screen
	/*Transformation.prototype.setImagePointOnCenter = function(x, y){
		this.imagePointOnCenter = new Coordinate(x, y);
	};*/
	Transformation.prototype.getScale = function(){
		return this.scale;
	};
	/*Transformation.prototype.getDisplayRatio = function(){
		return this.display_ratio;
	};*/
	Transformation.prototype.getCanvasWidth = function(){
		return this.canvas_width;
	};
	Transformation.prototype.getCanvasHeight = function(){
		return this.canvas_height;
	};
	Transformation.prototype.getImageWidth = function(){
		return this.image_width;
	};
	Transformation.prototype.getImageHeight = function(){
		return this.image_height;
	};
	Transformation.prototype.setImageHeight = function(height){
		this.image_height = height;
	};
	Transformation.prototype.setImageWidth = function(width){
		this.image_width = width;
	};
	/*Transformation.prototype.getImagePointOnCenter = function(){
		return this.imagePointOnCenter;
	};*/
	Transformation.prototype.inCanvasRange = function(coordinate){
		return coordinate.x >= 0 && coordinate.x <= this.getCanvasWidth() && coordinate.y >= 0 && coordinate.y <= this.getCanvasHeight();
	};
	Transformation.prototype.getCanvasOrigin = function(){
		var canvas_center = this.getCanvasCenter();
		console.log("canvas center = "+JSON.stringify(canvas_center));
		return new Coordinate(canvas_center.x-this.getCanvasWidth()/(this.getImageWidth()*this.getScale()), canvas_center.y+this.getCanvasHeight()/(this.getImageHeight()*this.getScale())); 
	};
	Transformation.prototype.transformRelativeImageCoordinateToAbsoluteImageCoordinate = function(coordinate){
		return new Coordinate((coordinate.x+1.0)*this.getImageWidth()/2.0, (-coordinate.y+1.0)*this.getImageHeight()/2.0);
	};
	Transformation.prototype.transformAbsoluteImageCoordinateToRelativeImageCoordinate = function(coordinate){
		return new Coordinate(coordinate.x*2.0/this.getImageWidth()-1, coordinate.y*2.0/this.getImageHeight()-1);
	};
	Transformation.prototype.transformAbsoluteImageCoordinateToCanvasCoordinate = function(coordinate){
		return this.transformRelativeImageCoordinateToCanvasCoordinate(this.transformAbsoluteImageCoordinateToRelativeImageCoordinate(coordinate));
	};
	Transformation.prototype.transformCanvasCoordinateToAbsoluteImageCoordinate = function(coordinate){
		return this.transformRelativeImageCoordinateToAbsoluteImageCoordinate(this.transformCanvasCoordinateToRelativeImageCoordinate(coordinate));
	};
	Transformation.prototype.transformRelativeImageCoordinateToCanvasCoordinate = function(coordinate){
		var canvas_origin = this.getCanvasOrigin();
		return new Coordinate((coordinate.x-canvas_origin.x)*this.getCanvasWidth()*this.getScale()*this.getHorizontalRatio()/2.0, 
			(canvas_origin.y-coordinate.y)*this.getCanvasHeight()*this.getScale()*this.getVerticalRatio()/2.0);
		//return new Coordinate((coordinate.x-canvas_origin.x)*this.scale*this.getCanvasWidth(), (canvas_origin.y-coordinate.y)*this.scale*this.getCanvasHeight());
		//return new Coordinate((coordinate.x-canvas_origin.x)*this.scale*this.getDisplayRatio()/2.0, (canvas_origin.y-coordinate.y)*this.scale*this.getDisplayRatio());
		/*var c = new Coordinate(coordinate.x, coordinate.y);
		c.x -= this.imagePointOnCenter.x;
		c.y -= this.imagePointOnCenter.y;
		c.x *= this.display_ratio/this.scale;
		c.y *= this.display_ratio/this.scale;
		c.x += this.canvas_width/2;
		c.y += this.canvas_height/2;
		return c;*/
	};
	Transformation.prototype.getHorizontalRatio = function(){
		return this.getImageWidth()/this.getCanvasWidth();
	};
	Transformation.prototype.getVerticalRatio = function(){
		return this.getImageHeight()/this.getCanvasHeight();
	};
	/*Transformation.prototype.getDisplayRatio = function(){
		return Math.min(this.getCanvasWidth(), this.getCanvasHeight());
	};*/
	Transformation.prototype.transformCanvasCoordinateToRelativeImageCoordinate = function(coordinate){
		var canvas_origin = this.getCanvasOrigin();
		console.log("canvas to relative parameter = "+JSON.stringify(coordinate));
		console.log("origin = "+JSON.stringify(canvas_origin));
		//return new Coordinate(canvas_origin.x+coordinate.x/(this.scale*this.getDisplayRatio()), canvas_origin.y-coordinate.y/(this.scale*this.getDisplayRatio()));
		return new Coordinate(2.0*coordinate.x/(this.getCanvasWidth()*this.getScale()*this.getHorizontalRatio())+canvas_origin.x,
			canvas_origin.y-2.0*coordinate.y/(this.getCanvasHeight()*this.getScale()*this.getVerticalRatio()));
		/*var c = new Coordinate(coordinate.x, coordinate.y);
		c.x -= this.canvas_width/2;
		c.y -= this.canvas_height/2;
		c.x /= this.display_ratio/this.scale;
		c.y /= this.display_ratio/this.scale;
		c.x += this.imagePointOnCenter.x;
		c.y += this.imagePointOnCenter.y;
		return c;*/
	};
	return Transformation;
});
