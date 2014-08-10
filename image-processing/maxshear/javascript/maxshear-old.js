var Canvas = require('canvas');
var img = new Canvas.Image();
img.onload = function() {
	start();
};
//img.src = "../chalon-2.png";
//img.src = "../digit2g.png";
//img.src = "../digit4-blue-pink-sm.png";
img.src = "../digit6-blue-pink.png";
//img.src = "../digit4-blue-pink.png";
//img.src = "../leds-28.png";
//img.src = "../leds-34.png";
//img.src = "../pink-blue-10.png";

function start() {
	//var canvas = $('<canvas>');
	var canvas = new Canvas();
	var context = canvas.getContext("2d");
	canvas.width = img.width;
	canvas.height = img.height;
	context.mozImageSmoothingEnabled = false;
	context.webkitImageSmoothingEnabled = false;
	context.drawImage(img, 0, 0);
	var imageData = context.getImageData(0, 0, img.width, img.height);
	var grayscale_data = new Array(img.height);
	for (var i = 0; i < imageData.height; ++i) {
		grayscale_data[i] = new Array(img.width);
		for (var j = 0; j < imageData.width; ++j) {
			var index = (i * 4) * imageData.width + (j * 4);
			var r = imageData.data[index];
			var g = imageData.data[index + 1];
			var b = imageData.data[index + 2];
			//var y = 0.2126*r+0.7152*g+0.0722*b;
			var y = (r + g + b) / 3.0;
			grayscale_data[i][j] = y;
			y = Math.floor(y);
			imageData.data[index] = y;
			imageData.data[index + 1] = y;
			imageData.data[index + 2] = y;
		}
	}
	var result = digit_corners(grayscale_data);
	console.log("result = "+JSON.stringify(result));
	//context.putImageData(imageData, 0, 0, 0, 0, imageData.width, imageData.height);
	//$('body').append(canvas);
	/*
	result = best_vertical_shear(grayscale_data);
	//console.log(JSON.stringify(result));
	for (var i = 0; i < result.length; ++i) {
		for (var j = 0; j < result[i].length; ++j) {
			var index = j * 4 * imageData.width + i * 4;
			imageData.data[index] = result[i][j];
			imageData.data[index + 1] = result[i][j];
			imageData.data[index + 2] = result[i][j];
		}
	}
	var canvas2 = $('<canvas>');
	var context2 = canvas2[0].getContext("2d");
	context2.mozImageSmoothingEnabled = false;
	context2.webkitImageSmoothingEnabled = false;
	context2.putImageData(imageData, 0, 0, 0, 0, imageData.width, imageData.height);
	$('body').append(canvas2);*/
}

function variance(list) {
	if (list.length == 0)
		return 0;
	var avg = average(list);
	var v = 0;
	for (var i = 0; i < list.length; ++i) {
		v += (avg - list[i]) * (avg - list[i]);
	}
	return v;
}

function average(list) {
	var sum = 0.0;
	for (var i = 0; i < list.length; ++i) {
		sum += list[i];
	}
	return sum / list.length;
}

/*function matlab_copy(grayscale){
 var min_shift = -1.0;
 var max_shift = 1.0;
 var step = 0.001;
 var range_length = (max_shift-min_shift)/step;

 var result = new Array();
 var index = 0;
 for(var shift = min_shift; shift <= max_shift; shift += step){
 index = index+1;
 vect = new Array();
 for(var i = 0; i <= c+range_length; ++i){
 vect.push(0);
 }
 for(var i = 0; i < r; ++i){
 for(var j = 0; j < c; ++j){
 var ind = range_length/2+j+i*shift;
 var ratio = ind-Math.floor(ind);
 vect[Math.ceil(ind)] += ratio*grayscale[i][j];
 vect[Math.floor(ind)] += (1.0-ratio)*grayscale[i][j];
 }
 }
 result.push(variance(vect));
 }
 return Math.max(result);
 }*/
