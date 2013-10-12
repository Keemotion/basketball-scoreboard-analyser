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
	};
	this.parseJSON = function(json){
		this.objects.length = 0;
		try{
			var data = JSON.parse(json);
			this.objects = data.objects;
			this.stateChanged();
			return true;
		}catch(err){
			this.stateChanged();
			return false;
		}
	};
}
var current_state;
function loadState(json){
	current_state.parseJSON(json);
}
function buildTree(){
	$('ul#list_toolbox_objects_tree').html('');
	for(var i = 0; i < current_state.objects.length; ++i){
		var label_li = $('<li></li>').addClass('expanded').append('<span class="expand_command">&gt; </span><span class="collapse_command">v </span>').append(current_state.objects[i].name);
		var digits_ul = $('<ul></ul>');
		for(var j = 0; j < current_state.objects[i].digits.length; ++j){
			var digit_li = $('<li></li>').addClass('expanded').append('<span class="expand_command">&gt; </span><span class="collapse_command">v </span>').append('Digit '+(j+1));
			var digit_ul = $('<ul></ul>');
			for(var k = 0; k < 4; ++k){
				var corner_li = $('<li></li>').text('x: '+current_state.objects[i].digits[j].corners[k].x+'; y: '+current_state.objects[i].digits[j].corners[k].y).appendTo(digit_ul);	
			}
			$(digit_ul).appendTo(digit_li);
			$(digit_li).appendTo(digits_ul);
		}
		$(digits_ul).appendTo(label_li);
		$(label_li).appendTo('ul#list_toolbox_objects_tree');
	}
	$(window).ready(function(){
		$('ul#list_toolbox_objects_tree li .expand_command').unbind('click').click(function(e){
			$(this).parent().removeClass('collapsed').addClass('expanded');
		});
		$('ul#list_toolbox_objects_tree li .collapse_command').unbind('click').click(function(e){
			$(this).parent().removeClass('expanded').addClass('collapsed');
		});
	});
}
function currentStateChanged(){
	$('textarea#txt_current_state').val(current_state.stringify());
	buildTree();
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
	$('#btn_load_state').click(function(){
		loadState($('#txt_load_state').val());
	});
});
