define(['./base_display', './corner_display'], function(BaseDisplay, CornerDisplay){
	var DigitDisplay = function(parent_component, proxy, messaging_system){
		this.init();
		this.setParent(parent_component);
		this.messaging_system = messaging_system;
		this.setProxy(proxy);
		this.loadSubComponents();
	};
	BaseDisplay.applyMethods(DigitDisplay.prototype);
	DigitDisplay.prototype.drawMyself = function(context, transformation){
		//console.log("TODO: digitdisplay has overridden this drawMyself method, but still needs some proper implementation");
	};
	DigitDisplay.prototype.loadSubComponents = function(){
		var sub_proxies = this.getProxy().getSubNodes();
		this.sub_components.length = 0;
		for(var i = 0; i < sub_proxies.length; ++i){
			this.sub_components.push(new CornerDisplay(this, sub_proxies[i], this.messaging_system));
		}
	};
	return DigitDisplay;
});
