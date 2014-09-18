define([], function(){
	var DigitAddedEvent = function(target_identification, corners){
		this.target_identification = target_identification;
		this.corners = corners;
	};
	DigitAddedEvent.prototype.getTargetIdentification = function(){
		return this.target_identification;
	};
	DigitAddedEvent.prototype.getCorners = function(){
		return this.corners;
	};
	return DigitAddedEvent;
});