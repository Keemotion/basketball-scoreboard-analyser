define([],function(){
    var Coordinate = function(x, y){
        console.log("creating coordinate");
        this.x = x;
        this.y = y;
    };
    Coordinate.prototype.type = "coordinate";
    return Coordinate;
});
