define(["./selection_node"], function(SelectionNode){
	var SelectionTree = function(){
		this.root = new SelectionNode();
	};
	SelectionTree.prototype.clone = function(){
		var tree = new SelectionTree();
		tree.root = this.getRoot().clone();
		return tree;
	};
	SelectionTree.prototype.addSelection = function(tree){
		this.root.addSelection(tree.getRoot());
	};
	SelectionTree.prototype.removeSelection = function(tree){
		this.root.removeSelection(tree.getRoot());
	};
	SelectionTree.prototype.toggleSelection = function(tree){
		this.root.toggleSelection(tree.getRoot());
	};
	SelectionTree.prototype.getRoot = function(){
		return this.root;
	};
	SelectionTree.prototype.cleanUp = function(){
		this.getRoot().cleanUp();
	};
	return SelectionTree;
});
