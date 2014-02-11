define([], function(){
	var ToggleDisplayObjectEvent = function(target, displaying){
		this.target = target;
		this.displaying = displaying;
	};
	return ToggleDisplayObjectEvent;
});
