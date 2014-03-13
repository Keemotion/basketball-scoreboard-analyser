define(["./base_display", 
	"./digit_display",
	"./dot_display"], function(BaseDisplay, DigitDisplay, DotDisplay){
	var GroupDisplay = function(parent_component, proxy, messaging_system){
		this.init();
		this.setParent(parent_component);
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
			if(sub_proxies[i].getType() == "digit"){
				this.sub_components.push(new DigitDisplay(this, sub_proxies[i], this.messaging_system));
			}else if(sub_proxies[i].getType() == "dot"){
				this.sub_components.push(new DotDisplay(this, sub_proxies[i], this.messaging_system));
			}else if(sub_proxies[i].getType() == "group"){
				this.sub_components.push(new GroupDisplay(this, sub_proxies[i], this.messaging_system));
			}
		}
	};
	return GroupDisplay;
});
