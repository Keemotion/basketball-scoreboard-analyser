define([], function(){
	var LabelChangedEvent = function(target){
		this.target = target;
	};
	LabelChangedEvent.prototype.getTarget = function(){
		return this.target;
	};
	LabelChangedEvent.prototype.getLabelId = function(){
		for(var i = this.target.length-1; i >= 0; --i){
			if(this.target[i]['type']=='label'){
				return this.target[i]['id'];
			}
		}
		return null;
	};
	return LabelChangedEvent;
});
