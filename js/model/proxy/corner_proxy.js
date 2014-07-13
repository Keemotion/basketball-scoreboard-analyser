define(['./proxy_base_class', '../../messaging_system/messaging_system'], function(ProxyBaseClass, MessagingSystem) {
	//provides access to the corner data the view can access
	var CornerProxy = function(corner) {
		this.setObj(corner);
	};
	CornerProxy.prototype = new ProxyBaseClass();
	CornerProxy.prototype.getX = function() {
		return this.getCoordinate().getX();
	};
	CornerProxy.prototype.getY = function() {
		return this.getCoordinate().getY();
	};
	CornerProxy.prototype.getCoordinate = function() {
		return this.obj.getCoordinate();
	};
	return CornerProxy;
});
