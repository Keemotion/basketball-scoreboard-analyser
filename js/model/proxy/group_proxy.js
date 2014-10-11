define(["../../messaging_system/messaging_system", './proxy_base_class'], function(MessagingSystem, ProxyBaseClass){
	//provides access to the group data the view can access
	var GroupProxy = function(group){
		this.setObj(group);
	};
	GroupProxy.prototype = new ProxyBaseClass();
	GroupProxy.prototype.getGroupType = function(){
		return this.obj.getGroupType();
	};
	return GroupProxy;
});
