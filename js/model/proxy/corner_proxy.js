define([],function(){
    var CornerProxy = function(corner){
        this.corner = corner;
    };
    CornerProxy.prototype.getTitle = function(){
        return this.corner.getTitle();
    };
    CornerProxy.prototype.getId = function(){
        return this.corner.getId();
    };
    CornerProxy.prototype.getSubNodes = function(){
        return new Array();
    };
    return CornerProxy;
});
