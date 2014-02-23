define(['./base_display', './label_display'], function(BaseDisplay, LabelDisplay){
	var DisplayTree = function(proxy, messaging_system){
		this.init();
		this.setParent(null);
		this.messaging_system = messaging_system;
		this.setProxy(proxy);
		this.loadSubComponents();
	};
	//BaseDisplay.applyMethods(DisplayTree.prototype);
	DisplayTree.prototype = new BaseDisplay();
	DisplayTree.prototype.drawMyself = function(context, transformation){
		//console.log("drawing tree, nothing particular to be drawn in this drawMyself");
	};
	DisplayTree.prototype.loadSubComponents = function(){
		var sub_proxies = this.getProxy().getSubNodes();
		this.sub_components.length = 0;
		for(var i = 0; i < sub_proxies.length; ++i){
			this.sub_components.push(new LabelDisplay(this, sub_proxies[i], this.messaging_system));
		}
	};
	return DisplayTree;
});
