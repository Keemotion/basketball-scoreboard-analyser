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
    var Group = function(name, digits, parent_state, id, messaging_system){
        this.messaging_system = messaging_system;
		this.init();
        this.parent_state = parent_state;
        this.name = name;
        this.id = id;
        this.setProxy(new GroupProxy(this));
        this.createSubNodes(digits);
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
		this.name = data.name;
		this.id = data.id;
		var digits = this.getSubNodes();
		digits.length = data.digits.length;
		for(var i = 0; i < digits.length; ++i){
			digits[i].update(data.digits[i], false);
		}
		this.notifyGroupChanged();
	};
	Group.prototype.notifyGroupChanged = function(){
		this.messaging_system.fire(this.messaging_system.events.GroupChanged, new GroupChangedEvent(this.getIdentification()));
	};
    Group.prototype.createSubNode = function(info){
    	var obj = null;
		if (info.type == "digit") {
			obj = new Digit(this, this.getNewSubNodeId(), info, this.messaging_system);
		} else if(info.type == "dot"){
			obj = new Dot(this, this.getNewSubNodeId(), info, this.messaging_system);
		} else if(info.type == "group"){
			obj = new Group(this, this.getNewSubNodeId(), info, this.messaging_system);
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
    /*Group.prototype.getStringifyData = function(){
        var d = new Object();
        d.name = this.name;
        d.digits = new Array();
        var digits = this.getSubNodes();
        for(var i = 0; i < digits.length; ++i){
            d.digits.push(digits[i].getStringifyData());
        }
        return d;
    };*/
    /*Group.prototype.removeDigit = function(index){
    	//TODO: general 
    	var digits = this.getSubNodes();
    	console.log("TODO: implement remove digit");
        for(var i = index+1; i < digits.length; ++i){
            digits[i-1] = digits[i];
        }
        --digits.length;
		this.notifyGroupChanged();
    };*/
    return Group;
});