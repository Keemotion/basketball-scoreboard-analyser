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
	BaseDisplay.prototype.draw = function(context, transformation, selection_tree, application_state){
		for(var i = 0; i < this.sub_components.length; ++i){
			this.sub_components[i].draw(context, transformation, selection_tree);
		}
		if(this.getProxy().getDisplaying()){
			this.drawMyself(context, transformation, selection_tree, application_state);
		}
	};
	//draws the object itself (without children)
	//should be overridden
	BaseDisplay.prototype.drawMyself = function(context, transformation, selection_tree, application_state){
	};
	BaseDisplay.prototype.drawMyselfSelected = function(context, transformation, application_state, parent_already_selected){
		this.drawMyself(context, transformation);
	};
	BaseDisplay.prototype.drawSelected = function(selection_node, context, transformation, parent_already_selected, application_state, selected_specific_drawing, selection_tree, draw_extensions){
		if(parent_already_selected  || selection_node.getSelected()){
			if(selected_specific_drawing){
				this.drawMyselfSelected(context, transformation, application_state, parent_already_selected, draw_extensions);
			}else{
				this.drawMyself(context, transformation, selection_tree, application_state);
			}
			for(var i = 0; i < this.sub_components.length; ++i){
				this.sub_components[i].drawSelected(null, context, transformation, true, application_state, selected_specific_drawing, selection_tree, draw_extensions);
			}
		}else{
			var children = selection_node.getChildren();
			for(var i = 0; i < children.length; ++i){
				this.sub_components[children[i].getId()].drawSelected(children[i], context, transformation, false, application_state, selected_specific_drawing, selection_tree, draw_extensions);
			}
		}
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
	BaseDisplay.prototype.getObjectAroundCoordinate = function(canvas_coordinate, transformation, selected_object_identification, selection_tree, application_state){
		for(var i = 0; i < this.sub_components.length; ++i){
			var res = this.sub_components[i].getObjectAroundCoordinate(canvas_coordinate, transformation, selected_object_identification, selection_tree, application_state);
			if(res != null)
				return res;
		}
		return null;
	};
	BaseDisplay.prototype.isInRectangle = function(rectangle){
		return false;
	};
	BaseDisplay.prototype.getSelectionTree = function(rectangle, type){
		var selection_tree = new SelectionTree();
		selection_tree.getRoot().setProxy(this.getProxy());
		if(this.canBeSelected() && (type == null || type.indexOf(this.getProxy().getType()) != -1)){
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
