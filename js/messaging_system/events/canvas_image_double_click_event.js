define([], function(){
	var CanvasImageDoubleClickEvent = function(coordinate, event_data){
		this.coordinate = coordinate;
		this.event_data = event_data;
	};
	CanvasImageDoubleClickEvent.prototype.getCoordinate = function(){
		return this.coordinate;
	};
	CanvasImageDoubleClickEvent.prototype.getEventData = function(){
		return this.event_data;
	};
	return CanvasImageDoubleClickEvent;
});
