var current_state;
function loadState(json){
	current_state.parseJSON(json);
}
function buildTree(){
	$('ul#list_toolbox_objects_tree').html('');
	for(var i = 0; i < current_state.objects.length; ++i){
		var label_li = $('<li></li>').addClass('collapsed').addClass('li_label');
		var label_expand_command = $('<span></span>').addClass('command').addClass('expand_command').html('&gt;&nbsp;');
		var label_collapse_command = $('<span></span>').addClass('command').addClass('collapse_command').html('v&nbsp;');
		var label_title = $('<span></span>').addClass('span_li_title').addClass('span_label_li_title').text(current_state.objects[i].name);
		$(label_li).append(label_expand_command).append(label_collapse_command).append(label_title);
		var digits_ul = $('<ul></ul>');
		for(var j = 0; j < current_state.objects[i].digits.length; ++j){
			var digit_li = $('<li></li>').addClass('collapsed').addClass('li_digit');
			var digit_expand_command = $('<span></span>').addClass('command').addClass('expand_command').html('&gt;&nbsp');
			var digit_collapse_command = $('<span></span>').addClass('command').addClass('collapse_command').html('v&nbsp;');
			var digit_title = $('<span></span>').addClass('span_li_title').addClass('span_digit_li_title').text('Digit '+(j+1));
			$(digit_li).append(digit_expand_command).append(digit_collapse_command).append(digit_title);
			var digit_ul = $('<ul></ul>');
			for(var k = 0; k < 4; ++k){
				var corner_li = $('<li></li>').addClass('li_corner');	
				var corner_title = $('<span></span>').addClass('span_li_title').addClass('span_corner_li_title').text('x: '+current_state.objects[i].digits[j].corners[k].x+'; y: '+current_state.objects[i].digits[j].corners[k].y).appendTo(corner_li);
				$(digit_ul).append(corner_li);
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
		$('ul#list_toolbox_objects_tree li>span.span_li_title').unbind('click').click(function(e){
			if($(this).hasClass('span_label_li_title')){
				var ind = $(this).parent().parent().children('li').index($(this).parent());
				loadLabelDetails(current_state.objects[ind]);
			}else if($(this).hasClass('span_digit_li_title')){
				var label_ind = $(this).closest('.li_label').parent().children().index($(this).closest('.li_label'));
				var digit_ind = $(this).closest('.li_digit').parent().children().index($(this).closest('.li_digit'));
				loadDigitDetails(current_state.objects[label_ind].digits[digit_ind]);
			}else if($(this).hasClass('span_corner_li_title')){
				var label_ind = $(this).closest('.li_label').parent().children().index($(this).closest('.li_label'));
				var digit_ind = $(this).closest('.li_digit').parent().children().index($(this).closest('.li_digit'));
				var corner_ind = $(this).closest('.li_corner').parent().children().index($(this).closest('.li_corner'));
				loadCornerDetails(current_state.objects[label_ind].digits[digit_ind], corner_ind);
			}
		});
	});
}
function currentStateChanged(){
	$('textarea#txt_current_state').val(current_state.stringify());
	buildTree();
}
function loadLabelTreeData(labelLi, label){
	$(labelLi).children('.span_label_li_title').text(label.name);
	for(var i = 0; i < label.digit_amount; ++i){
		var digit_li = $(labelLi).children('ul').find('li.li_digit').get(i);
		for(var j = 0; j < 4; ++j){
			$($(digit_li).find('ul > li').get(j)).children('span.span_corner_li_title').text('x: '+label.digits[i].corners[j].x+', y: '+label.digits[i].corners[j].y);
		}
	}
}
function labelChanged(label_index){
	loadLabelTreeData($('ul#list_toolbox_objects_tree > li').get(label_index), current_state.objects[label_index]);
}
function clearDetails(){
	$('div#div_details').html("");
}
function loadLabelDetails(label){
	clearDetails();
	var div = $('<div></div>').attr('id', 'div_label_details');
	var form = $('<form></form>');
	var table = $('<table></table>');
	var name_input = $('<input />').attr('name', 'txt_name').attr('value', label.name);
	var digit_amount_input = $('<input />').attr('name', 'txt_digit_amount').attr('value', label.digit_amount);
	$(table).append($('<tr></tr>').append($('<td></td>').append($('<label></label>').attr('for', 'txt_name').text('Name: '))).append($('<td></td>').append(name_input)))
		.append($('<tr></tr>').append($('<td></td>').append($('<label></label>').attr('for', 'txt_digit_amount').text('Amount of digits:'))).append($('<td></td>').append(digit_amount_input)));
	for(var i = 0; i < label.digit_amount; ++i){
				$(table).append($('<tr></tr>').append($('<td></td>').append($('<label></label>').text('Digit '+(i+1)))).append($('<td></td>').append(createDigitDetailUL(label.digits[i]))));
	}
	var btnApply = $('<button></button>').attr('type', 'submit').text('Apply');
	$(table).append($('<tr></tr>').append($('<td></td>').attr('colspan','2').append(btnApply)));
	$(form).append(table).appendTo(div).submit(function(e){
		e.preventDefault();
		var data = new Object();
		data.name = $(form).find('input[name="txt_name"]').val();
		data.digit_amount = $(form).find('input[name="txt_digit_amount"]').val();
		data.digits = new Array(data.digit_amount);
		for(var i = 0; i < data.digit_amount; ++i){
			var d = new Object();
			d.corners = new Array(4);
			for(var j = 0; j < 4; ++j){
				d.corners[j]=new Object();
				d.corners[j].x = $(form).find('input[name="txt_label_'+label.index+'_digit_'+i+'_corner_'+j+'_x"]').val();
				d.corners[j].y = $(form).find('input[name="txt_label_'+label.index+'_digit_'+i+'_corner_'+j+'_y"]').val();
			}
			data.digits[i] = d;
		}
		label.load(data);
		return false;
	});
	$('div#div_toolbox_objects_details div#div_details').append(div);
}
function createDigitDetailUL(digit){
	var ul = $('<ul></ul>').addClass('ul_corners');
	var dir = new Array(4);
	dir[0]='TL';
	dir[1]='TR';
	dir[2]='BR';
	dir[3]='BL';
	for(var j = 0; j < 4; ++j){
		$(ul).append($('<li></li>').text(dir[j]+': ')
				.append($('<input />').attr('name', 'txt_label_'+digit.parent_label.index+'_digit_'+digit.index+'_corner_'+j+'_x').attr('type','text').attr('value',digit.corners[j].x))
				.append($('<input />').attr('name', 'txt_label_'+digit.parent_label.index+'_digit_'+digit.index+'_corner_'+j+'_y').attr('type','text').attr('value',digit.corners[j].y)));
	}
	return ul;
}

function loadDigitDetails(digit){
	clearDetails();
	var div = $('<div></div>');
	var form = $('<form></form>');
	$(form).append(createDigitDetailUL(digit));
	var btnApply = $('<button></button>').attr('type', 'submit').text('Apply');
	$(form).append('<br>').append(btnApply).appendTo(div).submit(function(e){
		e.preventDefault();
		var d = new Object();
		d.corners = new Array(4);
		for(var i = 0; i < 4; ++i){
			d.corners[i] = new Object();
			d.corners[i].x = $(form).find('input[name="txt_label_'+digit.parent_label.index+'_digit_'+digit.index+'_corner_'+i+'_x"]').val();
			d.corners[i].y = $(form).find('input[name="txt_label_'+digit.parent_label.index+'_digit_'+digit.index+'_corner_'+i+'_y"]').val();
		}
		digit.load(d);
		return false;
	});
	$(div).append(form);
	$('div#div_toolbox_objects_details div#div_details').append(div);
}
function loadCornerDetails(digit, corner_index){
	clearDetails();
	var div = $('<div>corner details</div>');
	var form = $('<form></form>');
	$(form).append($('<input></input>').attr('type', 'text').attr('name','txt_label_'+digit.parent_label.index+'_digit_'+digit.index+'_corner_'+corner_index+'_x').val(digit.corners[corner_index].x))
		.append($('<input></input>').attr('type', 'text').attr('name', 'txt_label_'+digit.parent_label.index+'_digit_'+digit.index+'_corner_'+corner_index+'_y').val(digit.corners[corner_index].y))
		.append('<br>')
		.append($('<button></button>').attr('type', 'submit').text('Apply'))
		.submit(function(e){
			e.preventDefault();
			var x = $(form).find('input[name="txt_label_'+digit.parent_label.index+'_digit_'+digit.index+'_corner_'+corner_index+'_x"]').val();			
			var y = $(form).find('input[name="txt_label_'+digit.parent_label.index+'_digit_'+digit.index+'_corner_'+corner_index+'_y"]').val();
			digit.changeCorner(corner_index, x, y);
			return false;
		});
	$(div).append(form);
	$('div#div_toolbox_objects_details div#div_details').append(div);
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
	current_state.addChangedListener(new StateChangedListener(currentStateChanged, labelChanged));
	current_state.loadObjects();
}
$(document).ready(function(){
	init();
	window.addEventListener('resize', drawCanvas);
	$('#btn_load_state').click(function(){
		loadState($('#txt_load_state').val());
	});
});
