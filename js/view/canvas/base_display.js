define([], function(){
	//BaseDisplay represents the common properties for all display objects
	var BaseDisplay = function(){
	};
	BaseDisplay.prototype.init = function(){
		this.sub_components = new Array();
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
	return BaseDisplay;
});
