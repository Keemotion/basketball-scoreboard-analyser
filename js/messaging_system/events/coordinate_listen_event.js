define([], function(){
	var CoordinateListenEvent = function(proxy){
		this.proxy = proxy;
	};
	CoordinateListenEvent.prototype.getProxy = function(){
		return this.proxy;
	};
	return CoordinateListenEvent;
});