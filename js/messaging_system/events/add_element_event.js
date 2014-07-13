define([], function(){
	var AddElementEvent = function(type, identification, extra_data){
		this.type = type;
		this.target_identification = identification;
		this.extra_data = extra_data;
	};
	AddElementEvent.prototype.getType = function(){
		return this.type;
	};
	AddElementEvent.prototype.getTargetIdentification = function(){
		return this.target_identification;
	};
	AddElementEvent.prototype.getExtraData = function(){
		return this.extra_data;
	};
	return AddElementEvent;
});
