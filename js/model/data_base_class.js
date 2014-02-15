define(["../messaging_system/event_listener"],function(EventListener){
	var BaseDataClass = function(){
	};
	BaseDataClass.prototype.init = function(){
		this.sub_nodes_proxies = new Array();
		this.displaying = true;
		this.toggleDisplayObjectListener = new EventListener(this, this.toggleDisplay);
		this.messaging_system.addEventListener(this.messaging_system.events.ToggleDisplayObject, this.toggleDisplayObjectListener);
	};
	BaseDataClass.prototype.toggleDisplay = function(signal, data){
		if(this.isPossiblyAboutThis(data.target_identification)){
			this.setDisplaying(data.displaying);
		}
	};
	BaseDataClass.prototype.getProxy = function(){
		return this.proxy;
	};
	BaseDataClass.prototype.setProxy = function(proxy){
		this.proxy = proxy;
	};
	BaseDataClass.prototype.getSubNodesProxies = function(){
		return this.sub_nodes_proxies;
	};
	BaseDataClass.prototype.getTitle = function(){
		return this.name;
	};
	BaseDataClass.prototype.getId = function(){
		return this.id;
	};
	BaseDataClass.prototype.getParent = function(){
		return this.parent_state;
	};
	BaseDataClass.prototype.getType = function(){
		return this.type;
	};
	BaseDataClass.prototype.notifyLabelChanged = function(){
		this.getParent().notifyLabelChanged();
	};
	BaseDataClass.prototype.isPossiblyAboutThis = function(target, index){
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
	BaseDataClass.prototype.getDisplaying = function(){
		return this.displaying;
	};
	BaseDataClass.prototype.setDisplaying = function(displaying, send_notification){
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
	BaseDataClass.prototype.getIdentification = function(){
		var identification;
		if(this.getParent()){
			identification = this.getParent().getIdentification();
		}else{
			identification = new Array();
		}
		identification.push({'type':this.getType(), 'id':this.getId()});
		return identification;
	};
	BaseDataClass.prototype.getSubNodes = function(){
		throw "getSubNodes must be implemented";
	};
	return BaseDataClass;
});
