define([], function(){
	var ObjectSelectedEvent = function(identification){
		this.identification = identification;
	};
	ObjectSelectedEvent.prototype.getTargetIdentification = function(){
		return this.identification;
	};
	return ObjectSelectedEvent;
});
