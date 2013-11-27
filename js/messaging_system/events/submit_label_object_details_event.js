define([], function(){
	var SubmitLabelObjectDetailsEvent = function(target, data){
		this.target = target;
		this.data = data;
	};
	SubmitLabelObjectDetailsEvent.prototype.getTarget = function(){
		return this.target;
	};
	SubmitLabelObjectDetailsEvent.prototype.getData = function(){
		return this.data;
	};
	return SubmitLabelObjectDetailsEvent;
});
