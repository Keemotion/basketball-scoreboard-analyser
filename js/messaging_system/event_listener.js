define([],function(){
	var EventListener = function(invokeOn, func){
		this.eventFired = function(signal, data){
            console.log("event fired: "+signal+", data = "+data);
            func.call(invokeOn, signal, data);
        };
	};
	return EventListener;
});
