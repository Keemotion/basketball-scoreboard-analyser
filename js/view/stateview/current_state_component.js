define(['../../messaging_system/event_listener'], function(EventListener){
	var CurrentStateComponent = function(target_view, state_proxy, messaging_system){
		this.messaging_system = messaging_system;
		this.state_proxy = state_proxy;
		this.target_view = target_view;
		this.text_area = $('<textarea>')
			.attr({
				'class':'txt_state'
			});
		this.target_view.append(this.text_area);
		this.loadComponent();
		this.messaging_system.addEventListener(this.messaging_system.events.StateChanged, new EventListener(this, this.stateChanged));
	};
	CurrentStateComponent.prototype.stateChanged = function(signal, data){
		this.loadComponent();
	};
	CurrentStateComponent.prototype.loadComponent = function(){
		this.text_area.text(this.state_proxy.getStateString());	
	};
	return CurrentStateComponent;
});
