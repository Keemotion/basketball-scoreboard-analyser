/**
 *
 * objects = array of LabelObject = {
 * 	name
 * 	digit_amount
 * 	digits : array[4] of Digit = {
 * 		corners : array of Coordinate = {
 * 			x
 * 			y
 * 		}
 * 	}
 * } 
 */
function Coordinate(){
	this.x = "";
	this.y = "";
}

function Digit(parent_label, index){
	this.parent_label = parent_label;
	this.index = index;
	this.corners = new Array();
	for(var i = 0; i < 4; ++i){
		this.corners.push(new Coordinate());
	}
	this.getStringifyData = function(){
		var d = new Object();
		d.corners = this.corners;
		return d;
	};
	this.load = function(data, warnListeners=true){
		this.corners = data.corners;
		if(warnListeners){
			this.parent_label.parent_state.labelChanged(this.parent_label);
		}
	}
}

function LabelObject(name, digit_amount, parent_state, index){
	this.parent_state = parent_state;
	this.name = name;
	this.digit_amount = digit_amount;
	this.digits = new Array();
	this.index = index;
	for(var i = 0; i < digit_amount; ++i){
		this.digits.push(new Digit(this, i));
	}
	this.load = function(data){
		this.name = data.name;
		this.digit_amount = data.digit_amount;
		this.digits = new Array();
		for(var i = 0; i < data.digits.length; ++i){
			var d = new Digit(this, i);
			d.load(data.digits[i], false);
			this.digits.push(d);
		}
		this.parent_state.labelChanged(this);
	};
	this.getStringifyData = function(){
		var d = new Object();
		d.name = this.name;
		d.digit_amount = this.digit_amount;
		//d.digits = this.digits;
		d.digits = new Array();
		for(var i = 0; i < this.digits.length; ++i){
			d.digits.push(this.digits[i].getStringifyData());
		}
		return d;
	}
}

function State(){
	this.objects = new Array();
	this.loadObjects = function(){
		this.objects.length = 0;
		this.addObject("team1_naam1", 3, false);
		this.addObject("team1_naam2", 2, false);
		this.addObject("team2_naam1", 3, false);
		this.addObject("team2_naam2", 2, false);
		this.stateChanged();
	};
	this.addObject = function(label_name, digit_amount, single_event = true){
		this.objects.push(new LabelObject(label_name, digit_amount, this, this.objects.length));
		if(single_event){
			this.stateChanged();
		}
	};
	this.stateChangedListeners = new Array();
	this.stateChanged = function(){
		for(var i = 0; i < this.stateChangedListeners.length; ++i){
			this.stateChangedListeners[i].stateChanged();
		}
	};
	this.labelChanged = function(label){
		for(var i = 0; i < this.stateChangedListeners.length; ++i){
			this.stateChangedListeners[i].labelChanged(label.index);
		}
	};
	this.stringify = function(){
		var objects_data = new Array();
		for(var i = 0; i < this.objects.length; ++i){
			objects_data.push(this.objects[i].getStringifyData());
		}
		var data = {objects: objects_data};
		return JSON.stringify(data);
	}
	this.addChangedListener = function(listener){
		this.stateChangedListeners.push(listener);
	};
	this.parseJSON = function(json){
		this.objects.length = 0;
		try{
			var data = JSON.parse(json);
			//this.objects = data.objects;
			this.objects = new Array();
			for(var i = 0; i < data.objects.length; ++i){
				this.objects.push(new LabelObject(data.objects[i].name, data.objects[i].digit_amount, this, i));
				this.objects[i].load(data.objects[i]);
			}
			this.stateChanged();
			return true;
		}catch(err){
			this.stateChanged();
			return false;
		}
	};
	
}
function StateChangedListener(stateChanged, labelChanged){
	this.labelChanged = labelChanged;
	this.stateChanged = stateChanged;
}
