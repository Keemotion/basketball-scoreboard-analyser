define([], function(){
	var AddElementEvent = function(type, identification, extra_data, auto_select){
		this.type = type;
		this.target_identification = identification;
		this.extra_data = extra_data;
		this.auto_select = auto_select;
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
	AddElementEvent.prototype.getAutoSelect = function(){
		return this.auto_select === true;
	};
	return AddElementEvent;
});
