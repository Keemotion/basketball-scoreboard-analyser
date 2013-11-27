define([],function(){
	var EventListener = function(invokeOn, func){
		this.eventFired = function(signal, data){
            func.call(invokeOn, signal, data);
        };
	};
	return EventListener;
});
