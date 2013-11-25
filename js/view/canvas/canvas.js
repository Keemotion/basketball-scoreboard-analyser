define(["../../messaging_system/event_listener", "../../model/coordinate"], function(EventListener, Coordinate){
		var MyCanvas = function(target_view, messaging_system){
            this.messaging_system = messaging_system;
			this.canvas_element = $('<canvas>').attr({
        		class:'canvas_image',
        		width:'1024',
        		height:'768'
        		});
            this.canvas_element = this.canvas_element[0];
            this.context = this.canvas_element.getContext('2d');
			this.container_element = target_view;
			this.imagePointOnCenter = new Coordinate(0,0,this.messaging_system);
            this.scale = 1;
			$(this.container_element).append(this.canvas_element);
            this.messaging_system.addEventListener(this.messaging_system.events.LoadImage, new EventListener(this, this.loadImage));
            this.messaging_system.addEventListener(this.messaging_system.events.WindowResized, new EventListener(this, this.windowResized));
            this.messaging_system.addEventListener(this.messaging_system.events.ImageDisplayChanged, new EventListener(this, this.updateCanvas));
            this.windowResized(null, null);
		};
        MyCanvas.prototype.windowResized = function(signal, data){
            this.canvas_element.height = $(this.canvas_element).parent().height();
            this.canvas_element.width = $(this.canvas_element).parent().width();
            this.drawCanvas();
        }
        MyCanvas.prototype.updateCanvas = function(signal, data){
            this.drawCanvas();
        };
        MyCanvas.prototype.loadImage = function(signal, data){
            var canvas = this;
            this.image = new Image();
            this.image.onload = function(){
                canvas.imagePointOnCenter.x = canvas.image.width/2;
                canvas.imagePointOnCenter.y = canvas.image.height/2;
                canvas.messaging_system.fire(canvas.messaging_system.events.ImageDisplayChanged, null);
            };
            this.image.src = data;
        };
        MyCanvas.prototype.transformImageCoordinateToCanvasCoordinate = function(coordinate){
        	var c = new Coordinate(coordinate.x, coordinate.y);
			c.x -= this.imagePointOnCenter.x;
			c.y -= this.imagePointOnCenter.y;
			c.x *= this.getDisplayScale();
			c.y *= this.getDisplayScale();
			c.x += this.canvas_element.width/2;
			c.y += this.canvas_element.height/2;
			return c;
        };
        MyCanvas.prototype.transformCanvasCoordinateToImageCoordinate = function(coordinate){
		    var c = new Coordinate(coordinate.x, coordinate.y);
			c.x -= this.canvas_element.width/2;
			c.y -= this.canvas_element.height/2;	
			c.x /= this.getDisplayScale();
			c.y /= this.getDisplayScale();
			c.x += this.imagePointOnCenter.x;
			c.y += this.imagePointOnCenter.y;
			return c;
        };
        MyCanvas.prototype.getDisplayScale = function(){
            return Math.min(this.canvas_element.width/this.image.width, this.canvas_element.height/this.image.height)/this.scale;
        };
        MyCanvas.prototype.drawCanvas = function(){
            this.context.clearRect(0, 0, this.canvas_element.width, this.canvas_element.height);
            if(this.image){
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
            }
        };
        return MyCanvas;
}
);
