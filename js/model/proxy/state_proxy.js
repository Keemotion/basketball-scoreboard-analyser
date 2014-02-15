define(['./proxy_base_class'], function(ProxyBaseClass){
    var StateProxy = function(state){
		this.setObj(state);
    };
	//ProxyBaseClass.applyMethods(StateProxy.prototype);
	StateProxy.prototype = new ProxyBaseClass();	
    StateProxy.prototype.getTitle = function(){
        return "State";
    };
	StateProxy.prototype.getParent = function(){
		return undefined;
	};
	StateProxy.prototype.getStateString = function(){
		return this.obj.stringify();
	};
    return StateProxy;
});
