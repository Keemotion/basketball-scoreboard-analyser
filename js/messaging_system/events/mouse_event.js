define([], function(){
	var MouseEvent = function(coordinate, event_data, transformation){
		this.coordinate = coordinate;
		this.transformation = transformation;
		this.event_data = event_data;
	};
	MouseEvent.prototype.getCoordinate = function(){
		return this.coordinate;
	};
	MouseEvent.prototype.getEventData = function(){
		return this.event_data;
	};
	MouseEvent.prototype.getRelativeImageCoordinate = function(){
		return this.transformation.transformCanvasCoordinateToRelativeImageCoordinate(this.coordinate);
	};
	return MouseEvent;
});
