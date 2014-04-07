define([], function(){
	var CanvasMouseUpEvent = function(coordinate){
		this.coordinate = coordinate;
	};
	CanvasMouseUpEvent.prototype.getCoordinate = function(){
		return this.coordinate;
	};
	return CanvasMouseUpEvent;
});
