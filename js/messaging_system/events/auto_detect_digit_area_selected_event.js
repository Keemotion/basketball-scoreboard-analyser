define([], function(){
	var AutoDetectDigitAreaSelectedEvent = function(image, top_left_coordinate, canvas_transformation){
		this.image = image;
		this.top_left_coordinate = top_left_coordinate;
		this.canvas_transformation = canvas_transformation;
	};
	AutoDetectDigitAreaSelectedEvent.prototype.getImage = function(){
		return this.image;
	};
	AutoDetectDigitAreaSelectedEvent.prototype.getTransformation = function(){
		return this.canvas_transformation;
	};
	AutoDetectDigitAreaSelectedEvent.prototype.getTopLeft = function(){
		return this.top_left_coordinate;
	};
	return AutoDetectDigitAreaSelectedEvent;
});