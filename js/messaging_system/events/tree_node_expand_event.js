define([], function(){
	var TreeNodeExpandEvent = function(identification){
		this.identification = identification;
	};
	TreeNodeExpandEvent.prototype.getTargetIdentification = function(){
		return this.identification;
	};

	return TreeNodeExpandEvent;
});