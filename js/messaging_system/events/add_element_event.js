define([], function(){
	var AddElementEvent = function(type, identification){
		this.type = type;
		this.target_identification = identification;
	};
	AddElementEvent.prototype.getType = function(){
		return this.type;
	};
	AddElementEvent.prototype.getTargetIdentification = function(){
		return this.target_identification;
	};
	return AddElementEvent;
});
