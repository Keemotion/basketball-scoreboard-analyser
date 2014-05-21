define(["../../../messaging_system/event_listener",
		"../../../model/coordinate", 
		"../../../messaging_system/events/area_select_event"], 
		function(EventListener,
			Coordinate,
			AreaSelectEvent){
	//translates the canvas when draggin
	var CanvasSelectHandler = function(transformation, messaging_system){
		this.selecting = false;
		
		this.start_coordinate = new Coordinate();
		this.end_coordinate = new Coordinate();
		
		this.messaging_system = messaging_system;
		this.messaging_system.addEventListener(this.messaging_system.events.CanvasMouseMove, new EventListener(this, this.canvasMouseMove));
		this.messaging_system.addEventListener(this.messaging_system.events.CanvasMouseDown, new EventListener(this, this.canvasMouseDown));
		this.messaging_system.addEventListener(this.messaging_system.events.CanvasMouseUp, new EventListener(this, this.canvasMouseUp));
		this.messaging_system.addEventListener(this.messaging_system.events.CanvasFocusOut, new EventListener(this, this.canvasFocusOut));
	};
	CanvasSelectHandler.prototype.canvasMouseMove = function(signal, data){
		if(!this.selecting)
			return true;
		var ev = data.event_data;
		this.end_coordinate = data.getCoordinate();
		this.messaging_system.fire(this.messaging_system.events.ImageDisplayChanged, null);
		return true;
	};
	CanvasSelectHandler.prototype.canvasMouseDown = function(signal, data){
		this.start_coordinate = data.getCoordinate();
		this.selecting = true;
	};
	CanvasSelectHandler.prototype.canvasMouseUp = function(signal, data){
		this.selecting = false;
		//select all items
		this.messaging_system.fire(this.messaging_system.events.AreaSelect, new AreaSelectEvent(this.start_coordinate, data.getCoordinate()));
	};
	CanvasSelectHandler.prototype.getSelecting = function(){
		return this.selecting;
	};
	CanvasSelectHandler.prototype.canvasFocusOut = function(signal, data){
		this.canvasMouseUp(signal, data);
	};
	return CanvasSelectHandler;
});
