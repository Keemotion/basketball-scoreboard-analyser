define(['./proxy_base_class'],function(ProxyBaseClass){
    var GroupProxy = function(dot){
		this.setObj(dot);
    };
	GroupProxy.prototype = new ProxyBaseClass();
    return GroupProxy;
});
