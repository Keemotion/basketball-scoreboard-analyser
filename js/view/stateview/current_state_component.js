define([
	'../../messaging_system/event_listener',
	'../canvas/handlers/canvas_mouse_handler',
	'../../messaging_system/events/mouse_mode_changed_event'
	], function(
		EventListener,
		CanvasMouseHandler,
		MouseModeChangedEvent){
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
		this.selection_tool_btn = $('<button>').text('Selection mode').addClass('btn-view-mode').click(function(){
			self.messaging_system.fire(self.messaging_system.events.MouseModeChanged, new MouseModeChangedEvent(CanvasMouseHandler.MouseModes.SelectionMode));
		});
		this.edit_view_tool_btn = $('<button>').text('View edit mode').addClass('btn-view-mode').click(function(){
			self.messaging_system.fire(self.messaging_system.events.MouseModeChanged, new MouseModeChangedEvent(CanvasMouseHandler.MouseModes.ViewEditMode));
		});
		this.drag_tool_btn = $('<button>').text('Drag mode').addClass('btn-view-mode').click(function(){
			self.messaging_system.fire(self.messaging_system.events.MouseModeChanged, new MouseModeChangedEvent(CanvasMouseHandler.MouseModes.DragMode));
		});
		this.target_view
			.append(this.download_json_btn)
			.append('<br>')
			.append(this.download_prm_btn)
			.append(this.selection_tool_btn)
			.append(this.edit_view_tool_btn)
			.append(this.drag_tool_btn);
		self.messaging_system.addEventListener(self.messaging_system.events.MouseModeChanged, new EventListener(this, this.mouseModeChanged));
	};
	CurrentStateComponent.prototype.setProxy = function(proxy){
		this.state_proxy = proxy;
	};
	CurrentStateComponent.prototype.mouseModeChanged = function(signal, data){
		this.selection_tool_btn.removeClass('active');
		this.edit_view_tool_btn.removeClass('active');
		this.drag_tool_btn.removeClass('active');
		switch(data.getMode()){
			case CanvasMouseHandler.MouseModes.SelectionMode:
				this.selection_tool_btn.addClass('active');
				break;
			case CanvasMouseHandler.MouseModes.ViewEditMode:
				this.edit_view_tool_btn.addClass('active');
				break;
			case CanvasMouseHandler.MouseModes.DragMode:
				this.drag_tool_btn.addClass('active');
				break;
			default:
				break;
		}
	};
	return CurrentStateComponent;
});
