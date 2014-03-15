define(["../../model/coordinate"], function(Coordinate){
	var Transformation = function(canvas_center, scale, canvas_width, canvas_height, image_width, image_height){
		this.setCanvasCenter(canvas_center);
		this.setScale(scale);
		this.setCanvasWidth(canvas_width);
		this.setCanvasHeight(canvas_height);
		this.setImageWidth(image_width);
		this.setImageHeight(image_height);
	};
	Transformation.prototype.setScale = function(scale){
		this.scale = scale;
		this.scale = Math.max(this.scale, 1);
	};
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
	Transformation.prototype.getScale = function(){
		return this.scale;
	};
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
	Transformation.prototype.inCanvasRange = function(coordinate){
		return coordinate.x >= 0 && coordinate.x <= this.getCanvasWidth() && coordinate.y >= 0 && coordinate.y <= this.getCanvasHeight();
	};
	Transformation.prototype.getCanvasOrigin = function(){
		var canvas_center = this.getCanvasCenter();
		return new Coordinate(canvas_center.x-this.getCanvasWidth()/(this.getDisplayRatio()*this.getScale()), canvas_center.y+this.getCanvasHeight()/(this.getDisplayRatio()*this.getScale())); 
	};
	Transformation.prototype.transformRelativeImageCoordinateToAbsoluteImageCoordinate = function(coordinate){
		return new Coordinate((coordinate.x+this.getHorizontalRatio())*this.getImageRatio()/2.0, (-coordinate.y+this.getVerticalRatio())*this.getImageRatio()/2.0);
	};
	Transformation.prototype.getDisplayRatio = function(){
		var m = Math.min(this.getImageWidth(), this.getImageHeight());
		return Math.min(m*this.getCanvasHeight()/this.getImageHeight(), m*this.getCanvasWidth()/this.getImageWidth());
	};
	Transformation.prototype.getImageRatio = function(){
		return Math.min(this.getImageWidth(), this.getImageHeight());
	};
	Transformation.prototype.transformAbsoluteImageCoordinateToRelativeImageCoordinate = function(coordinate){
		return new Coordinate(coordinate.x*2.0/this.getImageRatio()-this.getHorizontalRatio(), coordinate.y*2.0/this.getImageRatio()-this.getVerticalRatio());
	};
	Transformation.prototype.transformAbsoluteImageCoordinateToCanvasCoordinate = function(coordinate){
		return this.transformRelativeImageCoordinateToCanvasCoordinate(this.transformAbsoluteImageCoordinateToRelativeImageCoordinate(coordinate));
	};
	Transformation.prototype.transformCanvasCoordinateToAbsoluteImageCoordinate = function(coordinate){
		return this.transformRelativeImageCoordinateToAbsoluteImageCoordinate(this.transformCanvasCoordinateToRelativeImageCoordinate(coordinate));
	};
	Transformation.prototype.transformRelativeImageCoordinateToCanvasCoordinate = function(coordinate){
		var canvas_origin = this.getCanvasOrigin();
		return new Coordinate((coordinate.x-canvas_origin.x)*this.getScale()*this.getDisplayRatio()/2.0, 
			(canvas_origin.y-coordinate.y)*this.getScale()*this.getDisplayRatio()/2.0);
	};
	Transformation.prototype.getHorizontalRatio = function(){
		return this.getImageWidth()/this.getImageRatio();
	};
	Transformation.prototype.getVerticalRatio = function(){
		return this.getImageHeight()/this.getImageRatio();
	};
	Transformation.prototype.transformCanvasCoordinateToRelativeImageCoordinate = function(coordinate){
		var canvas_origin = this.getCanvasOrigin();
		return new Coordinate(2.0*coordinate.x/(this.getScale()*this.getDisplayRatio())+canvas_origin.x,
			canvas_origin.y-2.0*coordinate.y/(this.getScale()*this.getDisplayRatio()));
	};
	return Transformation;
});
