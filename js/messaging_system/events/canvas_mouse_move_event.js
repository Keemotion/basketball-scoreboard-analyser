define([], function(){
	var CanvasMouseMoveEvent = function(coordinate, event_data){
		this.coordinate = coordinate;
		this.event_data = event_data;
	};
	CanvasMouseMoveEvent.prototype.getCoordinate = function(){
		return this.coordinate;
	};
	CanvasMouseMoveEvent.prototype.getEventData = function(){
		return this.event_data;
	};
	return CanvasMouseMoveEvent;
});
