define(['./base_display', './group_display', '../../messaging_system/event_listener'], function(BaseDisplay, GroupDisplay, EventListener){
	//represents the root node of all display objects
	var DisplayTree = function(proxy, messaging_system){
		this.init();
		this.setParent(null);
		this.messaging_system = messaging_system;
		this.setProxy(proxy);
		this.loadSubComponents();
		this.messaging_system.addEventListener(this.messaging_system.events.StateChanged, new EventListener(this, this.stateChanged));
	};
	DisplayTree.prototype = new BaseDisplay();
	DisplayTree.prototype.drawMyself = function(context, transformation){
	};
	DisplayTree.prototype.stateChanged = function(signal, data){
		this.loadSubComponents();
	};
	DisplayTree.prototype.loadSubComponents = function(){
		var sub_proxies = this.getProxy().getSubNodes();
		this.sub_components.length = 0;
		for(var i = 0; i < sub_proxies.length; ++i){
			if(sub_proxies[i].getType() == "configuration_key"){
				continue;
			}
			this.sub_components.push(new GroupDisplay(this, sub_proxies[i], this.messaging_system));
		}
	};
	return DisplayTree;
});
