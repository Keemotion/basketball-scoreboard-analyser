define([
		"./labelobject", 
		"./proxy/state_proxy", 
		'./data_base_class',
		'../messaging_system/events/state_changed_event',
		'../messaging_system/event_listener',
		'./converter/parser'
		], function(LabelObject, StateProxy, DataBaseClass, StateChangedEvent, EventListener, Parser){
    var State = function(messaging_system){
    	this.id = 0;
        this.messaging_system = messaging_system;
		this.init();
		this.setProxy(new StateProxy(this));
		this.messaging_system.addEventListener(this.messaging_system.events.LabelChanged, new EventListener(this, this.labelChanged));
		this.messaging_system.addEventListener(this.messaging_system.events.LoadState, new EventListener(this, this.loadState));
		this.messaging_system.addEventListener(this.messaging_system.events.LoadStateFile, new EventListener(this, this.loadStateFile));
    };
	State.prototype = new DataBaseClass("state");
	
    State.prototype.loadObjects = function(){
        this.clearSubNodes();
        var digits = new Array();
        for(var i = 0; i < 4; ++i){
            digits.push(new Array());
            for(var j = 0; j < 3; ++j){
            	var o = new Object();
            	o.type = "digit";
                digits[i].push(o);
            }
        }
        this.addObject("team1_label1", digits[0], false);
        this.addObject("team1_label2", digits[1], false);
        this.addObject("team2_label1", digits[3], false);
        this.addObject("team2_label2", digits[2], false);
        var dot = new Array();
        var o = new Object();
        o.type = "dot";
        o.coordinate = {'x':'', 'y':''};
        dot.push(o);
        this.addObject("dot", dot, false);
    };
	State.prototype.loadState = function(signal, data){
		this.parseJSON(data.getDataString());
	};
	State.prototype.loadStateFile = function(signal, data){
		console.log("received state file: "+data.data_string);
		var p = new Parser(data.data_string);
		this.parse(p.parse());
		//TODO: implement
	};
	State.prototype.stateChanged = function(){
		this.messaging_system.fire(this.messaging_system.events.StateChanged, new StateChangedEvent());
	};
	State.prototype.labelChanged = function(signal, data){
	};
    State.prototype.addObject = function(label_name, digits, single_event){
    	if(single_event==null)
    		single_event = true;
    	this.addSubNode(new LabelObject(label_name, digits, this, this.getNewSubNodeId(), this.messaging_system));
        if(single_event){
            this.messaging_system.fire(this.messaging_system.events.StateChanged, this);
        }
    };
    State.prototype.getStringifyData = function(){
        var objects_data = new Array();
        var objects = this.getSubNodes();
        for(var i = 0; i < objects.length; ++i){
            objects_data.push(objects[i].getStringifyData());
        }
        return {'objects':objects_data};
    };
    State.prototype.stringify = function(){
        return JSON.stringify(this.getStringifyData());
    };

	State.prototype.reset = function(){
		//TODO: clean up all children! (javascript destructor?)
		//TODO: also clean up these children
		this.clearSubNodes();
	};
	//TODO: make this method!
	//In a class (JSONParser -> generate()) -> recursive
    State.prototype.parseJSON = function(json){
		this.reset();
        try{
			//console.log("json = "+json);
            var data = JSON.parse(json);
			return this.parse(data);
        }catch(err){
			alert("failed!");
			this.stateChanged();
        }
    };
    State.prototype.parse = function(data){
    	this.clearSubNodes();
    	for(var i = 0; i < data.sub_nodes.length; ++i){
			this.addObject(data.sub_nodes[i].name, data.sub_nodes[i].sub_nodes, false);
		}
       	this.stateChanged();
        return true;
    };
    return State;
});
