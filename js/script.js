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
	this.x = null;
	this.y = null;
}

function Digit(){
	this.corners = new Array();
	for(var i = 0; i < 4; ++i){
		this.corners.push(new Coordinate());
	}
}

function LabelObject(name, digit_amount){
	this.name = name;
	this.digit_amount = digit_amount;
	this.digits = new Array();
	for(var i = 0; i < digit_amount; ++i){
		this.digits.push(new Digit());
	}
}

function State(){
	this.objects = new Array();
	this.loadObjects = function(){
		this.objects.length = 0;
		this.addObject("team1_naam1", 3, false);
		this.stateChanged();
	};
	this.addObject = function(label_name, digit_amount, single_event = true){
		this.objects.push(new LabelObject(label_name, digit_amount));
		if(single_event){
			this.stateChanged();
		}
	};
	this.stateChangedListeners = new Array();
	this.stateChanged = function(){
		for(var i = 0; i < this.stateChangedListeners.length; ++i){
			this.stateChangedListeners[i]();
		}
	};
	this.stringify = function(){
		var data = {objects: this.objects};
		return JSON.stringify(data);
	}
	this.addChangedListener = function(listener){
		this.stateChangedListeners.push(listener);
	}
}
var current_state;
function currentStateChanged(){
	$('textarea#txt_current_state').val(current_state.stringify());
}
var canvas;
var context;
var image;
function drawCanvas(){
	canvas.height = $(canvas).parent().height();
	canvas.width = $(canvas).parent().width();
	
	var ratio = Math.min(canvas.width/image.width, canvas.height/image.height);
	var res_width = image.width*ratio;
	var res_height = image.height*ratio;
	context.drawImage(image, (canvas.width-res_width)/2, (canvas.height-res_height)/2, res_width, res_height);
}
function init(){
	canvas = $('canvas#canvas_image')[0];
	context = canvas.getContext('2d');
	image = new Image();
	image.onload = function(){
		drawCanvas();
	}
	image.src = "./testdata/scoreboard-images/chalon.png";
	current_state = new State();
	current_state.addChangedListener(currentStateChanged);
	current_state.loadObjects();
}
$(document).ready(function(){
	init();
	window.addEventListener('resize', drawCanvas);
});
