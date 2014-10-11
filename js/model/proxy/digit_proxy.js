define(['./proxy_base_class'], function(ProxyBaseClass){
	//provide access to the digit data the view can access
	var DigitProxy = function(digit){
		this.setObj(digit);
	};
	DigitProxy.prototype = new ProxyBaseClass();
	return DigitProxy;
});