function best_vertical_shear(grayscale) {
	var heighest_variance = 0;
	var heighest_variance_shear;
	var heighest_variance_image;

	var r = grayscale.length;
	var c = grayscale[0].length;
	var all_results = new Array();

	for (var shear = -r / 1.0; shear <= r / 1.0; shear += 1.0 / r) {
		//for(var shear = -r*1.0; shear <= r*1.0; shear += 0.001){
		var shear_results = new Array();
		var avgs = new Array();

		for (var start_col = Math.max(-shear, 0); start_col < Math.min(c - shear, c); start_col++) {
			var line_results = new Array();
			for (var row = 1; row < r - 1; ++row) {
				var col = start_col + shear * row / r;
				var float_part = col - Math.floor(col);
				var value = 0;
				if (Math.floor(col) >= 0) {
					value += grayscale[row][Math.floor(col)] * (1 - float_part);
				}
				if (Math.ceil(col) < c) {
					value += grayscale[row][Math.ceil(col)] * float_part;
				}
				line_results.push(value);
			}
			avgs.push(average(line_results));
			shear_results.push(line_results.slice(0));
		}
		var vr = variance(avgs);
		vr /= avgs.length;
		all_results.push(vr);
		if (vr > heighest_variance) {
			heighest_variance = vr;
			heighest_variance_shear = shear;
			heighest_variance_image = shear_results.slice(0);
		}
	}
	//console.log("variances: "+JSON.stringify(all_results));
	console.log("heighest variance: " + heighest_variance);
	console.log("heighest variance shear: " + heighest_variance_shear);
	return heighest_variance_image;
}
function array_max(arr, start_index, end_index, key){
	var max_index = start_index;
	for(var i = start_index+1; i < end_index; ++i){
		if(arr[max_index][key] < arr[i][key]){
			max_index = i;
		}
	}
	return arr[max_index];
}
function determinant(a, b, c, d){
	return a*d-b*c;
}

