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
//			console.log("TODO: implement drawMyself");
	};
	BaseDisplay.prototype.getProxy = function(){
		return this.proxy;
	};
	BaseDisplay.prototype.setProxy = function(proxy){
		this.proxy = proxy;
	};
	return BaseDisplay;
});
