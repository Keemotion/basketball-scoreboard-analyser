define(["../../../messaging_system/event_listener", "../../../messaging_system/events/submit_group_details_event"], function(EventListener, SubmitGroupDetailsEvent){
	//Translate objects when they are dragged on the canvas
	var CanvasObjectDragHandler = function(canvas, messaging_system){
		this.canvas = canvas;
		this.messaging_system = messaging_system;
		this.setSelected(null);
		this.messaging_system.addEventListener(this.messaging_system.events.CanvasMouseDown, new EventListener(this, this.mouseDown));
		this.messaging_system.addEventListener(this.messaging_system.events.CanvasMouseUp, new EventListener(this, this.endDrag));
		this.messaging_system.addEventListener(this.messaging_system.events.CanvasMouseMove, new EventListener(this, this.mouseMove));
		this.messaging_system.addEventListener(this.messaging_system.events.CanvasFocusOut, new EventListener(this, this.endDrag));
	};
	//returns the object that's being dragged
	CanvasObjectDragHandler.prototype.getSelected = function(){
		return this.selected_object;
	};
	//sets the object that's being dragged
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
	return CanvasObjectDragHandler;
});
