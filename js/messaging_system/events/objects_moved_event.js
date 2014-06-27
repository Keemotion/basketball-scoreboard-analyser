define([], function(){
	var ObjectsMovedEvent = function(targets, translation){
		this.targets = targets;
		this.translation = translation;
	};
	ObjectsMovedEvent.prototype.getTargetIdentifications = function(){
		return this.targets;
	};
	ObjectsMovedEvent.prototype.getTranslation = function(){
		return this.translation;
	};
	return ObjectsMovedEvent;
});
