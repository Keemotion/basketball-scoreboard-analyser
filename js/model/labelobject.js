define(["./digit", 
	"./proxy/labelobject_proxy", 
	"../messaging_system/event_listener", 
	"./data_base_class", 
	'../messaging_system/events/label_changed_event',
	'./dot'],function(
		Digit, 
		LabelObjectProxy, 
		EventListener, 
		DataBaseClass, 
		LabelChangedEvent,
		Dot){
    var LabelObject = function(name, digits, parent_state, id, messaging_system){
        this.messaging_system = messaging_system;
		this.init();
        this.parent_state = parent_state;
        this.name = name;
        this.id = id;
        this.setProxy(new LabelObjectProxy(this));
        this.setDigits(digits);
		this.messaging_system.addEventListener(this.messaging_system.events.SubmitLabelObjectDetails, new EventListener(this, this.submitLabelObjectDetails));
    };
	LabelObject.prototype = new DataBaseClass("labelobject");
    LabelObject.prototype.setDigits = function(digits){
        this.clearSubNodes();
        for(var i = 0; i < digits.length; ++i){
            this.addDigit(digits[i]);
        }
    };
	LabelObject.prototype.submitLabelObjectDetails = function(signal, data){
		if(this.isPossiblyAboutThis(data.getTarget())){
			this.update(data.getData());	
		}
	};
	LabelObject.prototype.update = function(data){
		this.name = data.name;
		this.id = data.id;
		var digits = this.getSubNodes();
		digits.length = data.digits.length;
		for(var i = 0; i < digits.length; ++i){
			digits[i].update(data.digits[i], false);
		}
		this.notifyLabelChanged();
	};
	LabelObject.prototype.notifyLabelChanged = function(){
		this.messaging_system.fire(this.messaging_system.events.LabelChanged, new LabelChangedEvent(this.getIdentification()));
	};
    LabelObject.prototype.addDigit = function(digit_data){
    	var obj = null;
		if (digit_data.type == "digit") {
			obj = new Digit(this, this.getNewSubNodeId(), digit_data, this.messaging_system);
		} else if(digit_data.type == "dot"){
			obj = new Dot(this, this.getNewSubNodeId(), digit_data, this.messaging_system);
		}
		if(obj){
			this.addSubNode(obj);
		}
    };
    LabelObject.prototype.load = function(data){
        this.name = data.name;
		this.id = data.id;
		this.setDigits(data.digits);
		this.notifyLabelChanged();
    };
    LabelObject.prototype.getStringifyData = function(){
        var d = new Object();
        d.name = this.name;
        d.digits = new Array();
        var digits = this.getSubNodes();
        for(var i = 0; i < digits.length; ++i){
            d.digits.push(digits[i].getStringifyData());
        }
        return d;
    };     
    LabelObject.prototype.removeDigit = function(index){
    	//TODO: general 
    	var digits = this.getSubNodes();
    	console.log("TODO: implement remove digit");
        for(var i = index+1; i < digits.length; ++i){
            digits[i-1] = digits[i];
        }
        --digits.length;
		this.notifyLabelChanged();
    };
    return LabelObject;
});
