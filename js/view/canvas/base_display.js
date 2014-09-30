define([
	"../../model/selection_tree",
	"../../model/selection_node"
	], function(
		SelectionTree,
		SelectionNode
	){
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
		//console.log("drawing: "+JSON.stringify(this.getProxy().getIdentification()));
		for(var i = 0; i < this.sub_components.length; ++i){
			this.sub_components[i].draw(context, transformation);
		}
		if(this.getProxy().getDisplaying()){
			/*if(this.getSelected()){
				this.drawMyselfSelected(context, transformation);
			}else{
				this.drawMyself(context, transformation);
			}*/
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
	BaseDisplay.prototype.drawSelected = function(selection_node, context, transformation){
		//if(selection_node.getSelected()){
			this.drawMyselfSelected(context, transformation);
		//}
		//var children = selection_node.getChildren();
		
		//for(var i = 0; i < children.length; ++i){
		//	this.sub_components[children[i].getId()].drawSelected(children[i], context, transformation);
		for(var i = 0; i < this.sub_components.length; ++i){
			this.sub_components[i].drawSelected(null, context, transformation);
		}
	};
	BaseDisplay.prototype.getProxy = function(){
		return this.proxy;
	};
	BaseDisplay.prototype.setProxy = function(proxy){
		this.proxy = proxy;
	};
	/*//determines whether this display object is at (around) the given canvas coordinate
	//should be overridden
	BaseDisplay.prototype.isAtCanvasCoordinate = function(coordinate, transformation, current){
		return false;
	};
	//determines whether this display object or one of its children are at the given canvas coordinate
	//@param coordinate: canvas coordinate
	BaseDisplay.prototype.getObjectAtCanvasCoordinate = function(coordinate, transformation, current){
		if(this.isAtCanvasCoordinate(coordinate, transformation, current))
			return this;
		var res = null;
		for(var i = 0; i < this.sub_components.length; ++i){
			var tmp = this.sub_components[i].getObjectAtCanvasCoordinate(coordinate, transformation, current);
			if(tmp != null){
				res = tmp;
			}
		}
		return res;
	};*/
	BaseDisplay.prototype.canBeSelected = function(){
		return false;
	};
	/*BaseDisplay.prototype.childrenCanBeSelected = function(){
		return true;
	};*/
	/*BaseDisplay.prototype.isInRectangle = function(transformation, start_coordinate, end_coordinate){
		return false;
	};*/
	/*BaseDisplay.prototype.getObjectsInRectangle = function(transformation, start_coordinate, end_coordinate){
		var res = new Array();
		if(this.canBeSelected()){
			if(this.isInRectangle(transformation, start_coordinate, end_coordinate)){
				res.push(this);
			}
		}
		if(this.childrenCanBeSelected()){
			for(var i = 0; i < this.sub_components.length; ++i){
				var tmp = this.sub_components[i].getObjectsInRectangle(transformation, start_coordinate, end_coordinate);
				for(var j = 0; j < tmp.length; ++j){
					res.push(tmp[j]);
				}
			}
		}
		return res;
	};*/
	/*BaseDisplay.prototype.getSelected = function(){
		if(this.selected)
			return true;
		if(this.getParent()){
			return this.getParent().getSelected();
		}
		return false;
	};
	BaseDisplay.prototype.setSelected = function(selected){
		this.selected = selected;
	};*/
	BaseDisplay.prototype.getObjectAroundCoordinate = function(coordinate){
		for(var i = 0; i < this.sub_components.length; ++i){
			var res = this.sub_components[i].getObjectAroundCoordinate(coordinate);
			if(res)
				return res;
		}
	};
	BaseDisplay.prototype.isInRectangle = function(rectangle){
		return false;
	};
	BaseDisplay.prototype.getSelectionTree = function(rectangle){
		var selection_tree = new SelectionTree();
		selection_tree.getRoot().setProxy(this.getProxy());
		if(this.canBeSelected()){
			if(this.isInRectangle(rectangle)){
				selection_tree.getRoot().setSelected(true);
			}
		}
		for(var i = 0; i < this.sub_components.length; ++i){
			var tmp_tree = this.sub_components[i].getSelectionTree(rectangle);
			if(tmp_tree.getRoot().getSelected() || tmp_tree.getRoot().getChildren().length > 0){
				selection_tree.getRoot().addChild(tmp_tree.getRoot());
				//TODO: check this!
				//tmp_tree.getRoot() should be a child of selection_tree.getRoot()
				//console.log("selection_tree = "+JSON.stringify(selection_tree));
			}
		}
		return selection_tree;
	};
	BaseDisplay.prototype.findChild = function(identification){
		if(identification.length == 0)
			return this;
		console.log("findChild with identification = "+JSON.stringify(identification));
		console.log("finChild with own identification = "+JSON.stringify(this.getProxy().getIdentification()));
		for(var i = 0; i < this.sub_components.length; ++i){
			console.log("try sub_component");
			
			if(this.sub_components[i].getProxy().getType() == identification[0]['type'] && this.sub_components[i].getProxy().getId() == identification[0]['id']){
				return this.sub_components[i].findChild(identification.slice(1));
			}
			console.log("type = "+this.sub_components[i].getProxy().getType());
			console.log("id = "+this.sub_components[i].getProxy().getId());
		}
		return null;
	};
	/*BaseDisplay.prototype.drawChanging = function(context,transformation){
		this.draw(context, transformation);
	};
	BaseDisplay.prototype.getSelectElements = function(){
		var a = Array();
		if(this.sub_components.length){
			for(var i = 0; i < this.sub_components.length; ++i){
				a.push(this.sub_components[i]);
			}
			return a;
		}
	};*/
	return BaseDisplay;
});
