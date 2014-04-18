define(["../../../messaging_system/event_listener",
		"../../../model/coordinate"], 
		function(EventListener, 
			Coordinate){
	//provides some functionalities when hovering over the canvas
	//not used atm
	var CanvasHoverHandler = function(canvas, messaging_system){
		this.last_move = 0;
		this.canvas = canvas;
		this.interval = 100;
		this.cursor_position = new Coordinate(0,0);
		this.waiting = 0;
		messaging_system.addEventListener(messaging_system.events.CanvasMouseMove, new EventListener(this, this.mouseMoved));
	};
	CanvasHoverHandler.prototype.mouseMoved = function(signal, data){
		var self = this;
		this.waiting++;
		setTimeout(function(){self.displayHoveredObject();}, self.interval);
		this.cursor_position = data.getCoordinate();
	};
	CanvasHoverHandler.prototype.displayHoveredObject = function(){
		--this.waiting;
		if(this.waiting != 0)
			return;
		//TODO: do something in this method if needed
	};
	return CanvasHoverHandler;
});
