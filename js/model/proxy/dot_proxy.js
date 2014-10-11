define(['./proxy_base_class'], function(ProxyBaseClass){
	//provides acces to the dot data the view can access
	var DotProxy = function(dot){
		this.setObj(dot);
	};
	DotProxy.prototype = new ProxyBaseClass();
	DotProxy.prototype.getCoordinate = function(){
		return this.obj.getCoordinate();
	};
	return DotProxy;
});
