define([], function(){
	var SubmitGroupDetailsEvent = function(target, data, partial_data){
		this.target = target;
		this.data = data;
		this.partial_data = partial_data;
	};
	SubmitGroupDetailsEvent.prototype.getTargetIdentification = function(){
		return this.target;
	};
	SubmitGroupDetailsEvent.prototype.getData = function(){
		return this.data;
	};
	SubmitGroupDetailsEvent.prototype.getPartial = function(){
		return this.partial_data == true;
	};
	return SubmitGroupDetailsEvent;
});
