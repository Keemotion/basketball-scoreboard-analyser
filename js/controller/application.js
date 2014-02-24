define(['../view/view', '../model/model', '../messaging_system/messaging_system', '../messaging_system/event_listener'], 
	function(View, Model, MessagingSystem, EventListener){
		var Controller = function (target_view){
			this.messaging_system = new MessagingSystem();
		    this.model = new Model(this, this.messaging_system);
		    this.view = new View(this, target_view, this.messaging_system);
		};
        Controller.prototype.loadImage = function(url){
            this.model.loadImage(url);
        };
        Controller.prototype.getModel = function(){
            return this.model;
        };
        return Controller;
    }
);
