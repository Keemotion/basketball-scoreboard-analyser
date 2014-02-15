define([], function(){
	var ToggleDisplayObjectEvent = function(target_identification, displaying){
		this.target_identification = target_identification;
		this.displaying = displaying;
	};
	return ToggleDisplayObjectEvent;
});
