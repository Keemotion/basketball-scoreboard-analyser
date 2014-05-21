define([], function(){
	//BaseDisplay represents the common properties for all display objects
	var BaseDisplay = function(){
	};
	BaseDisplay.prototype.init = function(){
		this.sub_components = new Array();
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
			if(this.getSelected()){
				this.drawMyselfSelected(context, transformation);
			}else{
				this.drawMyself(context, transformation);
			}
		}
	};
	//draws the object itself (without children)
	//should be overridden
	BaseDisplay.prototype.drawMyself = function(context, transformation){
	};
	BaseDisplay.prototype.drawMyselfSelected = function(context, transformation){
		//this.drawMyself(context, transformation);
	};
	BaseDisplay.prototype.getProxy = function(){
		return this.proxy;
	};
	BaseDisplay.prototype.setProxy = function(proxy){
		this.proxy = proxy;
	};
	//determines whether this display object is at (around) the given canvas coordinate
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
	};
	BaseDisplay.prototype.canBeSelected = function(){
		return false;
	};
	BaseDisplay.prototype.childrenCanBeSelected = function(){
		return true;
	};
	BaseDisplay.prototype.isInRectangle = function(transformation, start_coordinate, end_coordinate){
		return false;
	};
	BaseDisplay.prototype.getObjectsInRectangle = function(transformation, start_coordinate, end_coordinate){
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
	};
	BaseDisplay.prototype.getSelected = function(){
		return this.selected;
	};
	BaseDisplay.prototype.setSelected = function(selected){
		this.selected = selected;
	};
	return BaseDisplay;
});
