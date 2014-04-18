define(['./proxy_base_class'], function(ProxyBaseClass){
	//provides access to the state data the view can access
    var StateProxy = function(state){
		this.setObj(state);
    };
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
	StateProxy.prototype.getExportedString = function(){
		return this.obj.getExportedString();
	};
    return StateProxy;
});
