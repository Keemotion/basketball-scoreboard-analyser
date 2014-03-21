define(["../messaging_system/event_listener"],function(EventListener){
	var BaseDataClass = function(type){
		this.type = type;
	};
	BaseDataClass.prototype.init = function(){
		this.notification_lock = 0;
		this.sub_nodes = new Array();
		this.displaying = true;
		this.simulating = true;
		this.toggleDisplayObjectListener = new EventListener(this, this.toggleDisplay);
		this.messaging_system.addEventListener(this.messaging_system.events.ToggleDisplayObject, this.toggleDisplayObjectListener);
		this.reOrderedListener = new EventListener(this, this.reOrdered);
		this.messaging_system.addEventListener(this.messaging_system.events.ReOrdered, this.reOrderedListener);
	};
	BaseDataClass.prototype.toggleDisplay = function(signal, data){
		if(this.isPossiblyAboutThis(data.target_identification)){
			this.setDisplaying(data.displaying);
		}
	};
	BaseDataClass.prototype.reOrdered = function(signal, data){
		if(this.isPossiblyAboutThis(data.getTargetIdentification())){
			this.reArrange(data.getNewOrder());
		}
	};
	BaseDataClass.prototype.setConfigurationKeys = function(configuration_keys){
		this.configuration_keys = configuration_keys;
	};
	BaseDataClass.prototype.getConfigurationKeys = function(){
		return this.configuration_keys;
	};
	BaseDataClass.prototype.getProxy = function(){
		return this.proxy;
	};
	BaseDataClass.prototype.setProxy = function(proxy){
		this.proxy = proxy;
	};
	BaseDataClass.prototype.getSubNodesProxies = function(){
		var sub_nodes_proxies = new Array();
		var sub_nodes = this.getSubNodes();
		for(var i = 0; i < sub_nodes.length; ++i){
			sub_nodes_proxies.push(sub_nodes[i].getProxy());
		}
		return sub_nodes_proxies;
	};
	BaseDataClass.prototype.getTitle = function(){
		return this.name;
	};
	BaseDataClass.prototype.getId = function(){
		return this.id;
	};
	BaseDataClass.prototype.setId = function(id){
		this.id = id;
		this.notifyGroupChanged();
	};
	BaseDataClass.prototype.getParent = function(){
		return this.parent;
	};
	BaseDataClass.prototype.setParent = function(parent){
		this.parent = parent;
	};
	BaseDataClass.prototype.getType = function(){
		return this.type;
	};
	BaseDataClass.prototype.lockNotification = function(){
		this.notification_lock++;
	};
	BaseDataClass.prototype.unlockNotification = function(){
		this.notification_lock--;
	};
	BaseDataClass.prototype.notifyGroupChanged = function(){
		if(this.getParent() && this.notification_lock == 0)
			this.getParent().notifyGroupChanged();
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
	BaseDataClass.prototype.getSimulating = function(){
		return this.simulating;
	};
	BaseDataClass.prototype.setSimulating = function(simulating, send_notification){
		this.simulating = simulating;
		if(send_notification == null){
			send_notification = true;
		}
		var sub_nodes = this.getSubNodes();
		for(var i = 0; i < sub_nodes.length; ++i){
			sub_nodes[i].setSimulating(simulating, false);
		}
		if(send_notification){
			this.messaging_system.fire(this.messaging_system.DisplayObjectsChanged, null);
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
	BaseDataClass.prototype.clear = function(){
		this.clearSubNodes();
	};
	BaseDataClass.prototype.getSubNodes = function(){
		return this.sub_nodes;
	};
	BaseDataClass.prototype.setSubNodes = function(sub_nodes){
		this.clearSubNodes();
		for(var i = 0; i < sub_nodes.length; ++i){
			this.addSubNode(sub_nodes[i]);
		}
		this.notifyGroupChanged();
	};
	BaseDataClass.prototype.clearSubNodes = function(){
		for(var i = 0; i < this.sub_nodes.length; ++i){
			this.sub_nodes[i].clear();
		}
		this.sub_nodes.length = 0;
		this.notifyGroupChanged();
	};
	BaseDataClass.prototype.addSubNode = function(sub_node){
		sub_node.setId(this.sub_nodes.length);
		this.sub_nodes.push(sub_node);
		sub_node.setParent(this);
		this.notifyGroupChanged();
	};
	BaseDataClass.prototype.removeSubNode = function(sub_node){
		for(var i = 0; i < this.sub_nodes.length; ++i){
			if(this.sub_nodes[i]==sub_node){
				sub_node.clear();
				this.sub_nodes.splice(i, 1);
				return true;
			}
		}
		this.notifyGroupChanged();
		return false;
	};
	BaseDataClass.prototype.getNewSubNodeId = function(){
		var id = 0;
		var sub_nodes = this.getSubNodes();
		for(var i = 0; i < sub_nodes.length; ++i){
			id = Math.max(sub_nodes[i].getId()+1, id);
		}
		return id;
	};
	BaseDataClass.prototype.getStringifyData = function(){
		var d = new Object();
        d.name = this.name;
        d.sub_nodes = new Array();
        d.type = this.getType();
        var sub_nodes = this.getSubNodes();
        for(var i = 0; i < sub_nodes.length; ++i){
            d.sub_nodes.push(sub_nodes[i].getStringifyData());
        }
        d.configuration_keys = this.getConfigurationKeys();
        
        return d;
	};
	BaseDataClass.prototype.reArrange = function(indices){
		console.log("indices = "+indices);
		var new_sub_nodes = new Array();
		for(var i = 0; i < indices.length; ++i){
			new_sub_nodes.push(this.sub_nodes[indices[i]]);
			this.sub_nodes[indices[i]].setId(i);
		}
		this.sub_nodes = new_sub_nodes;
		this.notifyGroupChanged();
	};
	return BaseDataClass;
});
