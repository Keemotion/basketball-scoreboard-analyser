define([
	"../../model/selection_tree",
	"../../model/selection_node"
], function(SelectionTree, SelectionNode){
	//BaseDisplay represents the common properties for all display objects
	var BaseDisplay = function(){
	};
	BaseDisplay.prototype.init = function(){
		this.sub_components = new Array();
		this.selected = false;
	};
	BaseDisplay.prototype.getIdentification = function(){
		return this.getProxy().getIdentification();
	};
	BaseDisplay.prototype.getSubComponents = function(){
		return this.sub_components;
	};
	BaseDisplay.prototype.getParent = function(){
		return this.parent;
	};
	BaseDisplay.prototype.setParent = function(parent){
		this.parent = parent;
	};
	BaseDisplay.prototype.draw = function(context, transformation){
		for(var i = 0; i < this.sub_components.length; ++i){
			this.sub_components[i].draw(context, transformation);
		}
		if(this.getProxy().getDisplaying()){
			this.drawMyself(context, transformation);
		}
	};
	//draws the object itself (without children)
	//should be overridden
	BaseDisplay.prototype.drawMyself = function(context, transformation){
	};
	BaseDisplay.prototype.drawMyselfSelected = function(context, transformation){
		this.drawMyself(context, transformation);
	};
	BaseDisplay.prototype.drawSelected = function(selection_node, context, transformation, parent_already_selected){
		//if(selection_node.isSelected(this.getIdentification())){
		if(parent_already_selected  || selection_node.getSelected()){
			//console.log("drawing selected: "+JSON.stringify(this.getIdentification()));
			this.drawMyselfSelected(context, transformation);
			for(var i = 0; i < this.sub_components.length; ++i){
				this.sub_components[i].drawSelected(null, context, transformation, true);
			}
		}else{
			var children = selection_node.getChildren();
			for(var i = 0; i < children.length; ++i){
				this.sub_components[children[i].getId()].drawSelected(children[i], context, transformation, false);
			}
		}
		/**/
	};
	BaseDisplay.prototype.getProxy = function(){
		return this.proxy;
	};
	BaseDisplay.prototype.setProxy = function(proxy){
		this.proxy = proxy;
	};
	BaseDisplay.prototype.canBeSelected = function(){
		return false;
	};
	BaseDisplay.prototype.getObjectAroundCoordinate = function(canvas_coordinate, transformation, selected_object_identification){
		for(var i = 0; i < this.sub_components.length; ++i){
			var res = this.sub_components[i].getObjectAroundCoordinate(canvas_coordinate, transformation, selected_object_identification);
			if(res)
				return res;
		}
	};
	BaseDisplay.prototype.isInRectangle = function(rectangle){
		return false;
	};
	BaseDisplay.prototype.getSelectionTree = function(rectangle, type){
		var selection_tree = new SelectionTree();
		selection_tree.getRoot().setProxy(this.getProxy());
		if(this.canBeSelected() && (type == null || type == this.getProxy().getType())){
			if(this.isInRectangle(rectangle)){
				selection_tree.getRoot().setSelected(true);
			}
		}
		for(var i = 0; i < this.sub_components.length; ++i){
			var tmp_tree = this.sub_components[i].getSelectionTree(rectangle, type);
			if(tmp_tree.getRoot().getSelected() || tmp_tree.getRoot().getChildren().length > 0){
				selection_tree.getRoot().addChild(tmp_tree.getRoot());
			}
		}
		return selection_tree;
	};
	BaseDisplay.prototype.findChild = function(identification){
		if(identification.length == 0)
			return this;
		for(var i = 0; i < this.sub_components.length; ++i){
			if(this.sub_components[i].getProxy().getType() == identification[0]['type'] && this.sub_components[i].getProxy().getId() == identification[0]['id']){
				return this.sub_components[i].findChild(identification.slice(1));
			}
		}
		return null;
	};
	return BaseDisplay;
});
