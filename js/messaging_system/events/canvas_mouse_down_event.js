define([], function(){
	var CanvasMouseDownEvent = function(coordinate, event_data){
		this.coordinate = coordinate;
		this.event_data = event_data;
	};
	CanvasMouseDownEvent.prototype.getCoordinate = function(){
		return this.coordinate;
	};
	CanvasMouseDownEvent.prototype.getEventData = function(){
		return this.event_data;
	};
	return CanvasMouseDownEvent;
});
