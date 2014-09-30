define([], function(){
	var DotAddedEvent = function(identification, coordinate){
		this.identification = identification;
		this.coordinate = coordinate;
	};
	DotAddedEvent.prototype.getTargetIdentification = function(){
		return this.identification;
	};
	DotAddedEvent.prototype.getCoordinate = function(){
		return this.coordinate;
	};
	return DotAddedEvent;
});