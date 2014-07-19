define([], function(){
	var MouseModeChangedEvent = function(mode){
		this.mode = mode;
	};
	MouseModeChangedEvent.prototype.getMode = function(){
		return this.mode;
	};
	MouseModeChangedEvent.prototype.setMode = function(mode){
		this.mode = mode;
	};
	return MouseModeChangedEvent;
});