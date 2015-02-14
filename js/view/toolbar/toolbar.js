define(
	[ '../../messaging_system/events/load_state_event',
		'../../messaging_system/event_listener',
		'../canvas/handlers/canvas_mouse_handler',
		'../../messaging_system/events/mouse_mode_changed_event',
		"../../messaging_system/events/add_element_event",
		"../../messaging_system/events/load_combined_images_event"],
	function(LoadStateEvent, EventListener, CanvasMouseHandler, MouseModeChangedEvent, AddElementEvent, LoadCombinedImagesEvent){
		var ToolBar = function(target_div, state_proxy, messaging_system){
			var self = this;
			this.target_div = target_div;
			this.messaging_system = messaging_system;
			this.state_proxy = state_proxy;

			// Mouse Mode: edition mode
			// Mouse Mode: canvas drag mode
			// Mouse Mode: selection mode
			this.target_div.addClass('btn-toolbar');
			this.edit_tool_btn = $('<button>')
				.attr({
					'title' : 'Edit/add digits and leds on the canvas',
					'data-toggle' : 'button'
				})
				.append($('<i>').addClass('fa fa-pencil-square-o'))
				.addClass('btn btn-default btn-view-mode')
				.click(
				function(){
					self.messaging_system
						.fire(
						self.messaging_system.events.MouseModeChanged,
						new MouseModeChangedEvent(
							CanvasMouseHandler.MouseModes.EditMode));
				}).button()
				.mouseup(function(){
					$(this).blur();
				});
			this.canvas_tool_btn = $('<button>')
				.attr({
					'title' : 'Move the image on the canvas',
					'data-toggle' : 'button'
				})
				.append($('<span>').addClass('glyphicon glyphicon-hand-up'))
				.addClass('btn btn-default btn-view-mode')
				.click(
				function(){
					self.messaging_system
						.fire(
						self.messaging_system.events.MouseModeChanged,
						new MouseModeChangedEvent(
							CanvasMouseHandler.MouseModes.CanvasMode));
				}).button()
				.mouseup(function(){
					$(this).blur();
				});
			this.selection_tool_btn = $('<button>')
				.append($('<span>').addClass('glyphicon glyphicon-plus'))
				.attr({
					'title' : 'Select objects',
					'data-toggle' : 'button'
				})
				.addClass('btn btn-default btn-view-mode')
				.click(
				function(){
					self.messaging_system
						.fire(
						self.messaging_system.events.MouseModeChanged,
						new MouseModeChangedEvent(
							CanvasMouseHandler.MouseModes.SelectionMode));
				}).button()
				.mouseup(function(){
					$(this).blur();
				});
			this.mouse_mode_btns = $('<div>').addClass('btn-group').attr(
				'data-toggle', 'buttons').append(
				this.edit_tool_btn)
				.append(this.canvas_tool_btn).append(
				this.selection_tool_btn);
			self.messaging_system.addEventListener(
				self.messaging_system.events.MouseModeChanged,
				new EventListener(this, this.mouseModeChanged));
			self.messaging_system.addEventListener(
				self.messaging_system.events.LineExtensionsSet,
				new EventListener(this, this.lineExtensionsSet)
			);
			this.edit_tool_btn.click();
			this.target_div.append(this.mouse_mode_btns);


			// load other image
			this.img_btn = $('<button>')
				.attr('title', 'Import a new image')
				.append($('<span>').addClass('glyphicon glyphicon-picture'))
				.append($('<span>').text(' Image')).addClass('btn btn-default').click(function(){
					var link = document.createElement('input');
					link.type = "file";
					$(link).attr('multiple', '');
					$(link).change(function(){
						self.imageChanged(link);
					});
					link.click();
				})
				.mouseup(function(){
					$(this).blur();
				});

			this.import_export_btns = $('<div>').addClass('btn-group');
			// load JSON
			this.load_json_btn = $('<button>').attr('title',
				'Import JSON file').append(
				$('<span>').addClass('glyphicon glyphicon-upload')).append(
				$('<span>').text(' JSON')).addClass('btn btn-default')
				.click(function(){
					var input = document.createElement('input');
					input.type = "file";
					$(input).change(function(){
						self.jsonFileChanged(input);
					});
					input.click();
				})
				.mouseup(function(){
					$(this).blur();
				});
			// load PRM
			this.load_prm_btn = $('<button>').attr('title',
				'Import PRM file').append(
				$('<i>').addClass('glyphicon glyphicon-upload')).append(
				$('<span>').text(' PRM')).addClass('btn btn-default')
				.click(function(){
					var input = document.createElement('input');
					input.type = "file";
					$(input).change(function(){
						self.prmFileChanged(input);
					});
					input.click();
				})
				.mouseup(function(){
					$(this).blur();
				});
			// export JSON
			this.download_json_btn = $('<button>').append(
				$('<i>').addClass('glyphicon glyphicon-download')).append(
				$('<span>').text(' JSON'))
				.attr('title', 'Download JSON').addClass(
				'btn btn-default').click(
				function(){
					var state_string = self.state_proxy
						.getStateString();
					var link = document.createElement('a');
					link.download = 'config.json';
					link.href = 'data:application/json,'
						+ encodeURIComponent(state_string);
					link.click();
				})
				.mouseup(function(){
					$(this).blur();
				});
			// export PRM
			this.download_prm_btn = $('<button>')
				.attr('title', 'Download PRM')
				.append($('<span>').addClass('glyphicon glyphicon-download'))
				.append($('<span>').text(' PRM'))
				.addClass('btn btn-default')
				.click(
				function(){
					var exported_string = self.state_proxy
						.getExportedString();
					var link = document.createElement('a');
					link.download = 'config.prm';
					link.href = 'data:text/plain,'
						+ encodeURIComponent(exported_string);
					link.click();
				})
				.mouseup(function(){
					$(this).blur();
				});
			this.import_export_btns.append(this.load_json_btn).append(
				this.load_prm_btn).append(this.download_json_btn)
				.append(this.download_prm_btn);
			this.target_div
				.append($('<div>').addClass('btn-group').append(this.img_btn))
				.append(this.import_export_btns);

			this.other_buttons = $('<div>').addClass('btn-group');
			// Autofocus
			this.autofocus_button = $('<button>').addClass(
				'btn btn-default').append(
				$('<i>').addClass('fa fa-bullseye')).attr('title',
				'Autofocus selected objects')
				.click(function(){
					self.messaging_system.fire(self.messaging_system.events.AutoFocusSelection, null);
				});
			this.other_buttons.append(this.autofocus_button);
			this.line_extensions_button = $('<button>')
				.addClass('btn btn-default')
				.append($('<i>').addClass('fa fa-minus'))
				.attr('title', 'Extend horizontal digit lines')
				.click(function(){
					self.messaging_system.fire(self.messaging_system.events.ToggleLineExtensions, null);
				})
				.mouseup(function(){
					$(this).blur();
				});
			this.other_buttons.append(this.line_extensions_button);
			this.target_div.append(this.other_buttons);

			this.other_fields = $('<div>').addClass('btn-group');
			this.image_name_field = $('<span>').text('');
			this.other_fields.append(this.image_name_field);
			this.other_fields.append($('<span>').html(' '));
			this.prm_file_field = $('<span>').text('');
			this.other_fields.append(this.prm_file_field);
			this.target_div.append(this.other_fields);

			//adding new elements to the tree
			this.new_elements_btns = $('<div>').addClass('btn-group pull-right');
			this.add_digit_element = $('<button>').attr({
				'type' : 'button',
				'data-toggle' : 'tooltip',
				'title' : "Add number"
			}).addClass('btn btn-default').click(
				function(){
					self.messaging_system.fire(
						self.messaging_system.events.AddElement,
						new AddElementEvent('group', self.state_proxy
							.getIdentification(), 'digit', true));
				}).append($('<span>').addClass('glyphicon glyphicon-plus'))
				.append($('<span>').text(' Number'));
			this.new_elements_btns.append(this.add_digit_element);
			this.add_dot_element = $('<button>').attr({
				'type' : 'button',
				'data-toggle' : 'tooltip',
				'title' : "Add leds group"
			}).addClass('btn btn-default').click(
				function(){
					self.messaging_system.fire(
						self.messaging_system.events.AddElement,
						new AddElementEvent('group', self.state_proxy
							.getIdentification(), 'dot', true));
				}).append($('<span>').addClass('glyphicon glyphicon-plus'))
				.append($('<span>').text(' Leds'));
			this.new_elements_btns.append(this.add_dot_element);
			this.add_configuration_key_element = $('<button>').attr({
				'type' : 'button',
				'data-toggle' : 'tooltip',
				'title' : "Add configuration key"
			}).addClass('btn btn-default').click(
				function(){
					self.messaging_system.fire(
						self.messaging_system.events.AddElement,
						new AddElementEvent('configuration_key',
							self.state_proxy.getIdentification()));
				}).append($('<span>').addClass('glyphicon glyphicon-plus'))
				.append($('<span>').text(' Configuration'));
			this.new_elements_btns.append(this.add_configuration_key_element);
			this.target_div.append(this.new_elements_btns);
		};

		ToolBar.prototype.mouseModeChanged = function(signal, data){
			this.edit_tool_btn.removeClass('active');
			this.canvas_tool_btn.removeClass('active');
			this.selection_tool_btn.removeClass('active');
			switch(data.getMode()){
				case CanvasMouseHandler.MouseModes.EditMode:
					this.edit_tool_btn.addClass('active');
					break;
				case CanvasMouseHandler.MouseModes.CanvasMode:
					this.canvas_tool_btn.addClass('active');
					break;
				case CanvasMouseHandler.MouseModes.SelectionMode:
					this.selection_tool_btn.addClass('active');
					break;
				default:
					break;
			}
		};
		ToolBar.prototype.lineExtensionsSet = function(signal, data){
			if(data.getValue()){
				this.line_extensions_button.addClass('active');
			}else{
				this.line_extensions_button.removeClass('active');
			}
		};
		ToolBar.prototype.extractFileName = function(path){
			return path.substr(path.lastIndexOf("\\")+1);
		};
		ToolBar.prototype.imageChanged = function(component){
			var self = this;
			var files = component.files;
			if(files.length == 1){
				var f = files[0];
				var reader = new FileReader();
				reader.onload = function(e){
					self.messaging_system.fire(
						self.messaging_system.events.LoadImage,
						reader.result);
					self.image_name_field.text("Image: " + self.extractFileName(component.value));
				};
				reader.readAsDataURL(f);
			}else if(files.length > 1){
				var all_files = new Array();
				for(var i = 0; i < files.length; ++i){
					var reader = new FileReader();
					reader.onload = function(e){
						all_files.push(this.result);
						if(all_files.length == files.length){
							self.messaging_system.fire(self.messaging_system.events.LoadCombinedImages, new LoadCombinedImagesEvent(all_files));
							console.log("all_files ready");
						}
					};
					reader.readAsDataURL(files[i]);
				}
				self.image_name_field.text("Image: combined");
			}
		};
		ToolBar.prototype.prmFileChanged = function(component){
			var self = this;
			var files = component.files;
			var f = files[0];
			var reader = new FileReader();
			reader.onload = function(e){
				self.messaging_system.fire(
					self.messaging_system.events.LoadStateFile,
					new LoadStateEvent(e.target.result));
				self.prm_file_field.text("File: "+self.extractFileName(component.value));
			};
			reader.readAsText(f);
		};
		ToolBar.prototype.jsonFileChanged = function(component){
			var self = this;
			var files = component.files;
			var f = files[0];
			var reader = new FileReader();
			reader.onload = function(e){
				self.messaging_system.fire(
					self.messaging_system.events.LoadState,
					new LoadStateEvent(e.target.result));
			};
			reader.readAsText(f);
		};
		ToolBar.prototype.setProxy = function(proxy){
			this.state_proxy = proxy;
		};
		return ToolBar;
	});