define(['../view/view', '../model/model', '../messaging_system/messaging_system', '../messaging_system/event_listener'], 
	function(View, Model, MessagingSystem, EventListener){
		return function Controller(target_view){
			this.messaging_system = new MessagingSystem();
		    this.v = new View(target_view, this.messaging_system);
		    this.m = new Model();
		    this.messaging_system.addEventListener(this.messaging_system.events.LoadState, new EventListener(function(event, data){alert(JSON.stringify(data));}));
		};
    }
);
