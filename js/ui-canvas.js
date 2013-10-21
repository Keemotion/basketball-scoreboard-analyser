function Canvas(canvas_element){
	this.canvas_element = canvas_element;
	this.context = this.canvas_element.getContext('2d');

	this.drawCanvas = function(){
		this.context.clearRect(0,0,this.canvas_element.width, this.canvas_element.height);
		var canvas_topleft_coordinate = this.transformImageCoordinateToCanvasCoordinate(new Coordinate(0,0));
		var image_topleft_coordinate = this.transformCanvasCoordinateToImageCoordinate(new Coordinate(0,0));
		if(canvas_topleft_coordinate.x<0){
			canvas_topleft_coordinate.x = this.transformImageCoordinateToCanvasCoordinate(new Coordinate(image_topleft_coordinate.x, 0)).x;	
		}else{
			image_topleft_coordinate.x = this.transformCanvasCoordinateToImageCoordinate(new Coordinate(canvas_topleft_coordinate.x, 0)).x;
		}
		if(canvas_topleft_coordinate.y<0){
			canvas_topleft_coordinate.y = this.transformImageCoordinateToCanvasCoordinate(new Coordinate(0, image_topleft_coordinate.y)).y;
		}else{
			image_topleft_coordinate.y = this.transformCanvasCoordinateToImageCoordinate(new Coordinate(0, canvas_topleft_coordinate.y)).y;
		}
		var canvas_bottomright_coordinate = this.transformImageCoordinateToCanvasCoordinate(new Coordinate(this.image.width, this.image.height));
		var image_bottomright_coordinate = this.transformCanvasCoordinateToImageCoordinate(new Coordinate(this.canvas_element.width, this.canvas_element.height));
		if(canvas_bottomright_coordinate.x > this.canvas_element.width-1){
			canvas_bottomright_coordinate.x = this.transformImageCoordinateToCanvasCoordinate(new Coordinate(image_bottomright_coordinate.x, 0)).x;
		}else{
			image_bottomright_coordinate.x = this.transformCanvasCoordinateToImageCoordinate(new Coordinate(canvas_bottomright_coordinate.x, 0)).x;
		}
		if(canvas_bottomright_coordinate.y > this.canvas_element.height-1){
			canvas_bottomright_coordinate.y = this.transformImageCoordinateToCanvasCoordinate(new Coordinate(0, image_bottomright_coordinate.y)).y;
		}else{
			image_bottomright_coordinate.y = this.transformCanvasCoordinateToImageCoordinate(new Coordinate(0, canvas_bottomright_coordinate.y)).y;
		}
		canvas_topleft_coordinate.x = Math.max(0, canvas_topleft_coordinate.x);
		canvas_topleft_coordinate.y = Math.max(0, canvas_topleft_coordinate.y);
		canvas_bottomright_coordinate.x = Math.min(canvas_bottomright_coordinate.x, this.canvas_element.width);
		canvas_bottomright_coordinate.y = Math.min(canvas_bottomright_coordinate.y, this.canvas_element.height);
		image_topleft_coordinate.x = Math.max(0, image_topleft_coordinate.x);
		image_topleft_coordinate.y = Math.max(0, image_topleft_coordinate.y);
		image_bottomright_coordinate.x = Math.min(image_bottomright_coordinate.x, this.image.width);
		image_bottomright_coordinate.y = Math.min(image_bottomright_coordinate.y, this.image.height);
		this.context.drawImage(this.image, image_topleft_coordinate.x, image_topleft_coordinate.y, image_bottomright_coordinate.x-image_topleft_coordinate.x, image_bottomright_coordinate.y-image_topleft_coordinate.y, canvas_topleft_coordinate.x, canvas_topleft_coordinate.y, canvas_bottomright_coordinate.x-canvas_topleft_coordinate.x, canvas_bottomright_coordinate.y-canvas_topleft_coordinate.y);
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
		e.preventDefault();
		var c = new Coordinate(e.pageX-this.offsetLeft, e.pageY-this.offsetTop);
		c = canvas.transformCanvasCoordinateToImageCoordinate(c);
		c.x = Math.floor(c.x);
		c.y = Math.floor(c.y);
		if(c.x>=0&&c.y>=0&&c.x<canvas.image.width&&c.y<canvas.image.height){
			canvas.coordinateClickListener(c.x, c.y);
		}
		return false;
	});
	var handleScroll = function(evt){
		var delta = evt.wheelDelta?evt.wheelDelta/40:evt.detail?-evt.detail : 0;
		var factor = 0;
		if(delta > 0){
			factor = 9/10;
		}else{
			factor = 10/9;
		}
		canvas.scale *= factor;
		canvas.scale = Math.min(canvas.scale, 1);
		canvas.drawCanvas();
		return evt.preventDefault() && false;
	};
	this.canvas_element.addEventListener('DOMMouseScroll', handleScroll, false);
	this.canvas_element.addEventListener('mousewheel', handleScroll, false);
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
