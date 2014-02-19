define(["./base_display", 
	"./digit_display",
	"./dot_display"], function(BaseDisplay, DigitDisplay, DotDisplay){
	var LabelDisplay = function(parent_component, proxy, messaging_system){
		this.init();
		this.setParent(parent_component);
		this.messaging_system = messaging_system;
		this.setProxy(proxy);
		this.loadSubComponents();
	};
	BaseDisplay.applyMethods(LabelDisplay.prototype);
	LabelDisplay.prototype.drawMyself = function(context, transformation){
		//console.log("TODO: labeldisplay has overridden this drawMyself method, but still needs some proper implementation");
	};
	LabelDisplay.prototype.loadSubComponents = function(){
		var sub_proxies = this.getProxy().getSubNodes();
		this.sub_components.length = 0;
		for(var i = 0; i < sub_proxies.length; ++i){
			if(sub_proxies[i].getType() == "digit"){
				this.sub_components.push(new DigitDisplay(this, sub_proxies[i], this.messaging_system));
			}else if(sub_proxies[i].getType() == "dot"){
				this.sub_components.push(new DotDisplay(this, sub_proxies[i], this.messaging_system));
			}
		}
	};
	return LabelDisplay;
});
