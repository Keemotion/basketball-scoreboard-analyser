define(["./coordinate"],function(Coordinate){
    var Digit = function(parent_label, index, messaging_system){
        this.parent_label = parent_label;
        this.messaging_system = messaging_system;
        this.index = index;
        this.corners = new Array();
        for(var i = 0; i < 4; ++i){
            this.corners.push(new Coordinate("", ""));
        }
    };
    Digit.prototype.getStringifyData = function(){
        var d = new Object();
        d.corners = new Array();
        for(var i = 0; i < this.corners.length; ++i){
            var c = new Object();
            c.x = this.corners[i].x;
            c.y = this.corners[i].y;
            d.corners.push(c);
        }
        return d;
    };
    Digit.prototype.load = function(data, warnListeners = true){
        this.corners.length = Math.min(data.corners.length, this.corners.length);
        for(var i = 0; i < this.corners.length; ++i){
            this.corners[i].x = data.corners[i].x;
            this.corners[i].y = data.corners[i].y;
        }
        for(var i = this.corners.length; i < data.corners.length; ++i){
            this.corners.push(new Coordinate(data.corners[i].x, data.corners[i].y));
        }
        if(warnListeners){
            this.messaging_system.fire(this.messaging_system.events.LabelChanged, this.parent_label); 
        }
    };
    Digit.prototype.changeCorner = function(corner_index, x, y, warnListeners = true){
        this.corners[corner_index].x = x;
        this.corners[corner_index].y = y;
        if(warnListeners){
            this.messaging_system.fire(this.messaging_system.events.LabelChanged, this.parent_label);
        }
    };
    Digit.prototype.type = "digit";
    return Digit;
});
