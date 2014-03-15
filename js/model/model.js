define(["./state"], function(State){
	var Model = function(controller, messaging_system){
		this.messaging_system = messaging_system;
        this.current_state = new State(this.messaging_system);
	};
    Model.prototype.loadImage = function(url){
        this.image = url;
        this.messaging_system.fire(this.messaging_system.events.LoadImage, url);
    };
    Model.prototype.getState = function(){
        return this.current_state;
    };
    return Model;
});

