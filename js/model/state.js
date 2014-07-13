define([
		"./group",
		"./configuration_key",
		"./proxy/state_proxy",
		'./data_base_class',
		'../messaging_system/events/state_changed_event',
		'../messaging_system/event_listener',
		'./converter/parser',
		'./converter/exporter'
		], function(Group, ConfigurationKey, StateProxy, DataBaseClass, StateChangedEvent, EventListener, Parser, Exporter){
	//represents root node in the hierarchy of objects
	var State = function(messaging_system){
		this.id = 0;
		this.messaging_system = messaging_system;
		this.init();
		this.setProxy(new StateProxy(this));
		this.messaging_system.addEventListener(this.messaging_system.events.GroupChanged, new EventListener(this, this.groupChanged));
		this.messaging_system.addEventListener(this.messaging_system.events.LoadState, new EventListener(this, this.loadState));
		this.messaging_system.addEventListener(this.messaging_system.events.LoadStateFile, new EventListener(this, this.loadStateFile));
		this.messaging_system.addEventListener(this.messaging_system.events.ResetState, new EventListener(this, this.reset));
		this.messaging_system.addEventListener(this.messaging_system.events.ClearState, new EventListener(this, this.clearState));
		this.messaging_system.addEventListener(this.messaging_system.events.ObjectsMoved, new EventListener(this, this.objectsMoved));
	};
	State.prototype = new DataBaseClass("state");
	//load the state based on a JSON format
	State.prototype.loadState = function(signal, data){
		this.parseJSON(data.getDataString());
	};
	State.prototype.clearState = function(signal, data){
		this.lockNotification();
		for(var i = 0; i < this.sub_nodes.length; ++i){
			if(this.sub_nodes[i].getType() == "configuration_key"){
				this.sub_nodes.splice(i, 1);
				--i;
				continue;
			}
			this.sub_nodes[i].clear();
		}
		this.unlockNotification();
		this.notifyGroupChanged();
	};
	//load the state based on the original file format
	State.prototype.loadStateFile = function(signal, data){
		var p = new Parser(data.data_string);
		this.parse(p.parse());
	};
	//warn all interested listeners that the current state has changed and that they might need to update themselves
	State.prototype.stateChanged = function(){
		if(this.notification_lock != 0)
			return;
		this.messaging_system.fire(this.messaging_system.events.StateChanged, new StateChangedEvent());
	};
	State.prototype.groupChanged = function(signal, data){
	};
	//add a sub node
	State.prototype.addObject = function(data, single_event){
		switch(data.type){
			case "configuration_key":
				this.addSubNode(new ConfigurationKey(data.key, data.value, this.messaging_system));
				break;
			default:
				this.addSubNode(new Group(data, this, this.messaging_system));
				break;
		}
		this.stateChanged();
	};
	//generate a string based on the data this node and all its ancestors generated
	State.prototype.stringify = function(){
		return JSON.stringify(this.getStringifyData(), null, 2);
	};
	//generate the original output format of all data this node and all its ancestors generated
	State.prototype.getExportedString = function(){
		var data = this.getStringifyData();
		var exporter = new Exporter(data);
		return exporter.export();
	};
	//parses a json object and loads it to the current state
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
	State.prototype.reset = function(){
		this.lockNotification();
		this.clearSubNodes();
		this.unlockNotification();
		this.stateChanged();
	};
	//load data in javascript Object format
	State.prototype.parse = function(data){
		this.lockNotification();
		this.reset();
		for(var i = 0; i < data.sub_nodes.length; ++i){
			this.addObject(data.sub_nodes[i], false);
		}
		this.unlockNotification();
	   	this.stateChanged();
		return true;
	};
	//add an empty sub group
	State.prototype.addElement = function(signal, data){
		if(this.isPossiblyAboutThis(data.getTargetIdentification())){
			var s = null;
			switch(data.getType()){
				case 'group':
					s = new Group(null, this, this.messaging_system);
					break;
			}
			this.addSubNode(s);
			this.stateChanged();
		}
	};
	State.prototype.notifyGroupChanged = function(){
		if(!this.canNotify()){
			return;
		}
		this.stateChanged();
	};
	State.prototype.objectsMoved = function(signal, data){
		var translation = data.getTranslation();
		var tree = data.getTree();
		this.moveSelection(tree.getRoot(), translation);
	};
	return State;
});
