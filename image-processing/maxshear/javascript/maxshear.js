var Canvas = require('canvas');
var requirejs = require('requirejs');
requirejs.config({
	nodeRequire: require
});
var DigitDetector = requirejs('../../../js/image_processing/digit_detector.js');
var img = new Canvas.Image();
img.onload = function() {
	start();
};
//img.src = "../chalon-2.png";
//img.src = "../digit2g.png";
//img.src = "../digit4-blue-pink-sm.png";
//img.src = "../digit6-blue-pink.png";
img.src = "../digit4-wrong-result.png";
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
	var result = DigitDetector.digit_corners(grayscale_data);
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

