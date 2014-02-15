define(["../messaging_system/event_listener"],function(EventListener){
	var BaseDataClass = new Object();
	BaseDataClass.applyMethods = function(type){
		type.init = function(){
			this.sub_nodes_proxies = new Array();
			this.displaying = false;
			this.toggleDisplayObjectListener = new EventListener(this, this.toggleDisplay);
			this.messaging_system.addEventListener(this.messaging_system.events.ToggleDisplayObject, this.toggleDisplayObjectListener);
		};
		type.toggleDisplay = function(signal, data){
			if(this.isPossiblyAboutThis(data.target_identification)){
				this.setDisplaying(data.displaying);
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
		type.isPossiblyAboutThis = function(target, index){
			if(target.length == 0)
				return false;
			if(typeof(index) == 'undefined')
				index = target.length-1;
			if(index < 0)
				return true;
			var current_identification = target[index];
			if(current_identification['type']==this.getType() && current_identification['id']==this.getId()){
				if(index == 0)
					return true;
				if(this.getParent()){
					return this.getParent().isPossiblyAboutThis(target, index-1);
				}
			}
			return false;
		};
		type.getDisplaying = function(){
			return this.displaying;
		};
		type.setDisplaying = function(displaying, send_notification){
			this.displaying = displaying;
			if(send_notification == null){
				send_notification = true;
			}
			var sub_nodes = this.getSubNodes();
			for(var i = 0; i < sub_nodes.length; ++i){
				sub_nodes[i].setDisplaying(displaying, false);
			}
			if(send_notification){
				this.messaging_system.fire(this.messaging_system.events.DisplayObjectsChanged, null);
			}
		};
		type.getIdentification = function(){
			var identification;
			if(this.getParent()){
				identification = this.getParent().getIdentification();
			}else{
				identification = new Array();
			}
			identification.push({'type':this.getType(), 'id':this.getId()});
			return identification;
		};
		type.getSubNodes = function(){
			throw "getSubNodes must be implemented";
		};
	};
	return BaseDataClass;
});
