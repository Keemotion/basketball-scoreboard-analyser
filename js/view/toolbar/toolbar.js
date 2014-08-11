define(['../../messaging_system/events/load_state_event',
	'../../messaging_system/event_listener',
	'../canvas/handlers/canvas_mouse_handler',
	'../../messaging_system/events/mouse_mode_changed_event'], 
	function(LoadStateEvent,
			EventListener, 
			CanvasMouseHandler,
			MouseModeChangedEvent
	){
	var ToolBar = function(target_div, state_proxy, messaging_system){
		var self = this;
		this.target_div = target_div;
		this.messaging_system = messaging_system;
		this.state_proxy = state_proxy;
		//Mouse Mode: selection mode
		//Mouse Mode: view edit mode
		//Mouse Mode: drag mode
		this.selection_tool_btn = $('<button>')
			.attr('title', 'Add or remove objects to selection')
			.append($('<i>').addClass('fa fa-crosshairs'))
			.addClass('btn-view-mode')
			.click(function(){
				self.messaging_system.fire(self.messaging_system.events.MouseModeChanged, new MouseModeChangedEvent(CanvasMouseHandler.MouseModes.SelectionMode));
			});
		this.edit_view_tool_btn = $('<button>')
			.attr('title', 'Move the image on the canvas')
			.append($('<i>').addClass('fa fa-hand-o-up'))
			.addClass('btn-view-mode')
			.click(function(){
				self.messaging_system.fire(self.messaging_system.events.MouseModeChanged, new MouseModeChangedEvent(CanvasMouseHandler.MouseModes.ViewEditMode));
			});
		this.drag_tool_btn = $('<button>')
			.append($('<i>').addClass('fa fa-arrows'))
			.attr({
				'title':'Move selected objects'
			})
			.addClass('btn-view-mode')
			.click(function(){
				self.messaging_system.fire(self.messaging_system.events.MouseModeChanged, new MouseModeChangedEvent(CanvasMouseHandler.MouseModes.DragMode));
			});
		self.messaging_system.addEventListener(self.messaging_system.events.MouseModeChanged, new EventListener(this, this.mouseModeChanged));
		this.selection_tool_btn.click();
		this.target_div
			.append(this.selection_tool_btn)
			.append(this.edit_view_tool_btn)
			.append(this.drag_tool_btn);
		//load JSON
		this.load_json_btn = $('<button>')
			.attr('title', 'Import JSON file')
			.append($('<i>').addClass('fa fa-upload'))
			.append($('<span>').text('JSON'))
			.click(function(){
				var input = document.createElement('input');
				input.type = "file";
				$(input).change(function(){
					self.jsonFileChanged(input);
				});
				input.click();
			});
		//load PRM
		this.load_prm_btn = $('<button>')
			.attr('title', 'Import PRM file')
			.append($('<i>').addClass('fa fa-upload'))
			.append($('<span>').text('PRM'))
			.click(function(){
				var input = document.createElement('input');
				input.type = "file";
				$(input).change(function(){
					self.prmFileChanged(input);
				});
				input.click();
			})
		//export JSON
		this.download_json_btn = $('<button>')
			.append($('<i>').addClass('fa fa-download'))
			.append($('<span>').text('JSON'))
			.attr('title', 'Download JSON')
			.click(function(){
				var state_string = self.state_proxy.getStateString();
				var link = document.createElement('a');
				link.download = 'config.json';
				link.href = 'data:application/json,'+encodeURIComponent(state_string);
				link.click();
			});
		//export PRM
		this.download_prm_btn = $('<button>')
			.attr('title', 'Download PRM')
			.append($('<i>').addClass('fa fa-download'))
			.append($('<span>').text('PRM'))
			.click(function(){
				var exported_string =  self.state_proxy.getExportedString();
				var link = document.createElement('a');
				link.download = 'config.prm';
				link.href = 'data:text/plain,'+encodeURIComponent(exported_string);
				link.click();
		});
		//load other image
		//this.img_btn = $('<input>').attr('type', 'file')
		//	.change(function(){self.imageChanged();})
		//	.attr('id', 'btnLoadImage');
		this.img_btn = $('<button>')
			.attr('title', 'Import a new image')
			.append($('<i>').addClass('fa fa-image'))
			.click(function(){
				var link = document.createElement('input');
				link.type = "file";
				$(link).change(function(){
					self.imageChanged(link);
				});
				link.click();
			})
		this.target_div
			.append(this.load_json_btn)
			.append(this.load_prm_btn)
			.append(this.download_json_btn)
			.append(this.download_prm_btn)
			.append(this.img_btn);
		
		//reset canvas view
		//clear configuration
		//reset configuration
		this.reset_view_btn = $('<button>')
			.attr('title', 'Reset Canvas View')
			.append($('<i>').addClass('fa fa-eye'))
			.click(function(){
				self.messaging_system.fire(self.messaging_system.events.ResetCanvasView, null);
			});
		this.reset_state_btn = $('<button>')
			.attr('title', 'Reset configuration')
			.append($('<i>').addClass('fa fa-file-o'))
			.click(function(){
				self.messaging_system.fire(self.messaging_system.events.ResetState, null);
			});
		this.clear_state_btn = $('<button>')
			.attr('title', 'Clear configuration')
			.append($('<i>').addClass('fa fa-refresh'))
			.click(function(){
				self.messaging_system.fire(self.messaging_system.events.ClearState, null);
			});
		this.target_div
			.append(this.reset_view_btn)
			.append(this.reset_state_btn)
			.append(this.clear_state_btn);
	};
	
	ToolBar.prototype.mouseModeChanged = function(signal, data){
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
	ToolBar.prototype.imageChanged = function(component){
		var self = this;
		var files = component.files;
		var f = files[0];
		var reader = new FileReader();
		reader.onload = function(e){
			self.messaging_system.fire(self.messaging_system.events.LoadImage, reader.result);
		};
		reader.readAsDataURL(f);
	};
	ToolBar.prototype.prmFileChanged = function(component){
		var self = this;
		var files = component.files;
		var f = files[0];
		var reader = new FileReader();
		reader.onload = function(e){
			self.messaging_system.fire(self.messaging_system.events.LoadStateFile, new LoadStateEvent(e.target.result));
		};
		reader.readAsText(f);
	};
	ToolBar.prototype.jsonFileChanged = function(component){
		var self = this;
		var files = component.files;
		var f = files[0];
		var reader = new FileReader();
		reader.onload = function(e){
			self.messaging_system.fire(self.messaging_system.events.LoadState, new LoadStateEvent(e.target.result));
		};
		reader.readAsText(f);
	};
	ToolBar.prototype.setProxy = function(proxy){
		this.state_proxy = proxy;
	};
	return ToolBar;
});