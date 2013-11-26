define(["./labelobject", "./proxy/state_proxy"], function(LabelObject, StateProxy){
    var State = function(messaging_system){
        this.objects = new Array();
        this.messaging_system = messaging_system;
        this.sub_nodes_proxies = new Array();
        this.proxy = new StateProxy(this);
    };
    State.prototype.loadObjects = function(){
        this.objects.length = 0;
        var digits = new Array();
        for(var i = 0; i < 4; ++i){
            digits.push(new Array());
            for(var j = 0; j < 3; ++j){
                digits[i].push(null);
            }
        }
        this.addObject("team1_label1", digits[0], false);
        this.addObject("team1_label2", digits[1], false);
        this.addObject("team2_label1", digits[3], false);
        this.addObject("team2_label2", digits[2], false);
    };
    State.prototype.addObject = function(label_name, digits, single_event=true){
        this.objects.push(new LabelObject(label_name, digits, this, this.objects.length, this.messaging_system));
        this.sub_nodes_proxies.push(this.objects[this.objects.length-1].getProxy());
        if(single_event){
            this.messaging_system.fire(this.messaging_system.events.StateChanged, this);
        }
    };
    State.prototype.getStringifyData = function(){
        var objects_data = new Array();
        for(var i = 0; i < this.objects.length; ++i){
            objects_data.push(this.objects[i].getStringifyData());
        }
        return {'objects':objects_data};
    };
    State.prototype.stringify = function(){
        return JSON.stringify(this.getStringifyData());
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
    State.prototype.getSubNodesProxies = function(){
        return this.sub_nodes_proxies;
    };
    State.prototype.getProxy = function(){
        return this.proxy;
    };
    return State;
});
