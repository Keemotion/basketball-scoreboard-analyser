define([
	"../../../messaging_system/event_listener",
	"../../../model/coordinate",
	"../../../messaging_system/events/selection_event",
	"../../../messaging_system/events/objects_moved_event",
	"../../../messaging_system/events/mouse_mode_changed_event",
	"../../../messaging_system/events/auto_detect_digit_area_selected_event",
	"../../../image_processing/digit_detector"]
	, function(
		EventListener,
		Coordinate,
		SelectionEvent,
		ObjectsMovedEvent,
		MouseModeChangedEvent,
		AutoDetectDigitAreaSelectedEvent,
		DigitDetector
	){
	var SelectionRectangle = function(){
		this.start_coordinate = new Coordinate();
		this.end_coordinate = new Coordinate();
		this.active = false;
	};
	SelectionRectangle.prototype.getActive = function(){
		return this.active;
	};
	SelectionRectangle.prototype.getTopLeft = function(){
		return new Coordinate(Math.min(this.start_coordinate.getX(), this.end_coordinate.getX()), Math.min(this.start_coordinate.getY(), this.end_coordinate.getY()));
	};
	SelectionRectangle.prototype.getBottomRight = function(){
		return new Coordinate(Math.max(this.start_coordinate.getX(), this.end_coordinate.getX()), Math.max(this.start_coordinate.getY(), this.end_coordinate.getY()));
	};
	SelectionRectangle.prototype.getHeight = function(){
		return Math.abs(this.start_coordinate.getY()-this.end_coordinate.getY());
	};
	SelectionRectangle.prototype.getWidth = function(){
		return Math.abs(this.start_coordinate.getX()-this.end_coordinate.getX());
	};
	SelectionRectangle.prototype.transformCanvasCoordinatesToRelativeImageCoordinates = function(transformation){
		var result = new SelectionRectangle();
		result.startSelection(transformation.transformCanvasCoordinateToRelativeImageCoordinate(this.start_coordinate));
		result.updateSelection(transformation.transformCanvasCoordinateToRelativeImageCoordinate(this.end_coordinate));
		return result;
	};
	SelectionRectangle.prototype.transformCanvasCoordinatesToAbsoluteCoordinates = function(transformation){
		var result = new SelectionRectangle();
		result.startSelection(transformation.transformCanvasCoordinateToAbsoluteImageCoordinate(this.start_coordinate));
		result.updateSelection(transformation.transformCanvasCoordinateToAbsoluteImageCoordinate(this.end_coordinate));
		return result;
	};
	SelectionRectangle.prototype.startSelection = function(coordinate){
		this.start_coordinate = coordinate.clone();
		this.end_coordinate = coordinate.clone();
		this.active = true;
	};
	SelectionRectangle.prototype.updateSelection = function(coordinate){
		this.end_coordinate = coordinate.clone();
	};
	SelectionRectangle.prototype.stopSelection = function(){
		this.active = false;
	};
	var CanvasMouseHandler = function(canvas, messaging_system){
		this.canvas = canvas;
		this.messaging_system = messaging_system;

		this.previous_mouse_coordinate = new Coordinate();
		this.mouse_down_time = 0;
		this.mouse_down = false;

		this.current_mouse_mode = CanvasMouseHandler.MouseModes.EditMode;
		this.previous_mouse_mode = CanvasMouseHandler.MouseModes.EditMode;
		//this.current_mouse_mode = CanvasMouseHandler.MouseModes.ViewEditMode;
		this.selection_rectangle = new SelectionRectangle;

		this.messaging_system.addEventListener(this.messaging_system.events.CanvasScrolled, new EventListener(this, this.canvasScrolled));
		this.messaging_system.addEventListener(this.messaging_system.events.CanvasMouseMove, new EventListener(this, this.mouseMove));
		this.messaging_system.addEventListener(this.messaging_system.events.CanvasMouseUp, new EventListener(this, this.mouseUp));
		this.messaging_system.addEventListener(this.messaging_system.events.CanvasMouseDown, new EventListener(this, this.mouseDown));
		this.messaging_system.addEventListener(this.messaging_system.events.CanvasFocusOut, new EventListener(this, this.focusOut));
		this.messaging_system.addEventListener(this.messaging_system.events.CanvasImageClick, new EventListener(this, this.click));
		this.messaging_system.addEventListener(this.messaging_system.events.CanvasImageDoubleClick, new EventListener(this, this.doubleClick));
		this.messaging_system.addEventListener(this.messaging_system.events.CanvasKeyDown, new EventListener(this, this.keyDown));

		this.messaging_system.addEventListener(this.messaging_system.events.MouseModeChanged, new EventListener(this, this.mouseModeChanged));
	};
	/*CanvasMouseHandler.MouseModes = {
		SelectionMode:"SelectionMode",
		ViewEditMode:"ViewEditMode",
		DragMode:"DragMode",
		CoordinateClickMode:"CoordinateClickMode",
		AutoDetectDigitMode:"AutoDetectDigitMode"
	};*/
	CanvasMouseHandler.MouseModes = {
		EditMode: "EditMode",
		CanvasMode: "CanvasMode",
		MoveMode: "MoveMode",
		Other: "Other"
	};
	CanvasMouseHandler.prototype.canvasScrolled = function(signal, data){
		var evt = data.event_data;
		var delta = evt.wheelDelta?evt.wheelDelta/40:evt.detail?-evt.detail : 0;
		var factor = 0;
		if(delta > 0){
			factor = 9/10;
		}else{
			factor = 10/9;
		}
		var mouse_coordinate = this.canvas.getTransformation().transformCanvasCoordinateToRelativeImageCoordinate(data.getCoordinate());
		this.canvas.getTransformation().setScale(this.canvas.getTransformation().getScale()*factor, mouse_coordinate);
		this.canvas.updateCanvas(signal, data);
		return data.event_data.preventDefault() && false;
	};
	CanvasMouseHandler.prototype.mouseMove = function(signal, data){
		console.log("move!");
		if(this.mouse_down){
			this.mouse_dragged = true;
		}
		switch(this.current_mouse_mode){
		case CanvasMouseHandler.MouseModes.EditMode:
			if(this.mouse_down){
				//check if inside a digit -> select that digit
				//if not inside digit, but near the selected digit -> select nearest corner of that digit and drag it (only if mouse has been down for more than 0.5 s)
				//else: try to add a new digit to the currently selected digit group (if none is selected, don't do anything)
			}
			break;
		case CanvasMouseHandler.MouseModes.CanvasMode:
			//move canvas
			break;
		case CanvasMouseHandler.MouseModes.MoveMode:
			//move selected digits at once
			
			break;
		case CanvasMouseHandler.MouseModes.Other:
			//let another handler handle these events
			break;
		/*
			case CanvasMouseHandler.MouseModes.ViewEditMode:
				if(this.mouse_down){
					var mv = new Coordinate(
						this.canvas.getTransformation().getCanvasWidth() / 2 - (data.getCoordinate().getX() - this.previous_mouse_coordinate.getX()),
						this.canvas.getTransformation().getCanvasHeight() / 2 - (data.getCoordinate().getY() - this.previous_mouse_coordinate.getY())
					);
					var transformed = this.canvas.getTransformation().transformCanvasCoordinateToRelativeImageCoordinate(mv);
					this.canvas.getTransformation().setCanvasCenter(transformed);
					this.canvas.updateCanvas(signal, data);
				}
				break;
			case CanvasMouseHandler.MouseModes.SelectionMode:
				if(this.mouse_down){
					this.updateSelection(data);
				}
				break;
			case CanvasMouseHandler.MouseModes.DragMode:
				if(this.mouse_down){
					var mv = new Coordinate(data.getCoordinate().getX()-this.previous_mouse_coordinate.getX(), data.getCoordinate().getY()-this.previous_mouse_coordinate.getY());
					var transformed = this.canvas.getTransformation().transformCanvasTranslationToRelativeImageTranslation(mv);
					this.messaging_system.fire(this.messaging_system.events.ObjectsMoved, new ObjectsMovedEvent(this.canvas.view.getCurrentSelectionTree(), transformed));
				}
				break;
			case CanvasMouseHandler.MouseModes.AutoDetectDigitMode:
				if(this.mouse_down){
					this.selection_rectangle.updateSelection(data.getCoordinate());
					this.autoDetectDigit(signal, data);
					this.canvas.updateCanvas();
				}
				break;*/
		}
		this.previous_mouse_coordinate = data.getCoordinate();
		
	};
	CanvasMouseHandler.prototype.autoDetectDigit = function(signal, data){
		var selection_rectangle = this.selection_rectangle.transformCanvasCoordinatesToAbsoluteCoordinates(this.canvas.getTransformation());
		var img = this.canvas.getImage();
		var top_left = selection_rectangle.getTopLeft();
		var bottom_right = selection_rectangle.getBottomRight();
		top_left.round();
		bottom_right.round();
		var image_part = new Array();
		var canvas = $('<canvas>')[0];
		var context = canvas.getContext("2d");
		canvas.width = img.width;
		canvas.height = img.height;
		context.mozImageSmoothingEnabled = false;
		context.webkitImageSmoothingEnabled = false;
		context.drawImage(img, 0, 0);
		var imageData = context.getImageData(0, 0, img.width, img.height);
		for(var i = top_left.getY(); i <= bottom_right.getY(); ++i){
			image_part.push(new Array());
			for(var j = top_left.getX(); j <= bottom_right.getX(); ++j){
				var index = (i * 4) * imageData.width + (j * 4);
				var r = imageData.data[index];
				var g = imageData.data[index + 1];
				var b = imageData.data[index + 2];
				var y = (r + g + b) / 3.0;
				image_part[parseInt(i-top_left.getY())].push(y);
			}
		}
		//this.messaging_system.fire(this.messaging_system.events.AutoDetectDigitAreaSelected, new AutoDetectDigitAreaSelectedEvent(image_part, top_left, this.canvas.getTransformation()));
		var corners = DigitDetector.digit_corners(image_part);
		console.log("corners: "+JSON.stringify(corners));
		if(corners == null){
			return;
		}
		//console.log(JSON.stringify(corners));
		//console.log("topleft = "+JSON.stringify(data.getTopLeft()));
		//console.log("generated transformed topleft = "+JSON.stringify(data.getTransformation().transformAbsoluteImageCoordinateToRelativeImageCoordinate(data.getTopLeft())));
		//console.log("generated transformed bottom right = "+JSON.stringify(data.getTransformation().transformAbsoluteImageCoordinateToRelativeImageCoordinate(data.getTopLeft().add(new Coordinate(data.getImage()[0].length, data.getImage().length)))));
		
		for(var index = 0; index < 4; ++index){
			var x = corners[index].x + top_left.getX();
			var y = corners[index].y + top_left.getY();
			//console.log("absolute image coordinate: x = "+x+" y = "+y);
			var coord = data.getTransformation().transformAbsoluteImageCoordinateToRelativeImageCoordinate(new Coordinate(x, y));
			//console.log("relative image coordinate: "+JSON.stringify(coord));
			//this.parent.content_elements[index].setCoordinate(coord.getX(), coord.getY());
			
		}
		//TODO: collect those four corners and send an event to add this digit to the selected group
		console.log("TODO: collect those four corners and send an event to add this digit to the selected group");
	};
	CanvasMouseHandler.prototype.mouseUp = function(signal, data){
		if(!this.mouse_down){
			return;
		}
		this.mouse_down = false;
		var mouse_release_time = new Date();
		var time_down = mouse_release_time.getTime() - this.mouse_down_time.getTime();
		switch(this.current_mouse_mode){
		case CanvasMouseHandler.MouseModes.EditMode:
			this.selection_rectangle.updateSelection(data.getCoordinate());
			console.log("edit mode, down time = " + time_down);
			var DOWN_TIME = 100;
			if(!this.mouse_dragged || time_down <= DOWN_TIME){
				console.log("first!");
				var res = this.canvas.getObjectAroundCanvasCoordinate(data.getCoordinate());
				if(res){
					var e = new SelectionEvent(res.getProxy().getSelectionTree());
					this.messaging_system.fire(this.messaging_system.events.SelectionSet, e);
				}
				//pretend it was a click -> if inside digit -> select it
			}else{
				console.log("tried to move a corner of a digit, a dot or tried to auto-detect a digit/a series of dots in a region");
				this.autoDetectDigit(signal, data);
				this.selection_rectangle.stopSelection();
				//this.messaging_system.fire(this.messaging_system.events.MouseModeChanged, new MouseModeChangedEvent(null));
			}
			break;
		case CanvasMouseHandler.MouseModes.CanvasMode:
			break;
		case CanvasMouseHandler.MouseModes.MoveMode:
			break;
		case CanvasMouseHandler.MouseModes.Other:
			break;
			case CanvasMouseHandler.MouseModes.SelectionMode:
				this.stopSelection(data);
				break;
			case CanvasMouseHandler.MouseModes.AutoDetectDigitMode:
				this.selection_rectangle.updateSelection(data.getCoordinate());
				this.autoDetectDigit(signal, data);
				this.selection_rectangle.stopSelection();
				this.messaging_system.fire(this.messaging_system.events.MouseModeChanged, new MouseModeChangedEvent(null));
				break;
		}
	};
	CanvasMouseHandler.prototype.mouseDown = function(signal, data){
		this.mouse_down = true;
		this.mouse_dragged = false;
		this.mouse_down_time = new Date();
		this.previous_mouse_coordinate = data.getCoordinate();
		switch(this.current_mouse_mode){
		case CanvasMouseHandler.MouseModes.EditMode:
			this.selection_rectangle.startSelection(data.getCoordinate());
			console.log("edit mode!");
			break;
		case CanvasMouseHandler.MouseModes.SelectionMode:
			if(!data.getEventData().shiftKey && !data.getEventData().ctrlKey){
				this.messaging_system.fire(this.messaging_system.events.SelectionReset, null);
			}
			this.startSelection(data.getCoordinate());
			break;
		case CanvasMouseHandler.MouseModes.AutoDetectDigitMode:
			this.selection_rectangle.startSelection(data.getCoordinate());
			break;
		}
	};
	CanvasMouseHandler.prototype.focusOut = function(signal, data){
		this.mouse_down = false;
	};
	CanvasMouseHandler.prototype.click = function(signal, data){
	};
	CanvasMouseHandler.prototype.doubleClick = function(signal, data){
		var res = this.canvas.getObjectAroundCanvasCoordinate(data.getCoordinate());
		//inside digit -> select
		if(res){
			//this.toggleSelected(res);
			var e = new SelectionEvent(res.getProxy().getSelectionTree());
			this.messaging_system.fire(this.messaging_system.events.SelectionSet, e);
		}else{
		}
		//inside dot
	};
	CanvasMouseHandler.prototype.keyDown = function(signal, data){
		if(data.getEventData().which == 27){//escape
			this.messaging_system.fire(this.messaging_system.events.SelectionReset, null);
		}
	};
	CanvasMouseHandler.prototype.startSelection = function(coordinate){
		this.selection_rectangle.startSelection(coordinate);
	};
	CanvasMouseHandler.prototype.stopSelection = function(data){
		this.selection_rectangle.updateSelection(data.getCoordinate());
		var selected_tree = this.canvas.getSelectionTree(this.getSelectionRectangle());
		var selection_event = new SelectionEvent(selected_tree, false);
		if(data.getEventData().ctrlKey){//toggle selection
			this.messaging_system.fire(this.messaging_system.events.SelectionToggled, selection_event);
		}else if(data.getEventData().shiftKey){//add selection
			this.messaging_system.fire(this.messaging_system.events.SelectionAdded, selection_event);
		}else{//set selection
			this.messaging_system.fire(this.messaging_system.events.SelectionSet, selection_event);
		}
		this.selection_rectangle.stopSelection();
	};
	CanvasMouseHandler.prototype.updateSelection = function(data){
		this.selection_rectangle.updateSelection(data.getCoordinate());
		var selected_tree = this.canvas.getSelectionTree(this.getSelectionRectangle());
		var selection_event = new SelectionEvent(selected_tree, true);
		if(data.getEventData().ctrlKey){//toggle selection
			this.messaging_system.fire(this.messaging_system.events.SelectionToggled, selection_event);
		}else if(data.getEventData().shiftKey){//add selection
			this.messaging_system.fire(this.messaging_system.events.SelectionAdded, selection_event);
		}else{//set selection
			this.messaging_system.fire(this.messaging_system.events.SelectionSet, selection_event);
		}
		this.canvas.updateCanvas();
	};
	CanvasMouseHandler.prototype.getSelectionRectangle = function(){
		return this.selection_rectangle;
	};

	CanvasMouseHandler.prototype.mouseModeChanged = function(signal, data){
		if(data.getMode() == null){
			data.setMode(this.previous_mouse_mode);
			this.current_mouse_mode = this.previous_mouse_mode;
		}else{
			if(this.current_mouse_mode == data.getMode()){
				return;
			}
			this.previous_mouse_mode = this.current_mouse_mode;
			this.current_mouse_mode = data.getMode();
		}
		this.messaging_system.fire(this.messaging_system.events.MouseModeChanged, new MouseModeChangedEvent(this.current_mouse_mode));
	};
	return CanvasMouseHandler;
});