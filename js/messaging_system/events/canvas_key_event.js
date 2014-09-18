define([], function(){
	var CanvasKeyDownEvent = function(event_data){
		this.event_data = event_data;
	};
	CanvasKeyDownEvent.prototype.getEventData = function(){
		return this.event_data;
	};
	return CanvasKeyDownEvent;
});