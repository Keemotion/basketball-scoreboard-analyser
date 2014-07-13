define([], function(){
	var ObjectsMovedEvent = function(targets_tree, translation){
		this.targets_tree = targets_tree;
		this.translation = translation;
	};
	ObjectsMovedEvent.prototype.getTree = function(){
		return this.targets_tree;
	};
	ObjectsMovedEvent.prototype.getTranslation = function(){
		return this.translation;
	};
	return ObjectsMovedEvent;
});
