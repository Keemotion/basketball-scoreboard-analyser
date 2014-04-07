define([], function(){
	var CanvasImageClickEvent = function(coordinate, event_data){
		this.coordinate = coordinate;
		this.event_data = event_data;
	};
	CanvasImageClickEvent.prototype.getCoordinate = function(){
		return this.coordinate;
	};
	CanvasImageClickEvent.prototype.getEventData = function(){
		return this.event_data;
	};
	return CanvasImageClickEvent;
});
