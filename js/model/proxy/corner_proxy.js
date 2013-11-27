define(['./proxy_base_class', '../../messaging_system/messaging_system'],function(ProxyBaseClass, MessagingSystem){
    var CornerProxy = function(corner){
		this.setObj(corner);
    };
	ProxyBaseClass.applyMethods(CornerProxy.prototype);
	CornerProxy.prototype.update_events = [];
	CornerProxy.prototype.getX = function(){
		return this.getCoordinate().getX();
	};
	CornerProxy.prototype.getY = function(){
		return this.getCoordinate().getY();
	};
	CornerProxy.prototype.getCoordinate = function(){
		return this.obj.getCoordinate();
	};
    return CornerProxy;
});
