define([], function(){
	var CanvasMouseMoveEvent = function(coordinate){
		this.coordinate = coordinate;
	};
	CanvasMouseMoveEvent.prototype.getCoordinate = function(){
		return this.coordinate;
	};
	return CanvasMouseMoveEvent;
});