function intersection(horizontal_line, vertical_line, cols, rows){
	var D = determinant(vertical_line.shear, -cols, rows, -horizontal_line.shear);
	var lambda = determinant(-vertical_line.shear, -cols, horizontal_line.top_col, -horizontal_line.shear)/D;
	var mu = determinant(vertical_line.shear, -vertical_line.top_col, rows, horizontal_line.top_col)/D;
	var x = vertical_line.top_col + lambda*vertical_line.shear;
	var y = horizontal_line.top_col + mu*horizontal_line.shear;
	//console.log("x = "+x+ " y = "+y);
	return {"x":x, "y":y};
}
function digit_corners(grayscale_image){
	var cols = grayscale_image[0].length;
	var rows = grayscale_image.length;
	var horizontal_lines = horizontal_digit_lines(grayscale_image);
	var vertical_lines = vertical_digit_lines(grayscale_image);
	//console.log("horizontal: "+JSON.stringify(horizontal_lines));
	//console.log("vertical: "+JSON.stringify(vertical_lines));
	var topleft = intersection(horizontal_lines[0], vertical_lines[0], cols, rows);
	var topright = intersection(horizontal_lines[0], vertical_lines[1], cols, rows);
	var bottomleft = intersection(horizontal_lines[1], vertical_lines[0], cols, rows);
	var bottomright = intersection(horizontal_lines[1], vertical_lines[1], cols, rows);
	//delete middle horizontal line
	//find intersections of other two lines
	//return those coordinates
	return [topleft, topright, bottomright, bottomleft];
}
function horizontal_digit_lines(grayscale_image){
	var all_variances = horizontal_variances(grayscale_image);
	var variance_peaks = get_peaks(all_variances);
	var horizontal_lines = get_horizontal_lines(grayscale_image, variance_peaks);
	return horizontal_lines;
}
function vertical_digit_lines(grayscale_image){
	var all_variances = vertical_variances(grayscale_image);
	//console.log(JSON.stringify(all_variances));
	var variance_peaks = get_peaks(all_variances);
	//console.log(JSON.stringify(variance_peaks));
	var vertical_lines = get_vertical_lines(grayscale_image, variance_peaks);
	return vertical_lines;
}
function get_highest_vertical_luminance_lines(grayscale_image, peaks){
	var all_luminances = new Array();
	for(var i = 0; i < peaks.length; ++i){
		var shear = peaks[i].shear;
		var luminances = get_vertical_average_luminances(grayscale_image, shear);
		Array.prototype.push.apply(all_luminances, luminances);
	}
	all_luminances.sort(function(a, b){
		return b.average - a.average;
	});
	return all_luminances;
}
function get_highest_distinct(all_luminances, amount, interval){
	var current = [all_luminances[0]];
	for(var i = 1; i < all_luminances.length; ++i){
		var good = true;
		for(var j = 0; j < current.length; ++j){
			if(Math.abs(all_luminances[i].top_col - current[j].top_col) < interval){
				good = false;
				break;
			}
		}
		if(good){
			current.push(all_luminances[i]);
			if(current.length == amount)
				break;
		}
	}
	return current;
}
function get_vertical_lines(grayscale_image, peaks){
	var INTERVAL = 5;
	var all_luminances = get_highest_vertical_luminance_lines(grayscale_image, peaks);
	all_luminances = get_highest_distinct(all_luminances, 2, INTERVAL);
	var result = null;
	if(all_luminances[0].top_col < all_luminances[1].top_col){
		result = [all_luminances[0], all_luminances[1]];
	}else{
		result = [all_luminances[1], all_luminances[0]];
	}
	return result;
}
function get_horizontal_lines(grayscale_image, peaks){
	var INTERVAL = 5;
	var transposed_image = transpose_image(grayscale_image);
	var all_luminances = get_highest_vertical_luminance_lines(transposed_image, peaks);
	all_luminances = get_highest_distinct(all_luminances, 3, INTERVAL);
	var result = [all_luminances[0], all_luminances[1], all_luminances[2]];
	var heighest = result[0];
	var lowest = result[0];
	for(var i = 1; i < 3; ++i){
		if(result[i].top_col > heighest.top_col){
			heighest = result[i];
		}
		if(result[i].top_col < lowest.top_col){
			lowest = result[i];
		}
	}
	return [lowest, heighest];
}
function array_key_value(array, key){
	var res = [];
	for(var i = 0; i < array.length; ++i){
		res.push(array[i][key]);
	}
	return res;
}
function get_peaks(arr){
	var average_variance = average(array_key_value(arr, "variance"));
	var in_high_area = false;
	var INTERVAL = 5;
	var high_area_start = -INTERVAL;
	var high_values = new Array();
	//console.log("looking for peaks in: "+JSON.stringify(arr));
	for(var i = 0; i < arr.length; ++i){
		if(arr[i].variance > average_variance){
			if(!in_high_area && i > high_area_start + INTERVAL){
				in_high_area = true;
				high_area_start = i;
			}
		}else{
			if(in_high_area){
				high_values.push(array_max(arr,high_area_start, i, "variance"));
				in_high_area = false;
				high_area_start = i;
			}
		}
	}
	if(in_high_area){
		high_values.push(array_max(arr, high_area_start, arr.length, "variance"));
	}
	return high_values;
}
function get_vertical_luminance(grayscale_image, start_col, shear){
	var rows = grayscale_image.length;
	var line_results = new Array();
	for(var row = 1; row < rows; ++row){
		var col = start_col + shear*row/rows;
		var float_part = col - Math.floor(col);
		var value = 0;
		value += grayscale_image[row][Math.floor(col)]*(1-float_part);
		value += grayscale_image[row][Math.ceil(col)]*float_part;
		line_results.push(value);
	}
	return line_results;
}
function get_vertical_average_luminances(grayscale_image, shear){
	var averages = new Array();
	var cols = grayscale_image[0].length;
	for(var top_col = Math.max(-shear,0); top_col < Math.min(cols, cols-shear); top_col ++){
		averages.push({"shear":shear, "top_col": top_col, "average":average(get_vertical_luminance(grayscale_image, top_col, shear))});
	}
	return averages;
}
function get_vertical_average_luminances_variance(grayscale_image, shear){
	var averages = get_vertical_average_luminances(grayscale_image, shear);
	var v = variance(array_key_value(averages, "average")) / averages.length;
	return v;
}
function vertical_variances(grayscale_image){
	var rows = grayscale_image.length;
	var cols = grayscale_image[0].length;
	var max_shear = 1.0*rows;
	var shear_step = 1.0;
	var all_variances = new Array();
	for(var shear = -max_shear; shear <= max_shear; shear += shear_step){
		var v = get_vertical_average_luminances_variance(grayscale_image, shear);
		if(isNaN(v))
			continue;
		all_variances.push({"shear":shear, "variance":v});
	}
	return all_variances;
}
function transpose_image(image){
	var translated_image = new Array();
	for(var i = 0; i < image[0].length; ++i){
		translated_image.push(new Array(image.length));
	}
	for(var i = 0; i < image.length; ++i){
		for(var j = 0; j < image[i].length; ++j){
			translated_image[j][i] = image[i][j];
		}
	}
	return translated_image;
}
function horizontal_variances(grayscale_image){
	var translated_image = transpose_image(grayscale_image);
	return vertical_variances(translated_image);
}