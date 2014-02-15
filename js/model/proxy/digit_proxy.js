define(['./proxy_base_class'],function(ProxyBaseClass){
    var DigitProxy = function(digit){
		this.setObj(digit);
    };
	DigitProxy.prototype = new ProxyBaseClass();
    return DigitProxy;
});
