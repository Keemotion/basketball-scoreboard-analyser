define(["./base_display",
	"./digit_display",
	"./dot_display",
	"../../messaging_system/event_listener"], function(BaseDisplay, DigitDisplay, DotDisplay, EventListener){
	//Display Equivalent of Group
	var GroupDisplay = function(parent_component, proxy, messaging_system){
		this.init();
		this.setParent(parent_component);
		this.messaging_system = messaging_system;
		this.setProxy(proxy);
		this.loadSubComponents();
		this.messaging_system.addEventListener(this.messaging_system.events.GroupChanged, new EventListener(this, this.groupChanged));
	};
	GroupDisplay.prototype = new BaseDisplay();
	GroupDisplay.prototype.groupChanged = function(signal, data){
		if(this.getProxy().isPossiblyAboutThis(data.getTargetIdentification())){
			this.loadSubComponents();
		}
	};
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
