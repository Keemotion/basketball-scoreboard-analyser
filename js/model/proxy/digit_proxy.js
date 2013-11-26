define([],function(){
    var DigitProxy = function(digit){
        this.digit = digit;
    };
    DigitProxy.prototype.getTitle = function(){
        return this.digit.getTitle();
    };
    DigitProxy.prototype.getId = function(){
        return this.digit.getId();
    };
    DigitProxy.prototype.getSubNodes = function(){
        return this.digit.getSubNodesProxies();
    };
	DigitProxy.prototype.getUpdateEvents = function(){
		return [];
	};
    return DigitProxy;
});
