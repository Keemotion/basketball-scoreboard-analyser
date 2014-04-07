define([], function(){
	var CanvasMouseUpEvent = function(coordinate, event_data){
		this.coordinate = coordinate;
		this.event_data = event_data;
	};
	CanvasMouseUpEvent.prototype.getCoordinate = function(){
		return this.coordinate;
	};
	CanvasMouseUpEvent.prototype.getEventData = function(){
		return this.event_data;
	};
	return CanvasMouseUpEvent;
});
