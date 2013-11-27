define([], function(){
	var BaseDisplay = new Object();
	BaseDisplay.applyMethods = function(type){
		type.init = function(){
			this.sub_components = new Array();
		};
		type.getSubComponents = function(){
			return this.sub_components;
		};
		type.getParent = function(){
			return this.parent;
		};
		type.setParent = function(parent){
			this.parent = parent;
		};
		type.draw = function(context, transformation){
			for(var i = 0; i < this.sub_components.length; ++i){
				this.sub_components[i].draw(context, transformation);
			}
			this.drawMyself(context, transformation);
		};
		type.drawMyself = function(context, transformation){
			console.log("TODO: implement drawMyself");
		};
		type.getProxy = function(){
			return this.proxy;
		};
		type.setProxy = function(proxy){
			this.proxy = proxy;
		};
	};
	return BaseDisplay;
});
