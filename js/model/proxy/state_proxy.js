define([], function(){
    var StateProxy = function(state){
        this.state = state;
    };
    StateProxy.prototype.getTitle = function(){
        return "State";
    };
    StateProxy.prototype.getSubNodes = function(){
        return this.state.getSubNodesProxies();
    };
    return StateProxy;
});
