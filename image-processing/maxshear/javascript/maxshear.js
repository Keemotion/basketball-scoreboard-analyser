var img = new Image();
img.onload = function(){
	start();
};
//img.src = "../chalon-2.png";
//img.src = "../digit2g.png";
//img.src = "../digit4-blue-pink-sm.png";
//img.src = "../digit4-blue-pink.png";
//img.src = "../leds-28.png";
img.src = "../leds-34.png";
//img.src = "../pink-blue-10.png";

function start(){
	var canvas = $('<canvas>');
	var context = canvas[0].getContext("2d");
	canvas.width = img.width;
	canvas.height = img.height;
	context.mozImageSmoothingEnabled = false;
    context.webkitImageSmoothingEnabled = false;
	context.drawImage(img, 0,0);
	var imageData = context.getImageData(0,0,img.width, img.height);
    var grayscale_data = new Array(img.height);
	for(var i = 0; i < imageData.height; ++i){
        grayscale_data[i] = new Array(img.width);
		for(var j = 0; j < imageData.width; ++j){
            var index = (i*4)*imageData.width + (j*4);
            var r = imageData.data[index];
            var g = imageData.data[index+1];
            var b = imageData.data[index+2];
            //var y = 0.2126*r+0.7152*g+0.0722*b;
            var y = (r+g+b)/3.0;
            grayscale_data[i][j] = y;
            y = Math.floor(y);
            imageData.data[index] = y;
            imageData.data[index+1] = y;
            imageData.data[index+2] = y;
		}
	}
    //context.putImageData(imageData, 0, 0, 0, 0, imageData.width, imageData.height);
    //$('body').append(canvas);

    result = best_vertical_shear(grayscale_data);
    //console.log(JSON.stringify(result));
    for(var i = 0; i < result.length; ++i){
        for(var j = 0; j < result[i].length; ++j){
            var index = j*4*imageData.width+i*4;
            imageData.data[index] = result[i][j];
            imageData.data[index+1] = result[i][j];
            imageData.data[index+2] = result[i][j];
        }
    }
    var canvas2 = $('<canvas>');
    var context2 = canvas2[0].getContext("2d");
    context2.mozImageSmoothingEnabled = false;
    context2.webkitImageSmoothingEnabled=false;
    context2.putImageData(imageData, 0, 0, 0, 0, imageData.width, imageData.height);
    $('body').append(canvas2);
}
function variance(list){
    if(list.length == 0)
        return 0;
    var avg = average(list);
    var v = 0;
    for(var i = 0; i < list.length; ++i){
        v += (avg-list[i])*(avg-list[i]);
    }
    return v;
}
function average(list){
    var sum = 0.0;
    for(var i = 0; i < list.length; ++i){
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
function best_vertical_shear(grayscale){
    var heighest_variance = 0;
    var heighest_variance_shear;
    var heighest_variance_image;

    var r = grayscale.length;
    var c = grayscale[0].length;
    var all_results = new Array();
    
    for(var shear = -r/1.0; shear <= r/1.0; shear += 1.0/r){
    //for(var shear = -r*1.0; shear <= r*1.0; shear += 0.001){
        var shear_results = new Array();
        var avgs = new Array();

        for(var start_col = Math.max(-shear,0); start_col < Math.min(c-shear, c); start_col++){
            var line_results = new Array();
            for(var row = 1; row < r-1; ++row){
                var col = start_col+shear*row/r;
                var float_part = col-Math.floor(col);
                var value = 0;
                if(Math.floor(col)>=0){
                    value += grayscale[row][Math.floor(col)]*(1-float_part);
                }
                if(Math.ceil(col) < c){
                    value += grayscale[row][Math.ceil(col)]*float_part;
                }
                line_results.push(value);
            }
            avgs.push(average(line_results));
            shear_results.push(line_results.slice(0));
        }
        var vr = variance(avgs);
        vr /= avgs.length;
        all_results.push(vr);
        if(vr > heighest_variance){
            heighest_variance = vr;
            heighest_variance_shear = shear;
            heighest_variance_image = shear_results.slice(0);
        }
    }
//    console.log("variances: "+JSON.stringify(all_results));
    console.log("heighest variance: "+heighest_variance);
    console.log("heighest variance shear: "+heighest_variance_shear);
    return heighest_variance_image;
}
