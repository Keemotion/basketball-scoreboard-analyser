function Canvas(canvas_element){
	this.canvas_element = canvas_element;
	this.context = this.canvas_element.getContext('2d');

	this.drawCanvas = function(){
		var displayScale = this.getDisplayScale();
		var swidth = this.image.width/this.scale;
		var sheight = this.image.height/this.scale;
		var sx = this.imagePointOnCenter.x-swidth/2;
		var sy = this.imagePointOnCenter.y-sheight/2;
		this.context.drawImage(this.image, sx, sy, swidth, sheight, (this.canvas_element.width-displayScale*swidth)/2, (this.canvas_element.height-displayScale*sheight)/2, swidth * displayScale, sheight * displayScale);
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
		var c = new Coordinate(e.pageX-this.offsetLeft, e.pageY-this.offsetTop);
		c = canvas.transformCanvasCoordinateToImageCoordinate(c);
		c.x = Math.floor(c.x);
		c.y = Math.floor(c.y);
		if(c.x>=0&&c.y>=0&&c.x<canvas.image.width&&c.y<canvas.image.height){
			canvas.coordinateClickListener(c.x, c.y);
		}
	});
	this.resetCoordinateClickListener();

	this.scale = 1;
	this.transformCanvasCoordinateToImageCoordinate = function(coordinate){
		var c = new Coordinate(coordinate.x, coordinate.y);
		c.x -= this.canvas_element.width/2;
		c.y -= this.canvas_element.height/2;	
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
		c.x += this.canvas_element.width/2;
		c.y += this.canvas_element.height/2;
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
