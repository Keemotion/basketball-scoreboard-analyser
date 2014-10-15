define([], function(){
	var DigitCornersListenEvent = function(proxy, is_new){
		this.proxy = proxy;
		this.is_new = false;
		if(is_new){
			this.is_new = true;
		}
	};
	DigitCornersListenEvent.prototype.getProxy = function(){
		return this.proxy;
	};
	DigitCornersListenEvent.prototype.isNew = function(){
		return this.is_new;
	};
	return DigitCornersListenEvent;
});