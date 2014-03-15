define(['../../messaging_system/event_listener'], function(EventListener){
	var CurrentStateComponent = function(target_view, state_proxy, messaging_system){
		var self = this;
		this.messaging_system = messaging_system;
		this.state_proxy = state_proxy;
		this.target_view = target_view;
		this.download_json_btn = $('<a>').attr('download', 'config.json').attr('href', '#').text('Download JSON').click(function(){
			var state_string = self.state_proxy.getStateString();
			self.download_json_btn.attr('href', 'data:application/json,'+encodeURIComponent(state_string));
		});
		this.download_rpm_btn = $('<a>').attr('download', 'config.rpm').attr('href', '#').text('Download RPM').click(function(){
			var exported_string =  self.state_proxy.getExportedString();
			self.download_rpm_btn.attr('href', 'data:text/plain,'+encodeURIComponent(exported_string));
		});
		this.target_view.append(this.download_json_btn).append('<br>').append(this.download_rpm_btn);
	};
	CurrentStateComponent.prototype.setProxy = function(proxy){
		this.state_proxy = proxy;
	};
	return CurrentStateComponent;
});
