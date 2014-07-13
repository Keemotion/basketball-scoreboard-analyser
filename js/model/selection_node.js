define([], function(){
	var SelectionNode = function(id, type, selected){
		this.children = [];
		this.selected = selected;
		this.id = id;
		this.type = type;
	};
	SelectionNode.prototype.clone = function(){
		var node = new SelectionNode(this.getId(), this.getType(), this.getSelected());
		var children = this.getChildren();
		for(var i = 0; i < children.length; ++i){
			node.addChild(children[i].clone());
		}
		return node;
	};
	SelectionNode.prototype.cleanUp = function(){
		var children = this.getChildren();
		for(var i = 0; i < children.length; ++i){
			children[i].cleanUp();
			if(!children[i].getSelected() && children[i].getChildren().length == 0){
				children.splice(i, 1);
				--i;
			}
		}
	};
	SelectionNode.prototype.getSelected = function(){
		return this.selected;
	};
	SelectionNode.prototype.setSelected = function(selected){
		this.selected = selected;
	};
	SelectionNode.prototype.getChildren = function(){
		return this.children;
	};
	SelectionNode.prototype.addChild = function(child){
		this.children.push(child);
	};
	SelectionNode.prototype.equals = function(node){
		return (node.getType() == this.getType()) && (node.getId() == this.getId());
	};
	SelectionNode.prototype.getType = function(){
		return this.type;
	};
	SelectionNode.prototype.getId = function(){
		return this.id;
	};
	SelectionNode.prototype.setType = function(type){
		this.type = type;
	};
	SelectionNode.prototype.setId = function(id){
		this.id = id;
	};
	SelectionNode.prototype.addSelection = function(node){
		if(node.getSelected()){
			this.setSelected(true);
		}
		var other_children = node.getChildren();
		for(var i = 0; i < other_children.length; ++i){
			var own_children = this.getChildren();
			var found = false;
			var child = null;
			for(var j = 0; j < own_children.length; ++j){
				if(own_children[j].equals(other_children[i])){
					found = true;
					own_children.addSelection(other_children[i]);
					break;
				}
			}
			if(!found){
				this.addChild(other_children[i]);
			}
		}
	};
	SelectionNode.prototype.removeSelection = function(node){
		if(node.getSelected()){
			this.setSelected(false);
		}
		var other_children = node.getChildren();
		for(var i = 0; i < other_children.length; ++i){
			var own_children = this.getChildren();
			for(var j = 0; j < own_children.length; ++j){
				if(own_children[j].equals(other_children[i])){
					own_children[j].removeSelection(other_children[i]);
					if(own_children[j].getChildren().length == 0 && !own_children[j].getSelected()){
						own_children.splice(j, 1);
						break;
					}
				}
			}
		}
	};
	SelectionNode.prototype.toggleSelection = function(node){
		if(node.getSelected()){
			this.setSelected(!node.getSelected());
		}
		var other_children = node.getChildren();
		for(var i = 0; i < other_children.length; ++i){
			var own_children = this.getChildren();
			var found = false;
			for(var j = 0; j < own_children.length; ++j){
				if(own_children[j].equals(other_children[i])){
					found = true;
					own_children[j].toggleSelection(other_children[i]);
					if(own_children[j].getChildren().length == 0 && !own_children[j].getSelected()){
						own_children.splice(j, 1);
						break;
					}
				}
			}
			if(!found){
				this.addChild(other_children[i]);
			}
		}
	};
	return SelectionNode;
});
