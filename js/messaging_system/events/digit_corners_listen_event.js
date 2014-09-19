define([], function(){
	var DigitCornersListenEvent = function(proxy){
		this.proxy = proxy;
	};
	DigitCornersListenEvent.prototype.getProxy = function(){
		return this.proxy;
	};
	return DigitCornersListenEvent;
});