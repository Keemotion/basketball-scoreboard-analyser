define([], function(){
	var CanvasScrolledEvent = function(c, e){
		this.event_data = e;
		this.coordinate = c;
	};
	CanvasScrolledEvent.prototype.getCoordinate = function(){
		return this.coordinate;
	};
	return CanvasScrolledEvent;
});
