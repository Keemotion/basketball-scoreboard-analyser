define(["../messaging_system/event_listener"],function(EventListener){
	var BaseDataClass = new Object();
	BaseDataClass.applyMethods = function(type){
		type.init = function(){
			this.sub_nodes_proxies = new Array();
			this.drawing = false;
			this.toggleDisplayObjectListener = new EventListener(this, this.toggleDisplay);
			this.messaging_system.addEventListener(this.messaging_system.events.ToggleDisplayObject, this.toggleDisplayObjectListener);
		};
		type.toggleDisplay = function(signal, data){
			console.log("toggle display: "+signal+ ", "+JSON.stringify(data));
			if(this.isPossiblyAboutThis(data.target)){
				this.setDrawing(data.displaying);
			}
		};
		type.getProxy = function(){
			return this.proxy;
		};
		type.setProxy = function(proxy){
			this.proxy = proxy;
		};
		type.getSubNodesProxies = function(){
			return this.sub_nodes_proxies;
		};
		type.getTitle = function(){
			return this.name;
		};
		type.getId = function(){
			return this.id;
		};
		type.getParent = function(){
			return this.parent_state;
		};
		type.getType = function(){
			return this.type;
		};
		type.notifyLabelChanged = function(){
			this.getParent().notifyLabelChanged();
		};
		type.isPossiblyAboutThis = function(target){
			if(this.getType() in target){
				if(this.getId() != target[this.getType()]){
					return false;
				}
			}	
			if(this.getParent() && this.getParent().isPossiblyAboutThis){
				return this.getParent().isPossiblyAboutThis(target);
			}
			return true;
		};
		type.getDrawing = function(){
			return this.drawing;
		};
		type.setDrawing = function(drawing, send_notification){
			this.drawing = drawing;
			/*if(send_notification == null){
				send_notification = true;
			}
			var sub_nodes_proxies = this.getSubNodesProxies();
			for(var i = 0; i < sub_nodes_proxies.length; ++i){
				sub_nodes_proxies[i].setDrawing(drawing, false);
			}
			if(send_notification){
				this.messaging_system.fire(this.messaging_system.events.DisplayObjectsChanged, null);
			}*/
		};
	};
	return BaseDataClass;
});
