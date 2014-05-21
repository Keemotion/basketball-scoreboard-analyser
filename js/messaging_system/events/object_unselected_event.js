define([], function(){
	var ObjectUnSelectedEvent = function(identification){
		this.identification = identification;
	};
	ObjectUnSelectedEvent.prototype.getTargetIdentification = function(){
		return this.identification;
	};
	return ObjectUnSelectedEvent;
});
