define(["../../../messaging_system/event_listener", 
	"../../../messaging_system/events/submit_group_details_event", 
	"../../../messaging_system/events/object_selected_event",
	"../../../messaging_system/events/object_unselected_event"], function(EventListener, SubmitGroupDetailsEvent, ObjectSelectedEvent, ObjectUnSelectedEvent){
	//Translate objects when they are dragged on the canvas
	var CanvasObjectDragHandler = function(canvas, messaging_system){
		console.log("step 1");
		this.canvas = canvas;
		this.messaging_system = messaging_system;
		this.selected_objects = new Array();
		this.messaging_system.addEventListener(this.messaging_system.events.CanvasMouseDown, new EventListener(this, this.mouseDown));
		this.messaging_system.addEventListener(this.messaging_system.events.CanvasMouseUp, new EventListener(this, this.endDrag));
		this.messaging_system.addEventListener(this.messaging_system.events.CanvasMouseMove, new EventListener(this, this.mouseMove));
		this.messaging_system.addEventListener(this.messaging_system.events.CanvasFocusOut, new EventListener(this, this.endDrag));
		this.messaging_system.addEventListener(this.messaging_system.events.CanvasImageClick, new EventListener(this, this.click));
		this.clicked();
		console.log("testj");
		this.mouse_down = 0;
	};
	//returns the object that's being dragged
	CanvasObjectDragHandler.prototype.getSelected = function(){
		return this.selected_objects;
	};
	CanvasObjectDragHandler.prototype.addSelected = function(object){
		if(object == null)
			return;
		this.selected_objects.push(object);
		this.messaging_system.fire(this.messaging_system.events.ObjectSelected, new ObjectSelectedEvent(object.getProxy().getIdentification()));
	};
	CanvasObjectDragHandler.prototype.resetSelected = function(){
		for(var i = 0; i < this.selected_objects.length; ++i){
			this.messaging_system.fire(this.messaging_system.events.ObjectUnSelected, new ObjectUnSelectedEvent(this.selected_objects[i].getProxy().getIdentification()));
		}
		this.selected_objects.length = 0;
	};
	//sets the object that's being dragged
	CanvasObjectDragHandler.prototype.setSelected = function(objects){
		this.resetSelected();
		for(var i = 0; i < objects.length; ++i){
			this.addSelected(objects[i]);
		}
	};
	CanvasObjectDragHandler.prototype.mouseDown = function(signal, data){
		++this.mouse_down;
		var event_data = data.getEventData();
		if(!event_data.ctrlKey && !event_data.shiftKey){
			return;
		}
		
		if(!event_data.shiftKey){
			this.resetSelected();
		}
		this.addSelected(this.canvas.getObjectAtCanvasCoordinate(data.getCoordinate(), 64));
		this.startObjectDragging(data);
	};
	CanvasObjectDragHandler.prototype.startObjectDragging = function(data){
		this.prev_coordinate = data.getCoordinate();
		this.messaging_system.fire(this.messaging_system.events.StartObjectDragging, null);
	};
	CanvasObjectDragHandler.prototype.stopObjectDragging = function(){
		this.messaging_system.fire(this.messaging_system.events.StopObjectDragging, null);
	};
	CanvasObjectDragHandler.prototype.mouseMove = function(signal, data){
		if(!this.mouse_down){
			return;
		}
		if(data.event_data.shiftKey){
			//add objects to selected
			
		}else if(data.event_data.ctrlKey){
			this.updateObjectsCoordinate(this.canvas.getTransformation().transformCanvasCoordinateToRelativeImageCoordinate(data.getCoordinate()));
		}
	};
	CanvasObjectDragHandler.prototype.updateObjectsCoordinate = function(coordinate){
		for(var i = 0; i < this.getSelected().length; ++i){
			var data = this.getSelected()[i].getProxy().getData();
			data.coordinate = coordinate;
			this.messaging_system.fire(this.messaging_system.events.SubmitGroupDetails, new SubmitGroupDetailsEvent(this.getSelected()[i].getProxy().getIdentification(), data));
		}
	};
	//mouse up, lose focus, mouse out...
	CanvasObjectDragHandler.prototype.endDrag = function(signal, data){
		this.mouse_down = 0;
		this.resetSelected();
		this.stopObjectDragging();
	};
	CanvasObjectDragHandler.prototype.clicked = function(signal, data){
		console.log("clicked!");
	};
	return CanvasObjectDragHandler;
});
