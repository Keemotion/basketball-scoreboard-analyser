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
   	var Group = function(data, parent, id, messaging_system){
        this.messaging_system = messaging_system;
		this.init();
        this.setParent(parent);
        this.name = data.name;
        this.setConfigurationKeys(data.configuration_keys);
        this.id = id;
        this.setProxy(new GroupProxy(this));
        this.lockNotification();
        this.createSubNodes(data.sub_nodes);
        this.unlockNotification();
		this.messaging_system.addEventListener(this.messaging_system.events.SubmitGroupDetails, new EventListener(this, this.submitGroupDetails));
    };
	Group.prototype = new DataBaseClass("group");
    Group.prototype.createSubNodes = function(subnode_info){
        this.clearSubNodes();
        for(var i = 0; i < subnode_info.length; ++i){
            this.createSubNode(subnode_info[i]);
        }
    };
	Group.prototype.submitGroupDetails = function(signal, data){
		if(this.isPossiblyAboutThis(data.getTarget())){
			this.update(data.getData());	
		}
	};
	Group.prototype.update = function(data){
		this.lockNotification();
		this.name = data.name;
		this.id = data.id;
		var digits = this.getSubNodes();
		digits.length = data.digits.length;
		for(var i = 0; i < digits.length; ++i){
			digits[i].update(data.digits[i]);
		}
		this.unlockNotification();
		this.notifyGroupChanged();
	};
	Group.prototype.notifyGroupChanged = function(){
		if(this.notification_lock != 0)
			return;
		this.messaging_system.fire(this.messaging_system.events.GroupChanged, new GroupChangedEvent(this.getIdentification()));
	};
    Group.prototype.createSubNode = function(info){
    	var obj = null;
		if (info.type == "digit") {
			obj = new Digit(this, this.getNewSubNodeId(), info, this.messaging_system);
		} else if(info.type == "dot"){
			obj = new Dot(this, this.getNewSubNodeId(), info, this.messaging_system);
		} else if(info.type == "group"){
			obj = new Group(info, this, this.getNewSubNodeId(), this.messaging_system);
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
    return Group;
});
