define(["../../messaging_system/messaging_system", './proxy_base_class'],function(MessagingSystem, ProxyBaseClass){
    var GroupProxy = function(group){
		this.setObj(group);
    };
	GroupProxy.prototype = new ProxyBaseClass();
    return GroupProxy;
});
