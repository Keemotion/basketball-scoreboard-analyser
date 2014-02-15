define(["./digit", "./proxy/labelobject_proxy", "../messaging_system/event_listener", "./data_base_class", '../messaging_system/events/label_changed_event'],function(Digit, LabelObjectProxy, EventListener, DataBaseClass, LabelChangedEvent){
    var LabelObject = function(name, digits, parent_state, id, messaging_system){
        this.messaging_system = messaging_system;
		this.init();
        this.parent_state = parent_state;
        this.name = name;
        this.digits = new Array();
        this.id = id;
        this.setProxy(new LabelObjectProxy(this));
        this.setDigits(digits);
		this.messaging_system.addEventListener(this.messaging_system.events.SubmitLabelObjectDetails, new EventListener(this, this.submitLabelObjectDetails));
    };
	LabelObject.prototype = new DataBaseClass();
    LabelObject.prototype.type = "label";
    LabelObject.prototype.getSubNodes = function(){
		return this.digits;
	};
    LabelObject.prototype.setDigits = function(digits){
        this.digits.length = 0;
        this.sub_nodes_proxies.length = 0;
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
		this.digits.length = data.digits.length;
		for(var i = 0; i < this.digits.length; ++i){
			this.digits[i].update(data.digits[i], false);
		}
		this.notifyLabelChanged();
	};
	LabelObject.prototype.notifyLabelChanged = function(){
		this.messaging_system.fire(this.messaging_system.events.LabelChanged, new LabelChangedEvent(/*this.getId()*/this.getIdentification()));
	};
    LabelObject.prototype.addDigit = function(digit_data){
        this.digits.push(new Digit(this, this.digits.length, digit_data, this.messaging_system));
        this.sub_nodes_proxies.push(this.digits[this.digits.length-1].getProxy());
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
        for(var i = 0; i < this.digits.length; ++i){
            d.digits.push(this.digits[i].getStringifyData());
        }
        return d;
    };     
    LabelObject.prototype.removeDigit = function(index){
        for(var i = index+1; i < this.digits.length; ++i){
            this.digits[i-1] = this.digits[i];
        }
        --this.digits.length;
		this.notifyLabelChanged();
    };
    return LabelObject;
});
