define(["../../../messaging_system/event_listener",
		"../../../model/coordinate"], 
		function(EventListener,
			Coordinate){
	//translates the canvas when draggin
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
	//pauses the handler when dragging is used for something else (display object dragging...)
	CanvasDragHandler.prototype.pauseCanvasDragging = function(){
		this.stopDragging();
		this.pause_level++;
	};
	//unpauses the handler
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
	return CanvasDragHandler;
});
