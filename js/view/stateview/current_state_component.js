define(['../../messaging_system/event_listener'], function(EventListener){
	var CurrentStateComponent = function(target_view, state_proxy, messaging_system){
		this.messaging_system = messaging_system;
		this.state_proxy = state_proxy;
		this.target_view = target_view;
		this.text_area = $('<textarea>')
			.attr({
				'class':'txt_state'
			});
		this.download_json_btn = $('<a>').attr('download', 'config.json').text('Download JSON');
		this.download_rpm_btn = $('<a>').attr('download', 'config.rpm').text('Download RPM');
		this.target_view.append(this.text_area).append('<br>').append(this.download_json_btn).append('<br>').append(this.download_rpm_btn);
		this.loadComponent();
		this.messaging_system.addEventListener(this.messaging_system.events.StateChanged, new EventListener(this, this.stateChanged));
		//this.messaging_system.addEventListener(this.messaging_system.events.GroupChanged, new EventListener(this, this.stateChanged));
	};
	CurrentStateComponent.prototype.stateChanged = function(signal, data){
		this.loadComponent();
	};
	CurrentStateComponent.prototype.loadComponent = function(){
		var state_string = this.state_proxy.getStateString();
		var exported_string = this.state_proxy.getExportedString();
		this.text_area.text(state_string);	
		this.download_json_btn.attr('href', 'data:application/json,'+encodeURIComponent(state_string));
		this.download_rpm_btn.attr('href', 'data:text/plain,'+encodeURIComponent(exported_string));
	};
	CurrentStateComponent.prototype.setProxy = function(proxy){
		this.state_proxy = proxy;
		this.loadComponent();
	};
	return CurrentStateComponent;
});
