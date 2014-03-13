define([], function(){
	var GroupChangedEvent = function(target){
		this.target = target;
	};
	GroupChangedEvent.prototype.getTarget = function(){
		return this.target;
	};
	GroupChangedEvent.prototype.getGroupId = function(){
		for(var i = this.target.length-1; i >= 0; --i){
			if(this.target[i]['type']=='group'){
				return this.target[i]['id'];
			}
		}
		return null;
	};
	return GroupChangedEvent;
});
