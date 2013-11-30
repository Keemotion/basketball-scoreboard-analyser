define([
		"./labelobject", 
		"./proxy/state_proxy", 
		'./data_base_class',
		'../messaging_system/events/state_changed_event',
		'../messaging_system/event_listener'
		], function(LabelObject, StateProxy, DataBaseClass, StateChangedEvent, EventListener){
    var State = function(messaging_system){
		this.init();
        this.objects = new Array();
        this.messaging_system = messaging_system;
		this.setProxy(new StateProxy(this));
		this.messaging_system.addEventListener(this.messaging_system.events.LabelChanged, new EventListener(this, this.labelChanged));
		this.messaging_system.addEventListener(this.messaging_system.events.LoadState, new EventListener(this, this.loadState));
    };
	DataBaseClass.applyMethods(State.prototype);
	State.prototype.type = "state";
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
	State.prototype.loadState = function(signal, data){
		this.parseJSON(data.getDataString());
	};
	State.prototype.stateChanged = function(){
		this.messaging_system.fire(this.messaging_system.events.StateChanged, new StateChangedEvent());
	};
	State.prototype.labelChanged = function(signal, data){
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

	State.prototype.reset = function(){
		//TODO: clean up all children! (javascript destructor?)
		this.objects.length = 0;
		//TODO: also clean up these children
		this.sub_nodes_proxies.length = 0;

	};
	//TODO: make this method!
    State.prototype.parseJSON = function(json){
		this.reset();
        try{
			console.log("json = "+json);
            var data = JSON.parse(json);
			for(var i = 0; i < data.objects.length; ++i){
				
				this.addObject(data.objects[i].name, data.objects[i].digits, false);
			}
           	this.stateChanged();
            return true;
        }catch(err){
			alert("failed!");
			this.stateChanged();
        }
    };
    return State;
});
