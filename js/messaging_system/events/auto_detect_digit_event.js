define([], function(){
	var AutoDetectDigitEvent = function(proxy){
		this.proxy = proxy;
	};
	AutoDetectDigitEvent.prototype.getProxy = function(){
		return this.proxy;
	};
	return AutoDetectDigitEvent;
});