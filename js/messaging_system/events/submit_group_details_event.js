define([], function(){
	var SubmitGroupDetailsEvent = function(target, data){
		this.target = target;
		this.data = data;
	};
	SubmitGroupDetailsEvent.prototype.getTarget = function(){
		return this.target;
	};
	SubmitGroupDetailsEvent.prototype.getData = function(){
		return this.data;
	};
	return SubmitGroupDetailsEvent;
});
