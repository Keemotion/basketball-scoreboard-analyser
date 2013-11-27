define([], function(){
	var LabelChangedEvent = function(id){
		this.id = id;
	};
	LabelChangedEvent.prototype.getLabelId = function(){
		return this.id;
	};
	return LabelChangedEvent;
});
