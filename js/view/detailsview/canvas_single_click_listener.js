define(["../../messaging_system/event_listener",
		"../canvas/handlers/canvas_mouse_handler",
		"../../messaging_system/events/mouse_mode_changed_event"],
	function(EventListener, CanvasMouseHandler, MouseModeChangedEvent){
		//Sets the coordinate of the parent view when the canvas is clicked
		var CanvasSingleClickListener = function(parentView, messaging_system){
			this.parentView = parentView;
			this.listening = false;
			this.messaging_system = messaging_system;
			this.clickListener = new EventListener(this, this.clickReceived);
			this.otherListenerStartedListener = new EventListener(this, this.stopListening);
			this.mouseModeChangedListener = new EventListener(this, this.mouseModeChanged);
			this.messaging_system.addEventListener(this.messaging_system.events.CanvasImageClick, this.clickListener);
			this.messaging_system.addEventListener(this.messaging_system.events.CoordinateClickListenerStarted, this.otherListenerStartedListener);
			this.messaging_system.addEventListener(this.messaging_system.events.MouseModeChanged, this.mouseModeChangedListener);
		};
		CanvasSingleClickListener.prototype.clickReceived = function(signal, data){
			if(this.listening == true){
				this.stopListening();
				this.parentView.setCoordinate(data.getRelativeImageCoordinate().getX(), data.getRelativeImageCoordinate().getY());
			}
		};
		CanvasSingleClickListener.prototype.startListening = function(){
			this.messaging_system.fire(this.messaging_system.events.MouseModeChanged, new MouseModeChangedEvent(CanvasMouseHandler.MouseModes.CoordinateClickMode));
			this.messaging_system.fire(this.messaging_system.events.CoordinateClickListenerStarted, null);

			this.listening = true;
			this.parentView.startedListening();
		};
		CanvasSingleClickListener.prototype.mouseModeChanged = function(signal, data){
			switch(data.getMode()){
				case CanvasMouseHandler.MouseModes.CoordinateClickMode:
					return;
				default:
					this.stopListening(signal, data, true);
			}
		};
		CanvasSingleClickListener.prototype.stopListening = function(signal, data, mouse_mode_remotely_changed){
			if(mouse_mode_remotely_changed == null){
				mouse_mode_remotely_changed = false;
			}
			if(this.listening && !mouse_mode_remotely_changed){
				this.messaging_system.fire(this.messaging_system.events.MouseModeChanged, new MouseModeChangedEvent(null));
			}
			this.listening = false;
			this.parentView.stoppedListening();
		};
		CanvasSingleClickListener.prototype.toggleListening = function(){
			if(this.listening){
				this.stopListening();
			}else{
				this.startListening();
			}
		};
		CanvasSingleClickListener.prototype.cleanUp = function(){
			this.stopListening();
			this.messaging_system.removeEventListener(this.messaging_system.events.CanvasImageClick, this.clickListener);
			this.messaging_system.removeEventListener(this.messaging_system.events.CoordinateClickListenerStarted, this.otherListenerStartedListener);
		};
		return CanvasSingleClickListener;
	});
