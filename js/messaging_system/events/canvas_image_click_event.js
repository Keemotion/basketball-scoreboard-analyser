define([], function(){
	var CanvasImageClickEvent = function(coordinate){
		this.coordinate = coordinate;
	};
	CanvasImageClickEvent.prototype.getCoordinate = function(){
		return this.coordinate;
	};
	return CanvasImageClickEvent;
});
