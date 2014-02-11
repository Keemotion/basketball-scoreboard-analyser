define([],function(){
	var MessagingSystem = function(){
	};
	MessagingSystem.prototype.events = new Object({
		LoadState:'LoadState',
        LabelChanged:'LabelChanged',
        StateChanged:'StateChanged',
        LoadImage:'LoadImage',
        WindowResized:'WindowResized',
        ImageDisplayChanged:'ImageDisplayChanged',
        LabelObjectClicked: 'LabelObjectClicked',
		SubmitLabelObjectDetails: 'SubmitLabelObjectDetails',
		CanvasScrolled:'CanvasScrolled',
		CanvasMouseMove: 'CanvasMouseMove',
		CanvasMouseUp: 'CanvasMouseUp',
		CanvasMouseDown: 'CanvasMouseDown',
		CanvasFocusOut:'CanvasFocusOut',
		CanvasImageClick:'CanvasClick',
		CoordinateClickListenerStarted:'CoordinateClickListenerStarted',
		DisplayObjectsChanged:'DisplayObjectsChanged',
		ToggleDisplayObject:'ToggleDisplayObject'
	});
	MessagingSystem.prototype.eventListeners = new Object();
	MessagingSystem.prototype.fire = function(signal, data){
		if(!(signal in this.eventListeners)){
			return;
		}
		for(var i = 0; i < this.eventListeners[signal].length; ++i){
			this.eventListeners[signal][i].eventFired(signal, data);
		}
	};
	MessagingSystem.prototype.addEventListener = function(signal, listener){
		if(!(signal in this.eventListeners)){
			this.eventListeners[signal] = new Array();
		}
		this.eventListeners[signal].push(listener);
	};
	MessagingSystem.prototype.removeEventListener = function(signal, listener){
		if(!(signal in this.eventListeners))
			return;
		for(var i = 0; i < this.eventListeners[signal].length; ++i){
			if(this.eventListeners[signal][i] == listener){
				this.eventListeners[signal][i] = this.eventListeners[signal][this.eventListeners[signal].length-1];
				this.eventListeners[signal].pop();
				break;
			}
		}
	};
	return MessagingSystem;
});
