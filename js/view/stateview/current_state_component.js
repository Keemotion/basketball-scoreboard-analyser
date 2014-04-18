define(['../../messaging_system/event_listener'], function(EventListener){
	//Provides buttons to export the current data
	var CurrentStateComponent = function(target_view, state_proxy, messaging_system){
		var self = this;
		this.messaging_system = messaging_system;
		this.state_proxy = state_proxy;
		this.target_view = target_view;
		//download data as JSON
		this.download_json_btn = $('<a>').attr('download', 'config.json').attr('href', '#').text('Download JSON').click(function(){
			var state_string = self.state_proxy.getStateString();
			self.download_json_btn.attr('href', 'data:application/json,'+encodeURIComponent(state_string));
		});
		//download data as PRM (the original file structure)
		this.download_prm_btn = $('<a>').attr('download', 'config.prm').attr('href', '#').text('Download PRM').click(function(){
			var exported_string =  self.state_proxy.getExportedString();
			self.download_prm_btn.attr('href', 'data:text/plain,'+encodeURIComponent(exported_string));
		});
		this.target_view.append(this.download_json_btn).append('<br>').append(this.download_prm_btn);
	};
	CurrentStateComponent.prototype.setProxy = function(proxy){
		this.state_proxy = proxy;
	};
	return CurrentStateComponent;
});
