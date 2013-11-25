define(["./labelobject"], function(LabelObject){
    var State = function(messaging_system){
        this.objects = new Array();
        this.messaging_system = messaging_system;
    };
    State.prototype.loadObjects = function(){
        this.objects.length = 0;
        this.addObject("team1_label1", 3, false);
        this.addObject("team1_label2", 2, false);
        this.addObject("team2_label1", 3, false);
        this.addObject("team2_label2", 2, false);
    };
    State.prototype.addObject = function(label_name, digit_amount, single_event=true){
        this.objects.push(new LabelObject(label_name, digit_amount, this, this.objects.length, this.messaging_system));
        if(single_event){
            this.messaging_system.fire(this.messaging_system.events.StateChanged, this);
        }
    };
    State.prototype.stringify = function(){
        var objects_data = new Array();
        for(var i = 0; i < this.objects.length; ++i){
            objects_data.push(this.objects[i].getStringifyData());
        }
        var data = {objects:objects_data};
        return JSON.stringify(data);
    };
    State.prototype.parseJSON = function(json){
        this.objects.length = 0;
        try{
            var data = JSON.parse(json);
            this.objects = new Array();
            for(var i = 0; i < data.objects.length; ++i){
                objects_data.push(new LabelObject(data.objects[i].name, data.objects[i].digit_amount, this, i));
                this.objects[i].load(data.objects[i]);
            }
            this.messaging_system.fire(this.messaging_system.events.StateChanged, this);
            return true;
        }catch(err){
            this.messaging_system.fire(this.messaging_system.events.StateChanged, this);
        }
    };
    return State;
});
