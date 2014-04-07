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
		"../../messaging_system/events/canvas_image_click_event",
		"../../messaging_system/events/submit_group_details_event"
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
		CanvasImageClickEvent,
		SubmitGroupDetailsEvent
		){
	var CanvasDragHandler = function(transformation, messaging_system){
		this.dragging = false;
		this.messaging_system = messaging_system;
		this.transformation = transformation;
		this.pause_level = 0;
		this.messaging_system.addEventListener(this.messaging_system.events.CanvasMouseMove, new EventListener(this, this.canvasMouseMove));
		this.messaging_system.addEventListener(this.messaging_system.events.CanvasMouseDown, new EventListener(this, this.canvasMouseDown));
		this.messaging_system.addEventListener(this.messaging_system.events.CanvasMouseUp, new EventListener(this, this.canvasMouseUp));
		this.messaging_system.addEventListener(this.messaging_system.events.CanvasFocusOut, new EventListener(this, this.canvasFocusOut));
		this.messaging_system.addEventListener(this.messaging_system.events.StartObjectDragging, new EventListener(this, this.pauseCanvasDragging));
		this.messaging_system.addEventListener(this.messaging_system.events.StopObjectDragging, new EventListener(this, this.unpauseCanvasDragging));
	};
	CanvasDragHandler.prototype.pauseCanvasDragging = function(){
		this.stopDragging();
		this.pause_level++;
	};
	CanvasDragHandler.prototype.unpauseCanvasDragging = function(){
		this.pause_level = Math.max(0,this.pause_level-1);
	};
	CanvasDragHandler.prototype.canvasMouseMove = function(signal, data){
		var ev = data.event_data;
		if(this.dragging){
			var mv = new Coordinate(
					this.transformation.getCanvasWidth()/2 - (data.getCoordinate().getX()-this.dragStartCoordinate.x), 
					this.transformation.getCanvasHeight()/2- (data.getCoordinate().getY()-this.dragStartCoordinate.y));
			var transformed = this.transformation.transformCanvasCoordinateToRelativeImageCoordinate(mv);
			this.transformation.setCanvasCenter(transformed);
			this.dragStartCoordinate = data.getCoordinate();
			this.messaging_system.fire(this.messaging_system.events.ImageDisplayChanged, null);
		}
		return true;
	};
	CanvasDragHandler.prototype.stopDragging = function(){
		this.dragging = false;
	};
	CanvasDragHandler.prototype.canvasMouseDown = function(signal, data){
		if(this.pause_level > 0)
			return;
		this.dragging = true;
		this.dragStartCoordinate = data.getCoordinate();
	};
	CanvasDragHandler.prototype.canvasMouseUp = function(signal, data){
		this.stopDragging();
	};
	CanvasDragHandler.prototype.canvasFocusOut = function(signal, data){
		this.canvasMouseUp(signal, data);
	};
	var DisplayChangedHandler = function(canvas){
		this.canvas = canvas;
		this.drawn = false;
		this.last_edit = 0;
		this.checkDraw();
		this.interval = 250;
	};
	DisplayChangedHandler.prototype.checkDraw = function(){
		var self = this;
		var now = new Date().getTime();
		if(now-this.last_edit > this.interval && !this.drawn){
			this.drawn = true;
			this.canvas.drawCanvas();
		}else{
			setTimeout(function(){self.checkDraw();}, self.interval);
		}
	};
	DisplayChangedHandler.prototype.fireEdited = function(){
		var self = this;
		this.drawn = false;
		this.last_edit = new Date().getTime();
		setTimeout(function(){self.checkDraw();}, self.interval);
	};
	DisplayChangedHandler.prototype.canBeDrawn = function(){
		return (new Date().getTime())-this.last_edit > this.interval;
	};
	var CanvasObjectDragHandler = function(canvas, messaging_system){
		this.canvas = canvas;
		this.messaging_system = messaging_system;
		this.setSelected(null);
		this.messaging_system.addEventListener(this.messaging_system.events.CanvasMouseDown, new EventListener(this, this.mouseDown));
		this.messaging_system.addEventListener(this.messaging_system.events.CanvasMouseUp, new EventListener(this, this.endDrag));
		this.messaging_system.addEventListener(this.messaging_system.events.CanvasMouseMove, new EventListener(this, this.mouseMove));
		this.messaging_system.addEventListener(this.messaging_system.events.CanvasFocusOut, new EventListener(this, this.endDrag));
	};
	CanvasObjectDragHandler.prototype.getSelected = function(){
		return this.selected_object;
	};
	CanvasObjectDragHandler.prototype.setSelected = function(object){
		this.selected_object = object;
	};
	CanvasObjectDragHandler.prototype.mouseDown = function(signal, data){
		var event_data = data.getEventData();
		if(!event_data.ctrlKey){
			return;
		}
		this.setSelected(this.canvas.getObjectAtCanvasCoordinate(data.getCoordinate()));
		this.startObjectDragging();
	};
	CanvasObjectDragHandler.prototype.startObjectDragging = function(){
		this.messaging_system.fire(this.messaging_system.events.StartObjectDragging, null);
	};
	CanvasObjectDragHandler.prototype.stopObjectDragging = function(){
		this.messaging_system.fire(this.messaging_system.events.StopObjectDragging, null);
	};
	CanvasObjectDragHandler.prototype.mouseMove = function(signal, data){
		if(!this.getSelected()){
			return;
		}
		this.updateObjectCoordinate(this.canvas.getTransformation().transformCanvasCoordinateToRelativeImageCoordinate(data.getCoordinate()));
	};
	CanvasObjectDragHandler.prototype.updateObjectCoordinate = function(coordinate){
		var data = this.getSelected().getProxy().getData();
		data.coordinate = coordinate;
		this.messaging_system.fire(this.messaging_system.events.SubmitGroupDetails, new SubmitGroupDetailsEvent(this.getSelected().getProxy().getIdentification(), data));
	};
	//mouse up, lose focus, mouse out...
	CanvasObjectDragHandler.prototype.endDrag = function(signal, data){
		this.setSelected(null);
		this.stopObjectDragging();
	};
	var CanvasHoverHandler = function(canvas, messaging_system){
		this.last_move = 0;
		this.canvas = canvas;
		this.interval = 100;
		this.cursor_position = new Coordinate(0,0);
		this.waiting = 0;
		messaging_system.addEventListener(messaging_system.events.CanvasMouseMove, new EventListener(this, this.mouseMoved));
	};
	CanvasHoverHandler.prototype.mouseMoved = function(signal, data){
		var self = this;
		this.waiting++;
		setTimeout(function(){self.displayHoveredObject();}, self.interval);
		this.cursor_position = data.getCoordinate();
	};
	CanvasHoverHandler.prototype.displayHoveredObject = function(){
		--this.waiting;
		if(this.waiting != 0)
			return;
		this.canvas.displayHoveredObject(this.cursor_position);
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
		this.container_element = target_view;
		this.transformation = new Transformation(new Coordinate(0,0), 1,1,1, 1,1);
		this.dragHandler = new CanvasDragHandler(this.transformation, this.messaging_system);
		//this.hoverHandler = new CanvasHoverHandler(this, this.messaging_system);
		this.canvas_object_drag_handler = new CanvasObjectDragHandler(this, this.messaging_system);
		this.display_objects = new Array();
		$(this.container_element).append(this.canvas_element);
		this.messaging_system.addEventListener(this.messaging_system.events.StateChanged, new EventListener(this, this.updateCanvas));
		this.messaging_system.addEventListener(this.messaging_system.events.LoadImage, new EventListener(this, this.loadImage));
		this.messaging_system.addEventListener(this.messaging_system.events.WindowResized, new EventListener(this, this.windowResized));
		this.messaging_system.addEventListener(this.messaging_system.events.ImageDisplayChanged, new EventListener(this, this.updateCanvas));
		this.messaging_system.addEventListener(this.messaging_system.events.GroupChanged, new EventListener(this, this.updateCanvas));
		this.messaging_system.addEventListener(this.messaging_system.events.CanvasScrolled, new EventListener(this, this.canvasScrolled));
		this.windowResized(null, null);
		var scrollF = function(e){
			messaging_system.fire(messaging_system.events.CanvasScrolled, new CanvasScrolledEvent(e));
		};
		this.canvas_element.addEventListener('DOMMouseScroll', scrollF, false);
		this.canvas_element.addEventListener('mousewheel', scrollF, false);
		$(this.canvas_element).mousemove(function(e){
			var c = new Coordinate(e.pageX-self.canvas_element.offsetLeft, e.pageY-self.canvas_element.offsetTop);
			messaging_system.fire(messaging_system.events.CanvasMouseMove, new CanvasMouseMoveEvent(c, e));
		});
		$(this.canvas_element).mousedown(function(e){
			var c = new Coordinate(e.pageX-self.canvas_element.offsetLeft, e.pageY-self.canvas_element.offsetTop);
			messaging_system.fire(messaging_system.events.CanvasMouseDown, new CanvasMouseDownEvent(c, e));
		});
		$(this.canvas_element).mouseup(function(e){
			var c = new Coordinate(e.pageX-self.canvas_element.offsetLeft, e.pageY-self.canvas_element.offsetTop);
			messaging_system.fire(messaging_system.events.CanvasMouseUp, new CanvasMouseUpEvent(c, e));
		});
		$(this.canvas_element).focusout(function(e){
			var c = new Coordinate(e.pageX-self.canvas_element.offsetLeft, e.pageY-self.canvas_element.offsetTop);
			messaging_system.fire(messaging_system.events.CanvasFocusOut, new CanvasFocusOutEvent(c, e));
		});
		$(this.canvas_element).click(function(e){
			var c = self.transformation.transformCanvasCoordinateToRelativeImageCoordinate(new Coordinate(e.pageX-self.canvas_element.offsetLeft, e.pageY-self.canvas_element.offsetTop));
			messaging_system.fire(messaging_system.events.CanvasImageClick, new CanvasImageClickEvent(c, e));
		});
		this.displayObjectsChangedListener = new EventListener(this, this.displayObjectsChanged);
		this.messaging_system.addEventListener(this.messaging_system.events.DisplayObjectsChanged, this.displayObjectsChangedListener);
		this.setProxy(proxy);
		this.display_changed_handler = new DisplayChangedHandler(this);
	};
	MyCanvas.prototype.displayObjectsChanged = function(signal, data){
		this.updateCanvas();
	};
	MyCanvas.prototype.getObjectAtCanvasCoordinate = function(coordinate){
		for(var i = 0; i < this.display_objects.length; ++i){
			var res = this.display_objects[i].getObjectAtCanvasCoordinate(coordinate, this.transformation);
			if(res == null)
				continue;
			return res;
		}
		return null;
	};
	MyCanvas.prototype.displayHoveredObject = function(coordinate){
		var obj = this.getObjectAtCanvasCoordinate(coordinate);
		if(obj == null)
			return;
		var proxy = obj.getProxy();
		//TODO: implement method to find object at a given cursor position
		//TODO: find a place to show which object is at the given cursor position
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
		this.updateCanvas(signal, data);
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
		if(this.image){
			this.transformation.setImageWidth(this.image.width);
			this.transformation.setImageHeight(this.image.height);
		}
	};
	MyCanvas.prototype.getDisplayObjects = function(){
		return this.display_objects;
	};
	MyCanvas.prototype.setProxy = function(proxy){
		if(this.state_display_object)
			this.removeDisplayObject(this.state_display_object);
		this.proxy = proxy;
		this.addDisplayObject(new DisplayTree(this.proxy, this.messaging_system));
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
		this.getDisplayChangedHandler().fireEdited();
		this.drawCanvas();
	};
	MyCanvas.prototype.loadImage = function(signal, data){
		var self = this;
		this.image = new Image();
		this.image.onload = function(){
			self.transformation.setCanvasCenter(new Coordinate(0,0));
			self.updateTransformation();
			self.messaging_system.fire(self.messaging_system.events.ImageDisplayChanged, null);
		};
		this.image.src = data;
	};
	MyCanvas.prototype.getDisplayObjectsEnabled = function(){
		return this.getDisplayChangedHandler().canBeDrawn();
	};
	MyCanvas.prototype.getDisplayChangedHandler = function(){
		return this.display_changed_handler;
	};
	MyCanvas.prototype.drawCanvas = function(){
		this.context.clearRect(0, 0, this.canvas_element.width, this.canvas_element.height);
		if(this.image){
			var image_top_left = this.transformation.transformCanvasCoordinateToRelativeImageCoordinate(new Coordinate(0,0));
			image_top_left.x = Math.max(-this.transformation.getHorizontalRatio(), image_top_left.x);
			image_top_left.y = Math.min(this.transformation.getVerticalRatio(), image_top_left.y);
			var canvas_top_left = this.transformation.transformRelativeImageCoordinateToCanvasCoordinate(image_top_left);
			image_top_left = this.transformation.transformRelativeImageCoordinateToAbsoluteImageCoordinate(image_top_left);
			
			var image_bottom_right = this.transformation.transformCanvasCoordinateToRelativeImageCoordinate(new Coordinate(this.canvas_element.width, this.canvas_element.height));
			image_bottom_right.x = Math.min(this.transformation.getHorizontalRatio(), image_bottom_right.x);
			image_bottom_right.y = Math.max(-this.transformation.getVerticalRatio(), image_bottom_right.y);
			var canvas_bottom_right = this.transformation.transformRelativeImageCoordinateToCanvasCoordinate(image_bottom_right);
			image_bottom_right = this.transformation.transformRelativeImageCoordinateToAbsoluteImageCoordinate(image_bottom_right);
			image_top_left.round();
			image_bottom_right.round();
			canvas_top_left.round();
			canvas_bottom_right.round();
			
			if(!this.transformation.inCanvasRange(canvas_top_left) || !this.transformation.inCanvasRange(canvas_bottom_right)){
				return;
			}
			this.context.mozImageSmoothingEnabled = false;
			this.context.webkitImageSmoothingEnabled=false;
			this.context.drawImage(this.image, image_top_left.x, image_top_left.y, image_bottom_right.x-image_top_left.x, image_bottom_right.y-image_top_left.y, canvas_top_left.x, canvas_top_left.y, canvas_bottom_right.x-canvas_top_left.x, canvas_bottom_right.y-canvas_top_left.y);
			if(this.getDisplayObjectsEnabled()){
				this.drawDisplayObjects();
			}else{
				if(this.canvas_object_drag_handler.getSelected()){
					this.canvas_object_drag_handler.getSelected().draw(this.context, this.getTransformation());
				}
			}
		}
	};
	MyCanvas.prototype.getTransformation = function(){
		return this.transformation;
	};
	return MyCanvas;
}
);
