define([], function(){
	var RemoveGroupEvent = function(identification){
		this.target_identification = identification;
		this.handled = false;
	};
	RemoveGroupEvent.prototype.setHandled = function(h){
		this.handled = h;
	};
	RemoveGroupEvent.prototype.getHandled = function(){
		return this.handled;
	};
	RemoveGroupEvent.prototype.getTargetIdentification = function(){
		return this.target_identification;
	};
	return RemoveGroupEvent;
});
