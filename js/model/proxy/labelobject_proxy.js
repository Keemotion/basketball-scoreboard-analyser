define(["../../messaging_system/messaging_system", './proxy_base_class'],function(MessagingSystem, ProxyBaseClass){
    var LabelObjectProxy = function(label_object){
		this.setObj(label_object);
    };
	LabelObjectProxy.prototype = new ProxyBaseClass();
	LabelObjectProxy.prototype.update_events = [MessagingSystem.prototype.events.LabelChanged];
    return LabelObjectProxy;
});
