define(["./base_display", "./digit_display"], function(BaseDisplay, DigitDisplay){
	var LabelDisplay = function(parent_component, proxy, messaging_system){
		this.init();
		this.setParent(parent_component);
		this.messaging_system = messaging_system;
		this.setProxy(proxy);
		this.loadSubComponents();
	};
	BaseDisplay.applyMethods(LabelDisplay.prototype);
	LabelDisplay.prototype.drawMyself = function(context, transformation){
		console.log("TODO: labeldisplay has overridden this drawMyself method, but still needs some proper implementation");
	};
	LabelDisplay.prototype.loadSubComponents = function(){
		var p = this.getProxy();
		console.log("p = "+p);
		var sub_proxies = this.getProxy().getSubNodes();

		this.sub_components.length = 0;
		for(var i = 0; i < sub_proxies.length; ++i){
			this.sub_components.push(new DigitDisplay(this, sub_proxies[i], this.messaging_system));
		}
	};
	return LabelDisplay;
});
