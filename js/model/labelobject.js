define(["./digit"],function(Digit){
    var LabelObject = function(name, digit_amount, parent_state, index, messaging_system){
        this.messaging_system = messaging_system;
        this.parent_state = parent_state;
        this.name = name;
        this.digit_amount = digit_amount;
        this.digits = new Array();
        this.index = index;
        for(var i = 0; i < digit_amount; ++i){
            this.digits.push(new Digit(this, i, this.messaging_system));
        }
    };
    LabelObject.prototype.type = "label";
    LabelObject.prototype.load = function(data){
        this.name = data.name;
        this.digit_amount = data.digit_amount;
        this.digits_length = Math.min(this.digits.length, data.digits_length);
        for(var i = 0; i < this.digits.length; ++i){
            this.digits[i].load(data.digits[i], false);
        }
        for(var i = this.digits.length; i < data.digits.length; ++i){
            var d = new Digit(this, i);
            d.load(data.digits[i], false);
            this.digits.push(d);
        }
        this.messaging_system.fire(this.messaging_system.events.LabelChanged, this);
    };
    LabelObject.prototype.getStringifyData = function(){
        var d = new Object();
        d.name = this.name;
        d.digit_amount = this.digit_amount;
        d.digits = new Array();
        for(var i = 0; i < this.digits.length; ++i){
            d.digits.push(this.digits[i].getStringifyData());
        }
        return d;
    };     
    LabelObject.prototype.removeDigit = function(index){
        for(var i = index+1; i < this.digit_amount; ++i){
            this.digits[i-1] = this.digits[i];
        }
        --this.digit_amount;
        --this.digits.length;
        this.messaging_system.fire(this.messaging_system.events.LabelChanged, this);
    };
    return LabelObject;
});
