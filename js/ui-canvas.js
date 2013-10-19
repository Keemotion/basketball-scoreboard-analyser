function Canvas(canvas_element){
	this.canvas_element = canvas_element;
	this.context = this.canvas_element.getContext('2d');

	this.drawCanvas = function(){

		//var ratio = Math.min(this.canvas_element.width/this.image.width, this.canvas_element.height/this.image.height);
		//var res_width = this.image.width*ratio;
		//var res_height = this.image.height*ratio;
		//this.context.drawImage(this.image, (this.canvas_element.width-res_width)/2, (this.canvas_element.height-res_height)/2, res_width, res_height);
		var displayScale = this.getDisplayScale();
		var swidth = this.image.width/this.scale;
		var sheight = this.image.height/this.scale;
		var sx = this.imagePointOnCenter.x-swidth/2;
		var sy = this.imagePointOnCenter.y-sheight/2;
		this.context.drawImage(this.image, sx, sy, swidth, sheight, 0+(this.canvas_element.width-displayScale*swidth)/2, 0, swidth * displayScale, this.canvas_element.height);
	};
	var canvas = this;
	this.setCoordinateClickListener = function(l){
		this.coordinateClickListener = l;
	};
	this.resetCoordinateClickListener = function(){
		this.setCoordinateClickListener(function(x, y){
		});
	};
	$(this.canvas_element).click(function(e){
//		alert("this = "+this);
		//alert("original c: x="+(e.pageX-this.offsetLeft)+",y="+(e.pageY-this.offsetTop));
		var c = new Coordinate(e.pageX-this.offsetLeft, e.pageY-this.offsetTop);
		c = canvas.transformCanvasCoordinateToImageCoordinate(c);
		//alert(" c = "+c.x+" "+c.y);
		canvas.coordinateClickListener(c.x, c.y);
	});
	this.resetCoordinateClickListener();

	this.scale = 1;
	this.transformCanvasCoordinateToImageCoordinate = function(coordinate){
		//alert("coordinate on canvas = "+coordinate.x+" "+coordinate.y);
		var c = new Coordinate(coordinate.x, coordinate.y);
		c.x -= (this.canvas_element.width/2);
		c.y -= (this.canvas_element.height/2);	
		c.x /= this.getDisplayScale();
		c.y /= this.getDisplayScale();
		c.x += this.imagePointOnCenter.x;
		c.y += this.imagePointOnCenter.y;
		return c;
	};
	this.transformImageCoordinateToCanvasCoordinate = function(coordinate){
		var c = new Coordinate(coordinate.x, coordinate.y);
		c.x -= this.imagePointOnCenter.x;
		c.y -= this.imagePointOnCenter.y;
		c.x *= this.getDisplayScale();
		c.y *= this.getDisplayScale();
		c.x += (this.canvas_element.width/2);
		c.y += (this.canvas_element.height/2);
		return c;
	};
	this.getDisplayScale = function(){
		return Math.min(this.canvas_element.width/this.image.width, this.canvas_element.height/this.image.height)/this.scale;
	}
	this.canvasResized = function(){
		this.canvas_element.height = $(this.canvas_element).parent().height();
		this.canvas_element.width = $(this.canvas_element).parent().width();
		this.drawCanvas();
	};

	this.imagePointOnCenter = new Coordinate(0,0);
	this.image = new Image();
	this.image.onload = function(){
		canvas.imagePointOnCenter.x = canvas.image.width/2;
		canvas.imagePointOnCenter.y = canvas.image.height/2;
		canvas.canvasResized();
	};
	this.image.src = "./testdata/scoreboard-images/chalon.png";
}
