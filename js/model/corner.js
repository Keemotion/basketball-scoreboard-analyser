define(['./coordinate','./proxy/corner_proxy'], function(Coordinate, CornerProxy){
    var Corner = function(parent_digit, coordinate, id, messaging_system){
        this.messaging_system = messaging_system;
        this.id = id;
        this.setCoordinate(coordinate);
        this.parent_digit = parent_digit;
        this.proxy = new CornerProxy(this);
    };
    Corner.prototype.getCoordinate = function(){
        return this.coordinate;
    };
    Corner.prototype.setCoordinate = function(coordinate){
        this.coordinate = coordinate;
    };
    Corner.prototype.getTitle = function(){
        return "x: "+this.getCoordinate().x+" y: "+this.getCoordinate().y;
    };
    Corner.prototype.getId = function(){
        return this.id;
    };
    Corner.prototype.getProxy = function(){
        return this.proxy;
    };
    return Corner;
});
