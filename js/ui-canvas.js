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
		for(var i = 0; i < this.highlights.length; ++i){
			this.drawHighlight(this.highlights[i]);
		}
	};
	var canvas = this;
	this.highlights = new Array();
	this.drawCoordinate = function(coordinate){
		this.context.beginPath();
		var canvas_coordinate = this.transformImageCoordinateToCanvasCoordinate(coordinate);
		this.context.strokeStyle="#0000FF";
		this.context.lineWidth=3;
		this.context.arc(canvas_coordinate.x, canvas_coordinate.y, 5, 0, 2*Math.PI);
		this.context.stroke();
	}
	this.drawDigit = function(digit){
		for(var i = 0; i < digit.corners.length; ++i){
			this.drawCoordinate(digit.corners[i]);
			this.context.lineWidth = 2;
			this.context.beginPath();
			var c1 = this.transformImageCoordinateToCanvasCoordinate(digit.corners[i]);
			var c2 = this.transformImageCoordinateToCanvasCoordinate(digit.corners[(i+1)%digit.corners.length]);
			this.context.moveTo(c1.x, c1.y);
			this.context.lineTo(c2.x, c2.y);
			this.context.stroke();
		}
	};
	this.drawLabel = function(label){
		for(var i = 0; i < label.digit_amount; ++i){
			this.drawDigit(label.digits[i]);
		}
	};
	this.drawHighlight = function(highlight){
		switch(highlight.type){
			case "label":
				this.drawLabel(highlight);
				break;
			case "digit":
				this.drawDigit(highlight);
				break;
			case "coordinate":
				this.drawCoordinate(highlight);
				break;
		}
	}
	this.addHighlight = function(highlight){
		this.highlights.push(highlight);
		this.drawCanvas();
		
		//depending on type of highlight, do something
		//coordinate:
		//	just display with circle around
		//digit:
		//	display four coordinates and connect them (if possible dotted line)
		//label:
		//	display four digits, each digit on its own is connected (same colour)
	};
	this.clearHighlights = function(){
		this.highlights.length = 0;
		this.drawCanvas();
	}
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
	this.dragging = false;
	this.dragStartCoordinate = new Coordinate(undefined, undefined);
	$(this.canvas_element).mousemove(function(e2){
		if(canvas.dragging){
			canvas.imagePointOnCenter = canvas.transformCanvasCoordinateToImageCoordinate(new Coordinate(canvas.canvas_element.width/2-(e2.pageX-canvas.dragStartCoordinate.x), canvas.canvas_element.height/2-(e2.pageY-canvas.dragStartCoordinate.y)));	
			canvas.dragStartCoordinate = new Coordinate(e2.pageX, e2.pageY);
			canvas.drawCanvas();
		}
		return true;
	});	
	$(this.canvas_element).mousedown(function(e){
		canvas.dragging = true;
		canvas.dragStartCoordinate = new Coordinate(e.pageX, e.pageY);
	});
	$(this.canvas_element).mouseup(function(e){
		canvas.dragging = false;
		$(this.canvas_element).mousemove(function(){});
	});
	$(this.canvas_element).focusout(function(e){
		$(this).mouseup();
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
