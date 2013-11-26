define(["./digit", "./proxy/labelobject_proxy", "../messaging_system/event_listener"],function(Digit, LabelObjectProxy, EventListener){
    var LabelObject = function(name, digits, parent_state, id, messaging_system){
        this.messaging_system = messaging_system;
        this.parent_state = parent_state;
        this.sub_nodes_proxies = new Array();
        this.name = name;
        this.digits = new Array();
        this.id = id;
        this.proxy = new LabelObjectProxy(this);
        this.setDigits(digits);
		this.messaging_system.addEventListener(this.messaging_system.events.SubmitLabelObjectDetails, new EventListener(this, this.submitLabelObjectDetails));
    };
    LabelObject.prototype.type = "label";
    LabelObject.prototype.setDigits = function(digits){
        this.digits.length = 0;
        this.sub_nodes_proxies.length = 0;
        for(var i = 0; i < digits.length; ++i){
            this.addDigit(digits[i]);
        }
    };
	LabelObject.prototype.submitLabelObjectDetails = function(signal, data){
		this.update(data);	
	};
	LabelObject.prototype.update = function(data){
		this.name = data.name;
		this.id = data.id;
		this.digits.length = data.digits.length;
		for(var i = 0; i < this.digits.length; ++i){
			this.digits[i].update(data.digits[i], false);
		}
		this.messaging_system.fire(this.messaging_system.events.LabelChanged, this.id);
	};
    LabelObject.prototype.addDigit = function(digit_data){
        this.digits.push(new Digit(this, this.digits.length, digit_data, this.messaging_system));
        this.sub_nodes_proxies.push(this.digits[this.digits.length-1].getProxy());
    };
    LabelObject.prototype.load = function(data){
        this.name = data.name;
		this.id = data.id;
		this.digits.length = 0;
		for(var i = 0; i < data.digits.length; ++i){
			this.digits.push(new Digit(this, i, data.digits, this.messaging_system));
		}
        this.messaging_system.fire(this.messaging_system.events.LabelChanged, this.id);
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
        this.messaging_system.fire(this.messaging_system.events.LabelChanged, this);
    };
    LabelObject.prototype.getProxy = function(){
        return this.proxy;
    };
    LabelObject.prototype.getSubNodesProxies = function(){
        return this.sub_nodes_proxies;
    };
    LabelObject.prototype.getTitle = function(){
        return this.name;
    };
    LabelObject.prototype.getId = function(){
        return "labelobject_"+this.id;
    };
    return LabelObject;
});
