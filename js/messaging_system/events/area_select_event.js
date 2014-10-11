define([], function(){
	var AreaSelectEvent = function(start_coordinate, end_coordinate){
		this.start_coordinate = start_coordinate;
		this.end_coordinate = end_coordinate;
	};
	AreaSelectEvent.prototype.getStartCoordinate = function(){
		return this.start_coordinate;
	};
	AreaSelectEvent.prototype.getEndCoordinate = function(){
		return this.end_coordinate;
	};
	return AreaSelectEvent;
});