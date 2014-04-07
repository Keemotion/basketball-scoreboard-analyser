define([], function(){
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
	BaseDisplay.prototype.drawMyself = function(context, transformation){
	};
	BaseDisplay.prototype.getProxy = function(){
		return this.proxy;
	};
	BaseDisplay.prototype.setProxy = function(proxy){
		this.proxy = proxy;
	};
	BaseDisplay.prototype.isAtCanvasCoordinate = function(coordinate, transformation){
		return false;
	};
	//@param coordinate: canvas coordinate
	BaseDisplay.prototype.getObjectAtCanvasCoordinate = function(coordinate, transformation){
		if(this.isAtCanvasCoordinate(coordinate, transformation))
			return this;
		for(var i = 0; i < this.sub_components.length; ++i){
			var res = this.sub_components[i].getObjectAtCanvasCoordinate(coordinate, transformation);
			if(res == null)
				continue;
			return res;
		}
		return null;
	};
	return BaseDisplay;
});
