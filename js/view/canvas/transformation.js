define(["../../model/coordinate"], function(Coordinate){
	// Calculates the equivalence between canvas coordinates, relative image
	// coordinates, absolute image coordinates
	var Transformation = function(canvas_center, scale, canvas_width, canvas_height, image_width, image_height){
		this.setCanvasCenter(canvas_center);
		this.setScale(scale);
		this.setCanvasWidth(canvas_width);
		this.setCanvasHeight(canvas_height);
		this.setImageWidth(image_width);
		this.setImageHeight(image_height);
	};
	// zooming
	Transformation.prototype.setScale = function(scale, zoom_coordinate){
		var old_scale = this.getScale();
		this.scale = scale;
		this.scale = Math.max(this.scale, 1);
		if(zoom_coordinate != null){
			var factor = old_scale *1.0/ this.getScale();
			var center_coordinate = this.getCanvasCenter();
			var new_center = new Coordinate(zoom_coordinate.getX() - factor*(zoom_coordinate.getX()-center_coordinate.getX()),
			zoom_coordinate.getY() - factor*(zoom_coordinate.getY() - center_coordinate.getY()));
			this.setCanvasCenter(new_center);
		}
	};
	Transformation.prototype.setCanvasWidth = function(width){
		this.canvas_width = width;
	};
	Transformation.prototype.setCanvasHeight = function(height){
		this.canvas_height = height;
	};
	// which point of the image should be displayed in the middle of the canvas?
	// (relative image coordinate)
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
	// returns whether the coordinate is on the Canvas
	Transformation.prototype.inCanvasRange = function(coordinate){
		return coordinate.x >= 0 && coordinate.x <= this.getCanvasWidth() && coordinate.y >= 0 && coordinate.y <= this.getCanvasHeight();
	};
	// returns the relative image coordinate of the origin of the canvas (top
	// left)
	Transformation.prototype.getCanvasOrigin = function(){
		var canvas_center = this.getCanvasCenter();
		return new Coordinate(canvas_center.x-this.getCanvasWidth()/(this.getDisplayRatio()*this.getScale()), canvas_center.y+this.getCanvasHeight()/(this.getDisplayRatio()*this.getScale())); 
	};
	// converts a relative image coordinate to an absolute image coordinate
	Transformation.prototype.transformRelativeImageCoordinateToAbsoluteImageCoordinate = function(coordinate){
		//return new Coordinate((coordinate.x+this.getHorizontalRatio())*this.getImageRatio()/2.0, (-coordinate.y+this.getVerticalRatio())*this.getImageRatio()/2.0);
		return new Coordinate((3.0*coordinate.getX()+4.0)*this.getImageWidth()/8.0-.5, .5*(this.getImageHeight()*(1.0-coordinate.getY())-1.0));
	};
	// returns the display ratio (factor needed to convert relative image
	// coordinate to canvas coordinate)
	Transformation.prototype.getDisplayRatio = function(){
		var m = Math.min(this.getImageWidth(), this.getImageHeight());
		return Math.min(m*this.getCanvasHeight()/this.getImageHeight(), m*this.getCanvasWidth()/this.getImageWidth());
	};
	// returns the minimum of the image width and image height
	Transformation.prototype.getImageRatio = function(){
		return Math.min(this.getImageWidth(), this.getImageHeight());
	};
	// converts an absolute image coordinate to a relative image coordinate
	Transformation.prototype.transformAbsoluteImageCoordinateToRelativeImageCoordinate = function(coordinate){
		return new Coordinate(1.0/3.0*(-4.0+(coordinate.getX()/*+.5*/)*8.0/this.getImageWidth()),
				(this.getImageHeight()-(coordinate.getY()/*+.5*/)*2.0)/this.getImageHeight());
	};
	// converts an absolute image coordinate to canvas coordinate
	Transformation.prototype.transformAbsoluteImageCoordinateToCanvasCoordinate = function(coordinate){
		//return this.transformRelativeImageCoordinateToCanvasCoordinate(this.transformAbsoluteImageCoordinateToRelativeImageCoordinate(coordinate.add(new Coordinate(-0.5, -0.5))));
		return this.transformRelativeImageCoordinateToCanvasCoordinate(this.transformAbsoluteImageCoordinateToRelativeImageCoordinate(coordinate));
	};
	// converts a canvas coordinate to an absolute image coordinate
	Transformation.prototype.transformCanvasCoordinateToAbsoluteImageCoordinate = function(coordinate){
		return this.transformRelativeImageCoordinateToAbsoluteImageCoordinate(this.transformCanvasCoordinateToRelativeImageCoordinate(coordinate));
	};
	// converts a relative image coordinate to a canvas coordinate
	Transformation.prototype.transformRelativeImageCoordinateToCanvasCoordinate = function(coordinate){
		var canvas_center = this.getCanvasCenter();
		return new Coordinate((coordinate.getX()-canvas_center.getX())*this.getScalingFactor()+this.getCanvasWidth()/2.0, 
				(-coordinate.getY()+canvas_center.getY())*this.getScalingFactor() + this.getCanvasHeight()/2.0);
	};
	// returns the width of the image over the minimum of the image width/height
	Transformation.prototype.getHorizontalRatio = function(){
		return this.getImageWidth()/this.getImageRatio();
	};
	// returns the height of the image over the minimum of the image
	// width/height
	Transformation.prototype.getVerticalRatio = function(){
		return this.getImageHeight()/this.getImageRatio();
	};
	Transformation.prototype.getScalingFactor = function(){
		return this.getScale() * this.getScalingRatioFactor();
	};
	Transformation.prototype.getScalingRatioFactor = function(){
		return Math.min(3.0/8.0*this.getCanvasWidth(), 1.0/2.0*this.getCanvasHeight());
	};
	// converts a canvas coordinate to a relative image coordinate
	Transformation.prototype.transformCanvasCoordinateToRelativeImageCoordinate = function(coordinate){
		var canvas_center = this.getCanvasCenter();
		return new Coordinate((coordinate.getX()-this.getCanvasWidth()/2.0)/this.getScalingFactor()+canvas_center.getX(), 
				-(coordinate.getY()-this.getCanvasHeight()/2.0)/this.getScalingFactor()+canvas_center.getY());
	};
	Transformation.prototype.transformCanvasTranslationToRelativeImageTranslation = function(coordinate){
		return new Coordinate(coordinate.getX()/this.getScalingFactor(), -coordinate.getY()/this.getScalingFactor());
	};
	Transformation.prototype.reset = function(){
		this.setScale(1);
		this.setCanvasCenter(new Coordinate(0,0));
	};
	Transformation.prototype.updateToContainRectangle = function(rectangle){
		if(rectangle.getLeft() == null || rectangle.getRight() == null || rectangle.getTop() == null || rectangle.getBottom() == null){
			return;
		}
		if(rectangle.getLeft() > rectangle.getRight() || rectangle.getTop() > rectangle.getBottom()){
			return;
		}
		this.setCanvasCenter(new Coordinate((rectangle.getLeft()+rectangle.getRight())/2.0, (rectangle.getTop()+rectangle.getBottom())/2.0));
		var horizontal = null;
		if(rectangle.getLeft() == rectangle.getRight()){
			horizontal = Number.MAX_VALUE;
		}else{
			horizontal = this.getCanvasWidth()/(rectangle.getRight()-rectangle.getLeft());
		}
		var vertical = null;
		if(rectangle.getTop() == rectangle.getBottom()){
			vertical = Number.MAX_VALUE;
		}else{
			vertical = this.getCanvasHeight()/(rectangle.getBottom()-rectangle.getTop());
		}
		if(vertical == horizontal && horizontal == Number.MAX_VALUE){
			return;
		}
		this.setScale(Math.min(horizontal, vertical)/this.getScalingRatioFactor());
	};
	return Transformation;
});
