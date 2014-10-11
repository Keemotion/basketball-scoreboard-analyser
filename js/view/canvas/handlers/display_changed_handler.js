define(["../../../messaging_system/event_listener"], function(EventListener){
	//manages redrawing all display objects, because this takes a lot of time
	//when the last change was very recent, this class sets a time-out for redrawing everything (in case another change will happen soon)
	var DisplayChangedHandler = function(canvas){
		this.canvas = canvas;
		this.drawn = false;
		this.last_edit = 0;
		this.checkDraw();
		this.interval = 250;
	};
	//checks if the objects can be drawn or if it needs to wait some more time
	DisplayChangedHandler.prototype.checkDraw = function(){
		var self = this;
		var now = new Date().getTime();
		if(now - this.last_edit > this.interval && !this.drawn){
			this.drawn = true;
			this.canvas.drawCanvas();
		}else{
			setTimeout(function(){
				self.checkDraw();
			}, self.interval);
		}
	};
	//warns the handler that an edit has occurred, so the time-out can be set according to the event
	DisplayChangedHandler.prototype.fireEdited = function(){
		var self = this;
		this.drawn = false;
		this.last_edit = new Date().getTime();
		setTimeout(function(){
			self.checkDraw();
		}, self.interval);
	};
	DisplayChangedHandler.prototype.canBeDrawn = function(){
		return (new Date().getTime()) - this.last_edit > this.interval;
	};
	return DisplayChangedHandler;
});
