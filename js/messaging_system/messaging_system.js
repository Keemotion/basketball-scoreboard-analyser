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
        LabelObjectClicked: 'LabelObjectClicked'
	});
	MessagingSystem.prototype.eventListeners = new Object();
	MessagingSystem.prototype.fire = function(signal, data){
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
	return MessagingSystem;
});
