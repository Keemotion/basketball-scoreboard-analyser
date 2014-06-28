var img = new Image();
img.onload = function(){
	start();
};
img.src = "../digit2g.png";

function start(){
	var canvas = $('<canvas>');
	var context = canvas[0].getContext("2d");
	canvas.width = img.width;
	canvas.height = img.height;
	
	context.drawImage(img, 0,0);
	var imageData = context.getImageData(0,0,img.width, img.height);
	for(var i = 0; i < imageData.height; ++i){
		for(var j = 0; j < imageData.width; ++j){
			console.log("test");
		}
	}
}
