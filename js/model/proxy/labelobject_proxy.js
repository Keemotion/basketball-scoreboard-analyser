define(["../../messaging_system/messaging_system"],function(MessagingSystem){
    var LabelObjectProxy = function(label_object){
        this.label_object = label_object;
    };
    LabelObjectProxy.prototype.getTitle = function(){
        return this.label_object.getTitle();
    };
    LabelObjectProxy.prototype.getSubNodes = function(){
        return this.label_object.getSubNodesProxies();
    };
    LabelObjectProxy.prototype.getId = function(){
        return this.label_object.getId();
    };
	LabelObjectProxy.prototype.getUpdateEvents = function(){
		return [MessagingSystem.prototype.events.LabelChanged];
	};
    return LabelObjectProxy;
});
