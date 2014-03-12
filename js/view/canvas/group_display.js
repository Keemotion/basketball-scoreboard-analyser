define(['./base_display', './label_display'], function(BaseDisplay, LabelDisplay){
	var GroupDisplay = function(parent, proxy, messaging_system){
		this.init();
		this.setParent(parent);
		this.messaging_system = messaging_system;
		this.setProxy(proxy);
		this.loadSubComponents();
	};
	GroupDisplay.prototype = new BaseDisplay();
	GroupDisplay.prototype.drawMyself = function(context, transformation){
	};
	GroupDisplay.prototype.loadSubComponents = function(){
		var sub_proxies = this.getProxy().getSubNodes();
		this.sub_components.length = 0;
		for(var i = 0; i < sub_proxies.length; ++i){
			if(sub_proxies.getType() == "group"){
				this.sub_components.push(new GroupDisplay(this, sub_proxies[i], this.messaging_system));
			}else{
				this.sub_components.push(new LabelDisplay(this, sub_proxies[i], this.messaging_system));
			}
		}
	};
	return DisplayTree;
});
