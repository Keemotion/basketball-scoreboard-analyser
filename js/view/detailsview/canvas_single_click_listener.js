define(["../../messaging_system/event_listener"], function(EventListener){
	//Sets the coordinate of the parent view when the canvas is clicked
	var CanvasSingleClickListener = function(parentView, messaging_system){
		this.parentView = parentView;
		this.listening = false;
		this.messaging_system = messaging_system;
		this.clickListener = new EventListener(this ,this.clickReceived);
		this.otherListenerStartedListener = new EventListener(this, this.stopListening);
		this.messaging_system.addEventListener(this.messaging_system.events.CanvasImageClick, this.clickListener);
		this.messaging_system.addEventListener(this.messaging_system.events.CoordinateClickListenerStarted, this.otherListenerStartedListener);
	};
	CanvasSingleClickListener.prototype.clickReceived = function(signal, data){
		if(this.listening == true){
			this.stopListening();
			this.parentView.setCoordinate(data.getCoordinate().getX(), data.getCoordinate().getY());
		}
	};
	CanvasSingleClickListener.prototype.startListening = function(){
		this.messaging_system.fire(this.messaging_system.events.CoordinateClickListenerStarted, null);
		this.listening = true;
		this.parentView.startedListening();
	};
	CanvasSingleClickListener.prototype.stopListening = function(){
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
