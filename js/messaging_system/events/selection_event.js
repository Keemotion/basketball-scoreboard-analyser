define([],function(){
	var SelectionEvent = function(selection_tree, temporary){
		this.selection_tree = selection_tree;
		this.temporary = temporary;
	};
	SelectionEvent.prototype.getTree = function(){
		return this.selection_tree;
	};
	SelectionEvent.prototype.getTemporary = function(){
		return this.temporary;
	};
	return SelectionEvent;
});