define([
		"../../messaging_system/event_listener",
		"../../model/coordinate",
		"./transformation",
	//	"../../messaging_system/events/canvas_scrolled_event",
	//	"../../messaging_system/events/canvas_mouse_move_event",
	//	"../../messaging_system/events/canvas_mouse_up_event",
	//	"../../messaging_system/events/canvas_mouse_down_event",
	//	"../../messaging_system/events/canvas_focus_out_event",
		"./display_tree",
	//	"../../messaging_system/events/canvas_image_click_event",
		"../../messaging_system/events/submit_group_details_event",
	//	"./handlers/canvas_drag_handler",
		"./handlers/display_changed_handler",
	//	"./handlers/canvas_hover_handler",
		"../../messaging_system/events/canvas_keydown_event",
	//	"../../messaging_system/events/canvas_image_double_click_event",
		"./handlers/canvas_mouse_handler",
		"../../model/selection_tree",
		"../../model/selection_node",
		"../../messaging_system/events/mouse_event"
		],
	function(
		EventListener,
		Coordinate,
		Transformation,
		/*CanvasScrolledEvent,
		CanvasMouseMoveEvent,
		CanvasMouseUpEvent,
		CanvasMouseDownEvent,
		CanvasFocusOutEvent,*/
		DisplayTree,
		//CanvasImageClickEvent,
		SubmitGroupDetailsEvent,
		//CanvasDragHandler,
		DisplayChangedHandler,
		//CanvasHoverHandler,
		CanvasKeyDownEvent,
		//CanvasImageDoubleClickEvent,
		CanvasMouseHandler,
		SelectionTree,
		SelectionNode,
		MouseEvent
		){
	var MyCanvas = function(view, target_view, proxy, messaging_system){
		var self = this;
		this.view = view;
		this.selected = new Array();
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
		//this.canvas_drag_handler = new CanvasDragHandler(this, this.transformation, this.messaging_system);
		this.canvas_mouse_handler = new CanvasMouseHandler(this, this.messaging_system);
		//this.display_objects = new Array();
		this.display_tree = null;
		$(this.container_element).append(this.canvas_element);
		this.messaging_system.addEventListener(this.messaging_system.events.StateChanged, new EventListener(this, this.updateCanvas));
		this.messaging_system.addEventListener(this.messaging_system.events.LoadImage, new EventListener(this, this.loadImage));
		this.messaging_system.addEventListener(this.messaging_system.events.WindowResized, new EventListener(this, this.windowResized));
		this.messaging_system.addEventListener(this.messaging_system.events.ImageDisplayChanged, new EventListener(this, this.updateCanvas));
		this.messaging_system.addEventListener(this.messaging_system.events.SelectionChanged, new EventListener(this, this.updateCanvas));
		this.messaging_system.addEventListener(this.messaging_system.events.ResetCanvasView, new EventListener(this, this.resetCanvasView));
		this.messaging_system.addEventListener(this.messaging_system.events.GroupChanged, new EventListener(this, this.updateCanvas));
		this.messaging_system.addEventListener(this.messaging_system.events.MouseModeChanged, new EventListener(this, this.mouseModeChanged));
		//this.messaging_system.addEventListener(this.messaging_system.events.CanvasScrolled, new EventListener(this, this.canvasScrolled));
		this.windowResized(null, null);
		var scrollF = function(e){
			self.fireMouseEvent(self.messaging_system.events.CanvasScrolled, e);
		};
		this.canvas_element.addEventListener('DOMMouseScroll', scrollF, false);
		this.canvas_element.addEventListener('mousewheel', scrollF, false);
		$(this.canvas_element).mousemove(function(e){
			self.fireMouseEvent(self.messaging_system.events.CanvasMouseMove, e);
		});
		$(this.canvas_element).mousedown(function(e){
			self.fireMouseEvent(self.messaging_system.events.CanvasMouseDown, e);
		});
		$(this.canvas_element).mouseup(function(e){
			self.fireMouseEvent(self.messaging_system.events.CanvasMouseUp, e);
		});
		$(this.canvas_element).focusout(function(e){
			self.fireMouseEvent(self.messaging_system.events.CanvasFocusOut, e);
		});
		$(this.canvas_element).click(function(e){
			self.fireMouseEvent(self.messaging_system.events.CanvasImageClick, e);
		});
		$(this.canvas_element).dblclick(function(e){
			self.fireMouseEvent(self.messaging_system.events.CanvasImageDoubleClick, e);
		});
		$('html').keydown(function(e){
			messaging_system.fire(messaging_system.events.CanvasKeyDown, new CanvasKeyDownEvent(e));
		});
		this.displayObjectsChangedListener = new EventListener(this, this.displayObjectsChanged);
		this.messaging_system.addEventListener(this.messaging_system.events.DisplayObjectsChanged, this.displayObjectsChangedListener);
		this.setProxy(proxy);
		this.display_changed_handler = new DisplayChangedHandler(this);
	};
	MyCanvas.prototype.fireMouseEvent = function(event_type, event_data){
		var coordinate = new Coordinate(event_data.pageX-this.canvas_element.offsetLeft, event_data.pageY-this.canvas_element.offsetTop);
		this.messaging_system.fire(event_type, new MouseEvent(coordinate, event_data, this.getTransformation()));
	};
	//one of the display objects has changed
	MyCanvas.prototype.displayObjectsChanged = function(signal, data){
		this.updateCanvas();
	};
	MyCanvas.prototype.getSelectionTree = function(selection_rectangle){
		var tree = new SelectionTree();
		var image_coordinates_rectangle = selection_rectangle.transformCanvasCoordinatesToRelativeImageCoordinates(this.getTransformation());
		return this.display_tree.getSelectionTree(image_coordinates_rectangle);
		/*for(var i = 0; i < this.display_objects.length; ++i){
			var tmp_tree = this.display_objects[i].getSelectionTree(image_coordinates_rectangle);
			tree.getRoot().addChild(tmp_tree.getRoot());
		}*/
		return tree;
	};
	/*MyCanvas.prototype.getObjectAroundCanvasCoordinate = function(coordinate){
		for(var i = 0; i < this.display_objects.length; ++i){
			var res = this.display_objects[i].getObjectAroundCanvasCoordinate(coordinate);
			if(res)
				return res;
		}
		return null;
	};
	MyCanvas.prototype.getObjectsInRectangle = function(start_coordinate, end_coordinate){
		var res = new Array();
		for(var i = 0; i < this.display_objects.length; ++i){
			var tmp = this.display_objects[i].getObjectsInRectangle(this.getTransformation(), start_coordinate, end_coordinate);
			for(var j = 0; j < tmp.length; ++j){
				res.push(tmp[j]);
			}
		}
		return res;
	};
	//find the object at a certain coordinate on the canvas
	MyCanvas.prototype.getObjectAtCanvasCoordinate = function(coordinate, distance){
		var obj = new Object();
		obj.maximal_sq_distance = distance;
		var res = null;
		for(var i = 0; i < this.display_objects.length; ++i){
			res = this.display_objects[i].getObjectAtCanvasCoordinate(coordinate, this.transformation, obj);
		}
		return res;
	};*/
	//event handler for canvas croll
	/*MyCanvas.prototype.canvasScrolled = function(signal, data){

	};*/
	//event handler for window resize
	MyCanvas.prototype.windowResized = function(signal, data){
		this.canvas_element.height = $(this.canvas_element).parent().height();
		this.canvas_element.width = $(this.canvas_element).parent().width();
		this.updateTransformation();
		this.drawCanvas();
	};
	//update the display matrix for the canvas based on canvas width/height
	MyCanvas.prototype.updateTransformation = function(){
		this.transformation.setCanvasWidth(this.canvas_element.width);
		this.transformation.setCanvasHeight(this.canvas_element.height);
		if(this.image){
			this.transformation.setImageWidth(this.image.width);
			this.transformation.setImageHeight(this.image.height);
		}
	};
	MyCanvas.prototype.resetCanvasView = function(){
		this.updateTransformation();
		this.transformation.reset();
		this.updateCanvas();
	};
	MyCanvas.prototype.getDisplayTree = function(){
		return this.display_tree;
	};
	/*MyCanvas.prototype.getDisplayObjects = function(){
		return this.display_objects;
	};*/
	MyCanvas.prototype.setProxy = function(proxy){
//		if(this.display_tree_object)
//			this.removeDisplayObject(this.display_tree_object);
		this.resetDisplayObjects();
		this.proxy = proxy;
		//this.addDisplayObject(new DisplayTree(this.proxy, this.messaging_system));
		this.display_tree = new DisplayTree(this.proxy, this.messaging_system);
	};
	/*MyCanvas.prototype.addDisplayObject = function(display_object){
		this.display_objects.push(display_object);
	};*/
	/*MyCanvas.prototype.resetDisplayObjects = function(){
		this.display_objects.length = 0;
		this.drawCanvas();
	};*/
	MyCanvas.prototype.resetDisplayObjects = function(){
		this.display_tree = null;
		this.drawCanvas();
	};
	/*MyCanvas.prototype.removeDisplayObject = function(display_object){
		for(var i = 0; i < this.display_objects.length-1; ++i){
			if(this.display_objects[i] == display_object){
				this.display_objects[i]=this.display_objects[this.display_objects.length-1];
				break;
			}
		}
		--this.display_objects.length;
	};*/
	//draw all display objects on the canvas
	/*MyCanvas.prototype.drawDisplayObjects = function(){
		for(var i = 0; i < this.display_objects.length; ++i){
			this.display_objects[i].draw(this.context, this.transformation);
		}
	};
	MyCanvas.prototype.drawSelectedDisplayObjects = function(){
		var selected_objects = this.view.getCurrentSelectionTree().getRoot().getChildren();
		for(var i = 0; i < selected_objects.length; ++i){
			this.display_objects[selected_objects[i].getId()].drawSelected(selected_objects[i], this.context, this.transformation);
		}
	};*/
	//something has changed on the canvas, warn displayChangedChandler (to prevent all display objects from being drawn every time -> lag)
	MyCanvas.prototype.drawTree = function(){
		if(this.display_tree){
			this.display_tree.draw(this.context, this.transformation);
		}
	};
	MyCanvas.prototype.drawSelected = function(){
		var selection_tree = this.view.getCurrentSelectionTree();
		if(!selection_tree.getRoot().getProxy()){
			return;
		}
		if(this.display_tree){
			this.display_tree.drawSelected(this.view.getCurrentSelectionTree().getRoot(), this.context, this.transformation);
		}
	};
	MyCanvas.prototype.updateCanvas = function(signal, data){
		this.getDisplayChangedHandler().fireEdited();
		this.drawCanvas();
	};
	//load image to the canvas and update transformation
	MyCanvas.prototype.loadImage = function(signal, data){
		var self = this;
		this.image = new Image();
		this.image.onload = function(){
			self.resetCanvasView();
			//self.transformation.setCanvasCenter(new Coordinate(0,0));
			//self.updateTransformation();
			self.messaging_system.fire(self.messaging_system.events.ImageDisplayChanged, null);
		};
		this.image.src = data;
	};
	//return whether all display objects have to be drawn
	MyCanvas.prototype.getDrawComplete = function(){
		return this.getDisplayChangedHandler().canBeDrawn();
	};
	/*MyCanvas.prototype.getDisplayObjectsEnabled = function(){
		return this.getDisplayChangedHandler().canBeDrawn();
	};*/
	//the displayChangedHandler prevents all display objects from being drawn every time the canvas is updated -> lag
	//it waits until there haven't been any updates for a certain time to allow the display objects to be drawn
	MyCanvas.prototype.getDisplayChangedHandler = function(){
		return this.display_changed_handler;
	};
	//draws the canvas image and (if needed) the display objects
	MyCanvas.prototype.drawCanvas = function(){
		this.context.clearRect(0, 0, this.canvas_element.width, this.canvas_element.height);
		if(this.image){
			var canvas_top_left = this.transformation.transformAbsoluteImageCoordinateToCanvasCoordinate(new Coordinate(0,this.transformation.getImageHeight()));
			var canvas_bottom_right = this.transformation.transformAbsoluteImageCoordinateToCanvasCoordinate(new Coordinate(this.transformation.getImageWidth(), 0));
			canvas_top_left.round();
			canvas_bottom_right.round();
			this.context.mozImageSmoothingEnabled = false;
			this.context.webkitImageSmoothingEnabled=false;
			this.context.drawImage(this.image, 0,0, this.transformation.getImageWidth(), this.transformation.getImageHeight(), canvas_top_left.x, canvas_top_left.y, canvas_bottom_right.x-canvas_top_left.x, canvas_bottom_right.y-canvas_top_left.y);
			var rect = this.canvas_mouse_handler.getSelectionRectangle();
			if(rect.getActive()){
				this.context.beginPath();
				this.context.lineWidth = "1";
				this.context.strokeStyle = "aqua";
				this.context.rect(rect.getTopLeft().getX(), rect.getTopLeft().getY(), rect.getWidth(), rect.getHeight());
				this.context.stroke();
			}
			if(this.getDrawComplete()){
				this.drawTree();
			}
			this.drawSelected();
		}
	};
	MyCanvas.prototype.getTransformation = function(){
		return this.transformation;
	};
	MyCanvas.prototype.mouseModeChanged = function(signal, data){
		$(this.canvas_element).parent().removeClass('mouse-mode-selection mouse-mode-view-edit mouse-mode-drag mouse-mode-coordinate-click');
		switch(data.getMode()){
			case CanvasMouseHandler.MouseModes.SelectionMode:
				$(this.canvas_element).parent().addClass('mouse-mode-selection');
				break;
			case CanvasMouseHandler.MouseModes.ViewEditMode:
				$(this.canvas_element).parent().addClass('mouse-mode-view-edit');
				break;
			case CanvasMouseHandler.MouseModes.DragMode:
				$(this.canvas_element).parent().addClass('mouse-mode-drag');
				break;
			case CanvasMouseHandler.MouseModes.CoordinateClickMode:
				$(this.canvas_element).parent().addClass('mouse-mode-coordinate-click');
				break;
			default:
				break;
		}
	};
	return MyCanvas;
}
);
