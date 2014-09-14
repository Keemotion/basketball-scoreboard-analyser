define(["../../messaging_system/event_listener",
	"../canvas/handlers/canvas_mouse_handler",
	"../../messaging_system/events/mouse_mode_changed_event",
	"../../image_processing/digit_detector",
	"../../model/coordinate"],
	function(EventListener,
		CanvasMouseHandler,
		MouseModeChangedEvent,
		DigitDetector,
		Coordinate){
	var DigitDetectListener = function(parent, messaging_system){
		this.parent = parent;
		this.messaging_system = messaging_system;
		this.started = false;
		this.listener = false;
	};
	DigitDetectListener.prototype.startListening = function(){
		if(this.started){
			return;
		}
		this.started = true;
		this.listener = new EventListener(this, this.areaSelected);
		this.messaging_system.fire(this.messaging_system.events.MouseModeChanged, new MouseModeChangedEvent(CanvasMouseHandler.MouseModes.AutoDetectDigitMode))
		this.messaging_system.addEventListener(this.messaging_system.events.AutoDetectDigitAreaSelected, this.listener);

		this.mouseModeChangedListener = new EventListener(this, this.mouseModeChanged);
		this.messaging_system.addEventListener(this.messaging_system.events.MouseModeChanged, this.mouseModeChangedListener);
	};
	DigitDetectListener.prototype.stopListening = function(){
		if(!this.started){
			return;
		}
		this.parent.stopDetecting();
		this.started = false;
		
		this.messaging_system.removeEventListener(this.messaging_system.events.AutoDetectDigitAreaSelected, this.listener);
		this.messaging_system.removeEventListener(this.messaging_system.events.MouseModeChanged, this.mouseModeChangedListener);
	};
	DigitDetectListener.prototype.cleanUp = function(){
		this.stopListening();
	};
	DigitDetectListener.prototype.areaSelected = function(signal, data){
		var corners = DigitDetector.digit_corners(data.getImage());
		if(corners == null){
			return;
		}
		//console.log(JSON.stringify(corners));
		//console.log("topleft = "+JSON.stringify(data.getTopLeft()));
		//console.log("generated transformed topleft = "+JSON.stringify(data.getTransformation().transformAbsoluteImageCoordinateToRelativeImageCoordinate(data.getTopLeft())));
		//console.log("generated transformed bottom right = "+JSON.stringify(data.getTransformation().transformAbsoluteImageCoordinateToRelativeImageCoordinate(data.getTopLeft().add(new Coordinate(data.getImage()[0].length, data.getImage().length)))));
		
		for(var index = 0; index < 4; ++index){
			var x = corners[index].x + data.getTopLeft().getX();
			var y = corners[index].y + data.getTopLeft().getY();
			//console.log("absolute image coordinate: x = "+x+" y = "+y);
			var coord = data.getTransformation().transformAbsoluteImageCoordinateToRelativeImageCoordinate(new Coordinate(x, y));
			//console.log("relative image coordinate: "+JSON.stringify(coord));
			this.parent.content_elements[index].setCoordinate(coord.getX(), coord.getY());
		}
		//this.stopListening();
	};
	DigitDetectListener.prototype.mouseModeChanged = function(signal, data){
		this.stopListening();
	};
	return DigitDetectListener;
});