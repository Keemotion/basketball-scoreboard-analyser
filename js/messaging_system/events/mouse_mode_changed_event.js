define([], function(){
	var MouseModeChangedEvent = function(mode){
		this.mode = mode;
	};
	MouseModeChangedEvent.prototype.getMode = function(){
		return this.mode;
	};
	return MouseModeChangedEvent;
});