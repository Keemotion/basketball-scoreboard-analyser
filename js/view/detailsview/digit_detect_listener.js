define(["../../messaging_system/event_listener",
	"../canvas/handlers/canvas_mouse_handler",
	"../../messaging_system/events/mouse_mode_changed_event",
	"../../image_processing/digit_detector"],
	function(EventListener,
		CanvasMouseHandler,
		MouseModeChangedEvent,
		DigitDetector){
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
		//console.log(JSON.stringify(data.getImage()));
		console.log(DigitDetector.digit_corners(data.getImage()));
		this.stopListening();
	};
	DigitDetectListener.prototype.mouseModeChanged = function(signal, data){
		this.stopListening();
	};
	return DigitDetectListener;
});