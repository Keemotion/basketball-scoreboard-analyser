define(["../../messaging_system/event_listener"], function(EventListener){
	//sets coordinates for consecutive clicks on the canvas
	var CanvasMultipleClickListener = function(parentView, messaging_system, clicks_amount){
		this.clicks_amount = clicks_amount;
		this.parentView = parentView;
		this.listening = false;
		this.index = 0;
		this.messaging_system = messaging_system;
		this.clickListener = new EventListener(this ,this.clickReceived);
		this.otherListenerStartedListener = new EventListener(this, this.stopListening);
		this.messaging_system.addEventListener(this.messaging_system.events.CanvasImageClick, this.clickListener);
		this.messaging_system.addEventListener(this.messaging_system.events.CoordinateClickListenerStarted, this.otherListenerStartedListener);
	};
	CanvasMultipleClickListener.prototype.clickReceived = function(signal, data){
		if(this.listening == true){
			this.parentView.content_elements[this.index].setCoordinate(data.getCoordinate().getX(), data.getCoordinate().getY());
			++this.index;
			if(this.index== this.clicks_amount){
				this.stopListening();
			}
		}
	};
	CanvasMultipleClickListener.prototype.toggleListening = function(){
		if(this.listening){
			this.stopListening();
		}else{
			this.startListening();
		}
	};
	CanvasMultipleClickListener.prototype.startListening = function(){
		this.messaging_system.fire(this.messaging_system.events.CoordinateClickListenerStarted, null);
		this.listening = true;
		this.index = 0;
		this.parentView.startedListening();
	};
	CanvasMultipleClickListener.prototype.stopListening = function(){
		this.listening = false;
		this.parentView.stoppedListening();
	};
	CanvasMultipleClickListener.prototype.cleanUp = function(){
		this.stopListening();
		this.messaging_system.removeEventListener(this.messaging_system.events.CanvasImageClick, this.clickListener);
		this.messaging_system.removeEventListener(this.messaging_system.events.CoordinateClickListenerStarted, this.otherListenerStartedListener);
	};
	return CanvasMultipleClickListener;
});
