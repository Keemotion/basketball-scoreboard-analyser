define([], function(){
	var MoveModeObjectsMovedEvent = function(targets, translation){
		this.targets = targets;
		this.translation = translation;
	};
	MoveModeObjectsMovedEvent.prototype.getTranslation = function(){
		return this.translation;
	};
	MoveModeObjectsMovedEvent.prototype.getTargets = function(){
		return this.targets;
	};
	return MoveModeObjectsMovedEvent;
});