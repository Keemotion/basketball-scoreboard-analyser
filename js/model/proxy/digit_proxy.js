define(['./proxy_base_class'],function(ProxyBaseClass){
    var DigitProxy = function(digit){
		this.setObj(digit);
    };
	ProxyBaseClass.applyMethods(DigitProxy.prototype);	
    return DigitProxy;
});
