define(["../../../messaging_system/event_listener",
		"../../../model/coordinate",
		"../../../messaging_system/events/area_select_event",
		"../../../messaging_system/events/submit_group_details_event"
		], 
		function(EventListener,
			Coordinate,
			AreaSelectEvent,
			SubmitGroupDetailsEvent
			){
	//translates the canvas when draggin
	var CanvasDragHandler = function(canvas, transformation, messaging_system){
		this.canvas = canvas;
		this.messaging_system = messaging_system;
		this.transformation = transformation;
		this.pause_level = 0;
		this.messaging_system.addEventListener(this.messaging_system.events.CanvasMouseMove, new EventListener(this, this.canvasMouseMove));
		this.messaging_system.addEventListener(this.messaging_system.events.CanvasMouseDown, new EventListener(this, this.canvasMouseDown));
		this.messaging_system.addEventListener(this.messaging_system.events.CanvasMouseUp, new EventListener(this, this.canvasMouseUp));
		this.messaging_system.addEventListener(this.messaging_system.events.CanvasFocusOut, new EventListener(this, this.canvasFocusOut));
		this.current_state = CanvasDragHandler.states.NONE;
		this.area_selection_start_coordinate = new Coordinate();
		this.area_selection_end_coordinate = new Coordinate();
		this.selected_objects = new Array();
	};
	CanvasDragHandler.states = {NONE:'NONE', CANVAS_DRAGGING:'CANVAS_DRAGGING', OBJECTS_DRAGGING:'OBJECTS_DRAGGING', AREA_SELECTING:'AREA_SELECTING'};
	CanvasDragHandler.prototype.canvasMouseMove = function(signal, data){
		switch(this.current_state){
			case CanvasDragHandler.states.NONE:
				return;
				break;
			case CanvasDragHandler.states.AREA_SELECTING:
				this.area_selection_end_coordinate = data.getCoordinate();
				break;
			case CanvasDragHandler.states.OBJECTS_DRAGGING:
				this.moveObjects(data.getCoordinate());
				this.previous_dragging_coordinate = data.getCoordinate();
				break;
			case CanvasDragHandler.states.CANVAS_DRAGGING:
				var mv = new Coordinate(
						this.transformation.getCanvasWidth()/2 - (data.getCoordinate().getX()-this.previous_dragging_coordinate.getX()), 
						this.transformation.getCanvasHeight()/2- (data.getCoordinate().getY()-this.previous_dragging_coordinate.getY()));
				var transformed = this.transformation.transformCanvasCoordinateToRelativeImageCoordinate(mv);
				this.transformation.setCanvasCenter(transformed);
				this.previous_dragging_coordinate = data.getCoordinate();
				this.messaging_system.fire(this.messaging_system.events.ImageDisplayChanged, null);
				break;
		}
		return true;
	};
	CanvasDragHandler.prototype.moveObjects = function(coordinate){
		for(var i = 0; i < this.selected_objects.length; ++i){
			var data = this.selected_objects[i].getProxy().getData();
			if(!data.coordinate){
				continue;
			}
			var translation = new Coordinate(coordinate.getX()-this.previous_dragging_coordinate.getX(), coordinate.getY()-this.previous_dragging_coordinate.getY());
			var old_canvas_coordinate = this.transformation.transformRelativeImageCoordinateToCanvasCoordinate(data.coordinate);
			var new_canvas_coordinate = new Coordinate(old_canvas_coordinate.getX() + translation.getX(), old_canvas_coordinate.getY() + translation.getY());
			data.coordinate = this.transformation.transformCanvasCoordinateToRelativeImageCoordinate(new_canvas_coordinate);
			var identification = this.selected_objects[i].getProxy().getIdentification();
			this.messaging_system.fire(this.messaging_system.events.SubmitGroupDetails, new SubmitGroupDetailsEvent(identification, data));
		}
	};
	CanvasDragHandler.prototype.canvasMouseDown = function(signal, data){
		var event_data = data.getEventData();
		if(event_data.shiftKey){
			this.current_state = CanvasDragHandler.states.AREA_SELECTING;
			this.area_selection_start_coordinate = data.getCoordinate();
		}else if(event_data.ctrlKey){
			this.current_state = CanvasDragHandler.states.OBJECTS_DRAGGING;
			this.previous_dragging_coordinate = data.getCoordinate();
		}else{
			this.current_state = CanvasDragHandler.states.CANVAS_DRAGGING;
			this.previous_dragging_coordinate = data.getCoordinate();
		}
	};
	CanvasDragHandler.prototype.canvasMouseUp = function(signal, data){
		switch(this.current_state){
			case CanvasDragHandler.states.AREA_SELECTING:
				this.areaSelect();
				break;
			case CanvasDragHandler.states.OBJECTS_DRAGGING:
			case CanvasDragHandler.states.CANVAS_DRAGGING:
			default:
				break; 
		}
		this.current_state = CanvasDragHandler.states.NONE;
	};
	CanvasDragHandler.prototype.areaSelect = function(){
		var objects = this.canvas.getObjectsInRectangle(this.getSelectionStartCoordinate(), this.getSelectionEndCoordinate());
		this.setSelected(objects);
	};
	CanvasDragHandler.prototype.canvasFocusOut = function(signal, data){
		this.canvasMouseUp(signal, data);
	};	CanvasDragHandler.prototype.getSelected = function(){
		return this.selected_objects;
	};
	CanvasDragHandler.prototype.addSelected = function(obj){
		for(var i = 0; i < this.selected_objects.length; ++i){
			if(this.selected_objects[i].getProxy().isPossiblyAboutThis(obj.getProxy().getIdentification())){
				return;
			}
		}
		obj.setSelected(true);
		this.selected_objects.push(obj);
		this.messaging_system.fire(this.messaging_system.events.ImageDisplayChanged, null);
	};
	CanvasDragHandler.prototype.resetSelected = function(){
		for(var i = 0; i < this.selected_objects.length; ++i){
			this.selected_objects[i].setSelected(false);
		}
		this.selected_objects.length = 0;
	};
	CanvasDragHandler.prototype.setSelected = function(objects){
		this.resetSelected();
		for(var i = 0; i < objects.length; ++i){
			this.addSelected(objects[i]);
		}
	};
	CanvasDragHandler.prototype.getSelectionStartCoordinate = function(){
		return this.area_selection_start_coordinate;
	};
	CanvasDragHandler.prototype.getSelectionEndCoordinate = function(){
		return this.area_selection_end_coordinate;
	};
	CanvasDragHandler.prototype.getAreaSelecting = function(){
		return this.current_state == CanvasDragHandler.states.AREA_SELECTING;
	};
	return CanvasDragHandler;
});
