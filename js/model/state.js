define([
		"./group", 
		"./proxy/state_proxy", 
		'./data_base_class',
		'../messaging_system/events/state_changed_event',
		'../messaging_system/event_listener',
		'./converter/parser',
		'./converter/exporter'
		], function(Group, StateProxy, DataBaseClass, StateChangedEvent, EventListener, Parser, Exporter){
    var State = function(messaging_system){
    	this.id = 0;
        this.messaging_system = messaging_system;
		this.init();
		this.setProxy(new StateProxy(this));
		this.messaging_system.addEventListener(this.messaging_system.events.GroupChanged, new EventListener(this, this.groupChanged));
		this.messaging_system.addEventListener(this.messaging_system.events.LoadState, new EventListener(this, this.loadState));
		this.messaging_system.addEventListener(this.messaging_system.events.LoadStateFile, new EventListener(this, this.loadStateFile));
    };
	State.prototype = new DataBaseClass("state");
	State.prototype.loadState = function(signal, data){
		this.parseJSON(data.getDataString());
	};
	State.prototype.loadStateFile = function(signal, data){
		console.log("received state file: "+data.data_string);
		var p = new Parser(data.data_string);
		this.parse(p.parse());
	};
	State.prototype.stateChanged = function(){
		if(this.notification_lock != 0)
			return;
		this.messaging_system.fire(this.messaging_system.events.StateChanged, new StateChangedEvent());
	};
	State.prototype.groupChanged = function(signal, data){
	};
	State.prototype.addObject = function(data, single_event){
		this.addSubNode(new Group(data, this, this.getNewSubNodeId(), this.messaging_system));
		this.stateChanged();
	};
    State.prototype.stringify = function(){
        return JSON.stringify(this.getStringifyData(), null, 2);
    };
    State.prototype.getExportedString = function(){
    	var data = this.getStringifyData();
    	var exporter = new Exporter(data);
    	return exporter.export();
    };
	//TODO: make this method!
	//In a class (JSONParser -> generate()) -> recursive
    State.prototype.parseJSON = function(json){
		this.clear();
        try{
			console.log("json = "+json);
            var data = JSON.parse(json);
			return this.parse(data);
        }catch(err){
			alert("failed!");
			this.stateChanged();
        }
    };
    State.prototype.parse = function(data){
    	this.lockNotification();
    	this.clearSubNodes();
    	for(var i = 0; i < data.sub_nodes.length; ++i){
			this.addObject(data.sub_nodes[i], false);
		}
		this.unlockNotification();
       	this.stateChanged();
        return true;
    };
    return State;
});
