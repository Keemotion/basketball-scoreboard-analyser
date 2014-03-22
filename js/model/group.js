define(["./digit", 
	"./proxy/group_proxy", 
	"../messaging_system/event_listener", 
	"./data_base_class", 
	'../messaging_system/events/group_changed_event',
	'./dot'],function(
		Digit, 
		GroupProxy, 
		EventListener, 
		DataBaseClass, 
		GroupChangedEvent,
		Dot){
   	var Group = function(data, parent, messaging_system){
        this.messaging_system = messaging_system;
		this.init();
        this.setParent(parent);
        this.setProxy(new GroupProxy(this));
        this.lockNotification();
        this.loadData(data);
        this.unlockNotification();
    };
	Group.prototype = new DataBaseClass("group");
	Group.default_configuration_keys = {
        "parse_function": null,
        "read_function": "digit_pattern_32",
        "sync_function": "digit_pattern_32",
        "first_digit_restricted": false,
        "must_be_on": false,
        "dtype": null,
        "luminance_threshold": "190"
      };
	Group.prototype.loadData = function(data){
		if(data == null){
			//default
			this.name = "group";
			this.setConfigurationKeys(Group.default_configuration_keys);
			this.clearSubNodes();
		}else{
			this.name = data.name;
			this.createSubNodes(data.sub_nodes);
			this.setConfigurationKeys(data.configuration_keys);
		}
	};
    Group.prototype.createSubNodes = function(subnode_info){
        this.clearSubNodes();
        for(var i = 0; i < subnode_info.length; ++i){
            this.createSubNode(subnode_info[i]);
        }
    };
	Group.prototype.update = function(data){
		this.name = data.name;
		console.log("updating!");
		this.notifyGroupChanged();
		/*this.lockNotification();
		this.name = data.name;
		this.id = data.id;
		var digits = this.getSubNodes();
		digits.length = data.digits.length;
		for(var i = 0; i < digits.length; ++i){
			digits[i].update(data.digits[i]);
		}
		this.unlockNotification();
		this.notifyGroupChanged();*/
	};
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
    Group.prototype.load = function(data){
        this.name = data.name;
		this.id = data.id;
		this.createSubNodes(data.digits);
		this.notifyGroupChanged();
    };
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
			this.addSubNode(s);
		}
	};
    return Group;
});
