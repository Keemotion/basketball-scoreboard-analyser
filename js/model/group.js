define(["./digit",
	"./proxy/group_proxy",
	"../messaging_system/event_listener",
	"./data_base_class",
	'../messaging_system/events/group_changed_event',
	'./dot',
	"../messaging_system/event_listener"],function(
		Digit,
		GroupProxy,
		EventListener,
		DataBaseClass,
		GroupChangedEvent,
		Dot,
		EventListener){
	//represents a collection of digits/dots/groups
	var Group = function(data, group_type, parent, messaging_system){
		this.messaging_system = messaging_system;
		this.init();
		this.group_type = group_type;
		this.setParent(parent);
		this.setProxy(new GroupProxy(this));
		this.lockNotification();
		this.loadData(data);
		this.unlockNotification();
		this.digitAddedListener = new EventListener(this, this.digitAdded);
		this.messaging_system.addEventListener(this.messaging_system.events.DigitAdded, this.digitAddedListener);
	};
	Group.prototype = new DataBaseClass("group");
	//the default configuration keys that are applied to a group in the configuration file
	/*Group.default_configuration_keys = {
		"parse_function": null,
		"read_function": "digit_pattern_32",
		"sync_function": "digit_pattern_32",
		"first_digit_restricted": "false",
		"must_be_on": false,
		"dtype": null,
		"luminance_threshold": "190"
	};*/
	//load the data for this group
	//when no data is provided, an empty group is made and the default configuration keys are applied to it
	Group.prototype.loadData = function(data){
		if(data == null){
			//default
			this.name = this.getGroupType() + " group";
			//this.setConfigurationKeys(Group.default_configuration_keys);
			this.setConfigurationKeys(new Object());
			this.clearSubNodes();
		}else{
			this.name = data.name;
			this.createSubNodes(data.sub_nodes);
			this.setConfigurationKeys(data.configuration_keys);
		}
	};
	//create subnodes based on subnode_info
	Group.prototype.createSubNodes = function(subnode_info){
		this.clearSubNodes();
		for(var i = 0; i < subnode_info.length; ++i){
			this.createSubNode(subnode_info[i]);
		}
	};
	Group.prototype.digitAdded = function(signal, data){
		if(this.isPossiblyAboutThis(data.getTargetIdentification())){
			var digit_data = new Object();
			digit_data.type = "digit";
			digit_data.corners = new Array();
			for(var i = 0; i < data.getCorners().length; ++i){
				digit_data.corners.push({"coordinate":(data.getCorners())[i]});
			}
			digit_data.extra_value = 0.0033333334;
			this.createSubNode(digit_data);
		}
	};
	//update the group properties (not its children)
	Group.prototype.update = function(data){
		this.name = data.name;
		this.setConfigurationKeys(data.configuration_keys);
		this.notifyGroupChanged();
	};
	//adds a subnode based on info
	Group.prototype.createSubNode = function(info){
		var obj = null;
		if (info.type == "digit") {
			obj = new Digit(this, info, this.messaging_system);
		} else if(info.type == "dot"){
			obj = new Dot(this, info, this.messaging_system);
		} else if(info.type == "group"){
			obj = new Group(info, this, this.messaging_system);
		}
		if(obj){
			this.addSubNode(obj);
		}
	};
	//loads the group data, including its sub nodes
	Group.prototype.load = function(data){
		this.name = data.name;
		this.id = data.id;
		this.createSubNodes(data.digits);
		this.notifyGroupChanged();
	};
	//adds an empty element to the sub nodes
	Group.prototype.addElement = function(signal, data){
		if(this.isPossiblyAboutThis(data.getTargetIdentification())){
			var s = null;
			switch(data.getType()){
				case 'group':
					s = new Group(null, this, this.messaging_system);
					break;
				case 'digit':
					s = new Digit(this, null, this.messaging_system);
					break;
				case 'dot':
					s = new Dot(this, null, this.messaging_system);
					break;
			}
			this.addSubNode(s, data.getAutoSelect());
		}
	};
	Group.prototype.getGroupType = function(){
		return this.group_type;
	};
	Group.prototype.reset = function(){
		for(var i = 0; i < this.sub_nodes.length; ++i){
			this.sub_nodes[i].reset();
		}
		this.sub_nodes.length = 0;
	};
	Group.prototype.getCustomIdentification = function(identification){
		identification["group_type"] = this.getGroupType();
	};
	return Group;
});
