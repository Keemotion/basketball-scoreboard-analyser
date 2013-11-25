define(['../view/view', '../model/model', '../messaging_system/messaging_system', '../messaging_system/event_listener'], 
	function(View, Model, MessagingSystem, EventListener){
		var Controller = function (target_view){
			this.messaging_system = new MessagingSystem();
		    this.view = new View(this, target_view, this.messaging_system);
		    this.model = new Model(this, this.messaging_system);
		    this.messaging_system.addEventListener(this.messaging_system.events.LoadState, new EventListener(function(event, data){alert(JSON.stringify(data));}));
		};
        Controller.prototype.loadImage = function(url){
            this.model.loadImage(url);
        };
        return Controller;
    }
);
