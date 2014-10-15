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
	return GroupChangedEvent;
});
