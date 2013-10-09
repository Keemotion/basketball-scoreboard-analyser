alert("test");
/**
 *
 * objects = array of {name, digit_amount, digits = array of 4 coordinates {x,y} }
 *
 */
var objects = new Array();

function loadObjects(){
    objects = new Array();    
    addObject("team1_naam1", 3);
}
function addObject(label_name, digit_amount){
    var o = new Object();
    o.name = label_name;
    o.digit_amount = digit_amount;
    o.digits = new Array(digit_amount);
    for(var i = 0; i < digit_amount; ++i){
        o.digits[i].coordinates = new Array(4);
        for(var j = 0; j < 4; ++j){
            o.digits[i].coordinates[j] = new Array(2);
		   	o.digits[i][0]=null;
			o.digits[i][1]=null;
        }
    }
    objects.push(o);
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
}
$(document).ready(function(){
	init();
});
