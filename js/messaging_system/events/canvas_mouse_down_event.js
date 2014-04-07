define([], function(){
	var CanvasMouseDownEvent = function(coordinate){
		this.coordinate = coordinate;
	};
	CanvasMouseDownEvent.prototype.getCoordinate = function(){
		return this.coordinate;
	};
	return CanvasMouseDownEvent;
});
