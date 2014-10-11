define([], function(){
	var GroupChangedEvent = function(identification, structural){
		this.target_identification = identification;
		if(structural === false){
			this.structural = false;
		}else{
			this.structural = true;
		}
	};
	GroupChangedEvent.prototype.getTargetIdentification = function(){
		return this.target_identification;
	};
	GroupChangedEvent.prototype.isStructuralChange = function(){
		return this.structural;
	};
	/*GroupChangedEvent.prototype.getGroupId = function(){
	 for(var i = this.target.length-1; i >= 0; --i){
	 if(this.target[i]['type']=='group'){
	 return this.target[i]['id'];
	 }
	 }
	 return null;
	 };*/
	return GroupChangedEvent;
});
