define([
		"../../messaging_system/event_listener", 
		"../../model/coordinate", 
		"./transformation",
		"../../messaging_system/events/canvas_scrolled_event",
		"../../messaging_system/events/canvas_mouse_move_event",
		"../../messaging_system/events/canvas_mouse_up_event",
		"../../messaging_system/events/canvas_mouse_down_event",
		"../../messaging_system/events/canvas_focus_out_event",
		"./display_tree",
		"../../messaging_system/events/canvas_image_click_event"
		], 
	function(
		EventListener, 
		Coordinate, 
		Transformation,
		CanvasScrolledEvent,
		CanvasMouseMoveEvent,
		CanvasMouseUpEvent,
		CanvasMouseDownEvent,
		CanvasFocusOutEvent,
		DisplayTree,
		CanvasImageClickEvent
		){
	var CanvasDragHandler = function(transformation, messaging_system){
		this.dragging = false;
		this.messaging_system = messaging_system;
		this.transformation = transformation;
		this.messaging_system.addEventListener(this.messaging_system.events.CanvasMouseMove, new EventListener(this, this.canvasMouseMove));
		this.messaging_system.addEventListener(this.messaging_system.events.CanvasMouseDown, new EventListener(this, this.canvasMouseDown));
		this.messaging_system.addEventListener(this.messaging_system.events.CanvasMouseUp, new EventListener(this, this.canvasMouseUp));
		this.messaging_system.addEventListener(this.messaging_system.events.CanvasFocusOut, new EventListener(this, this.canvasFocusOut));
	};
	CanvasDragHandler.prototype.canvasMouseMove = function(signal, data){
		var ev = data.event_data;
		if(this.dragging){
			var mv = new Coordinate(
					this.transformation.getCanvasWidth()/2 - (ev.pageX-this.dragStartCoordinate.x), 
					this.transformation.getCanvasHeight()/2- (ev.pageY-this.dragStartCoordinate.y));
			var transformed = this.transformation.transformCanvasCoordinateToImageCoordinate(mv);
			this.transformation.setImagePointOnCenter(transformed.x, transformed.y);
			this.dragStartCoordinate = new Coordinate(ev.pageX, ev.pageY);
			this.messaging_system.fire(this.messaging_system.events.ImageDisplayChanged, null);
		}
		return true;
	};
	CanvasDragHandler.prototype.canvasMouseDown = function(signal, data){
		var ev = data.event_data;
		this.dragging = true;
		this.dragStartCoordinate = new Coordinate(ev.pageX, ev.pageY);
	};
	CanvasDragHandler.prototype.canvasMouseUp = function(signal, data){
		var ev = data.event_data;
		this.dragging = false;
	};
	CanvasDragHandler.prototype.canvasFocusOut = function(signal, data){		
		var ev = data.event_data;
		this.canvasMouseUp(signal, data);
	};
	var MyCanvas = function(target_view, proxy, messaging_system){
		var self = this;
		this.messaging_system = messaging_system;
		this.canvas_element = $('<canvas>').attr({
			class:'canvas_image',
			width:'1024',
			height:'768'
		});
		this.canvas_element = this.canvas_element[0];
		this.context = this.canvas_element.getContext('2d');
		this.context.mozImageSmoothingEnabled = false;;
		this.container_element = target_view;
		this.transformation = new Transformation(new Coordinate(0,0), 1,1,1, 1);
		this.dragHandler = new CanvasDragHandler(this.transformation, this.messaging_system);
		this.display_objects = new Array();
		$(this.container_element).append(this.canvas_element);
		this.messaging_system.addEventListener(this.messaging_system.events.LoadImage, new EventListener(this, this.loadImage));
		this.messaging_system.addEventListener(this.messaging_system.events.WindowResized, new EventListener(this, this.windowResized));
		this.messaging_system.addEventListener(this.messaging_system.events.ImageDisplayChanged, new EventListener(this, this.updateCanvas));
		this.messaging_system.addEventListener(this.messaging_system.events.LabelChanged, new EventListener(this, this.updateCanvas));
		this.messaging_system.addEventListener(this.messaging_system.events.CanvasScrolled, new EventListener(this, this.canvasScrolled));
		this.windowResized(null, null);
		var scrollF = function(e){
			messaging_system.fire(messaging_system.events.CanvasScrolled, new CanvasScrolledEvent(e));
		};
		this.canvas_element.addEventListener('DOMMouseScroll', scrollF, false);
		this.canvas_element.addEventListener('mousewheel', scrollF, false);
		$(this.canvas_element).mousemove(function(e){
			messaging_system.fire(messaging_system.events.CanvasMouseMove, new CanvasMouseMoveEvent(e));
		});
		$(this.canvas_element).mousedown(function(e){
			messaging_system.fire(messaging_system.events.CanvasMouseDown, new CanvasMouseDownEvent(e));
		});
		$(this.canvas_element).mouseup(function(e){
			messaging_system.fire(messaging_system.events.CanvasMouseUp, new CanvasMouseUpEvent(e));
		});
		$(this.canvas_element).focusout(function(e){
			messaging_system.fire(messaging_system.events.CanvasFocusOut, new CanvasFocusOutEvent(e));
		});
		$(this.canvas_element).click(function(e){
			var c = self.transformation.transformCanvasCoordinateToImageCoordinate(new Coordinate(e.pageX-self.canvas_element.offsetLeft, e.pageY-self.canvas_element.offsetTop));
			messaging_system.fire(messaging_system.events.CanvasImageClick, new CanvasImageClickEvent(c.x, c.y));
		});
		this.displayObjectsChangedListener = new EventListener(this, this.displayObjectsChanged);
		this.messaging_system.addEventListener(this.messaging_system.events.DisplayObjectsChanged, this.displayObjectsChangedListener);
		this.setProxy(proxy);
	};
	MyCanvas.prototype.displayObjectsChanged = function(signal, data){
		//TODO:update all children display objects
		this.updateCanvas();
	};
	MyCanvas.prototype.canvasScrolled = function(signal, data){
		var evt = data.event_data;
		var delta = evt.wheelDelta?evt.wheelDelta/40:evt.detail?-evt.detail : 0;
		var factor = 0;
		if(delta > 0){
			factor = 9/10;
		}else{
			factor = 10/9;
		}
		this.transformation.setScale(this.transformation.getScale()*factor);
		this.drawCanvas();
		return data.event_data.preventDefault() && false;
	};
	MyCanvas.prototype.windowResized = function(signal, data){
		this.canvas_element.height = $(this.canvas_element).parent().height();
		this.canvas_element.width = $(this.canvas_element).parent().width();
		this.updateTransformation();
		this.drawCanvas();
	};
	MyCanvas.prototype.updateTransformation = function(){
		this.transformation.setCanvasWidth(this.canvas_element.width);
		this.transformation.setCanvasHeight(this.canvas_element.height);
		if(this.image)
			this.transformation.setDisplayRatio(Math.min(this.canvas_element.width/this.image.width, this.canvas_element.height/this.image.height));

	};
	MyCanvas.prototype.getDisplayObjects = function(){
		return this.display_objects;
	};
	MyCanvas.prototype.setProxy = function(proxy){
		if(this.state_display_object)
			this.removeDisplayObject(this.state_display_object);
		this.proxy = proxy;
		this.addDisplayObject(new DisplayTree(this.proxy));
	};
	MyCanvas.prototype.addDisplayObject = function(display_object){
		this.display_objects.push(display_object);
	};
	MyCanvas.prototype.resetDisplayObjects = function(){
		this.display_objects.length = 0;
		this.drawCanvas();
	};
	MyCanvas.prototype.removeDisplayObject = function(display_object){
		for(var i = 0; i < this.display_objects.length-1; ++i){
			if(this.display_objects[i] == display_object){
				this.display_objects[i]=this.display_objects[this.display_objects.length-1];
				break;
			}
		}
		--this.display_objects.length;
	};
	MyCanvas.prototype.drawDisplayObjects = function(){
		for(var i = 0; i < this.display_objects.length; ++i){
			this.display_objects[i].draw(this.context, this.transformation);
		}
	};
	MyCanvas.prototype.updateCanvas = function(signal, data){
		this.drawCanvas();
	};
	MyCanvas.prototype.loadImage = function(signal, data){
		var self = this;
		this.image = new Image();
		this.image.onload = function(){
			self.transformation.setImagePointOnCenter(self.image.width/2, self.image.height/2);
			self.updateTransformation();
			self.messaging_system.fire(self.messaging_system.events.ImageDisplayChanged, null);
		};
		this.image.src = data;
	};
	MyCanvas.prototype.drawCanvas = function(){
		this.context.clearRect(0, 0, this.canvas_element.width, this.canvas_element.height);
		if(this.image){
			var canvas_topleft_coordinate = this.transformation.transformImageCoordinateToCanvasCoordinate(new Coordinate(0,0));
			var image_topleft_coordinate = this.transformation.transformCanvasCoordinateToImageCoordinate(new Coordinate(0,0));
			if(canvas_topleft_coordinate.x<0){
				canvas_topleft_coordinate.x = this.transformation.transformImageCoordinateToCanvasCoordinate(new Coordinate(image_topleft_coordinate.x, 0)).x;	
			}else{
				image_topleft_coordinate.x = this.transformation.transformCanvasCoordinateToImageCoordinate(new Coordinate(canvas_topleft_coordinate.x, 0)).x;
			}
			if(canvas_topleft_coordinate.y<0){
				canvas_topleft_coordinate.y = this.transformation.transformImageCoordinateToCanvasCoordinate(new Coordinate(0, image_topleft_coordinate.y)).y;
			}else{
				image_topleft_coordinate.y = this.transformation.transformCanvasCoordinateToImageCoordinate(new Coordinate(0, canvas_topleft_coordinate.y)).y;
			}
			var canvas_bottomright_coordinate = this.transformation.transformImageCoordinateToCanvasCoordinate(new Coordinate(this.image.width, this.image.height));
			var image_bottomright_coordinate = this.transformation.transformCanvasCoordinateToImageCoordinate(new Coordinate(this.canvas_element.width, this.canvas_element.height));
			if(canvas_bottomright_coordinate.x > this.canvas_element.width-1){
				canvas_bottomright_coordinate.x = this.transformation.transformImageCoordinateToCanvasCoordinate(new Coordinate(image_bottomright_coordinate.x, 0)).x;
			}else{
				image_bottomright_coordinate.x = this.transformation.transformCanvasCoordinateToImageCoordinate(new Coordinate(canvas_bottomright_coordinate.x, 0)).x;
			}
			if(canvas_bottomright_coordinate.y > this.canvas_element.height-1){
				canvas_bottomright_coordinate.y = this.transformation.transformImageCoordinateToCanvasCoordinate(new Coordinate(0, image_bottomright_coordinate.y)).y;
			}else{
				image_bottomright_coordinate.y = this.transformation.transformCanvasCoordinateToImageCoordinate(new Coordinate(0, canvas_bottomright_coordinate.y)).y;
			}
			canvas_topleft_coordinate.x = Math.max(0, canvas_topleft_coordinate.x);
			canvas_topleft_coordinate.y = Math.max(0, canvas_topleft_coordinate.y);
			canvas_bottomright_coordinate.x = Math.min(canvas_bottomright_coordinate.x, this.canvas_element.width);
			canvas_bottomright_coordinate.y = Math.min(canvas_bottomright_coordinate.y, this.canvas_element.height);
			image_topleft_coordinate.x = Math.max(0, image_topleft_coordinate.x);
			image_topleft_coordinate.y = Math.max(0, image_topleft_coordinate.y);
			image_bottomright_coordinate.x = Math.min(image_bottomright_coordinate.x, this.image.width);
			image_bottomright_coordinate.y = Math.min(image_bottomright_coordinate.y, this.image.height);
			this.context.mozImageSmoothingEnabled = false;
			//this.context.webkitImageSmoothingEnabled=false;
			this.context.drawImage(this.image, image_topleft_coordinate.x, image_topleft_coordinate.y, image_bottomright_coordinate.x-image_topleft_coordinate.x, image_bottomright_coordinate.y-image_topleft_coordinate.y, canvas_topleft_coordinate.x, canvas_topleft_coordinate.y, canvas_bottomright_coordinate.x-canvas_topleft_coordinate.x, canvas_bottomright_coordinate.y-canvas_topleft_coordinate.y);
			this.drawDisplayObjects();
		}
	};
	return MyCanvas;
}
);
