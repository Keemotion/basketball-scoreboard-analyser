define([],function(){
    var Coordinate = function(x="", y=""){
        this.x = x;
        this.y = y;
    };
    Coordinate.prototype.type = "coordinate";
    return Coordinate;
});
