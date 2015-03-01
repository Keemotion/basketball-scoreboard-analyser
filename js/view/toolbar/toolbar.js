define(
	[ '../../messaging_system/events/load_state_event',
		'../../messaging_system/event_listener',
		'../../messaging_system/events/mouse_mode_changed_event',
		"../../messaging_system/events/add_element_event",
		"../../messaging_system/events/load_combined_images_event",
		"../../messaging_system/events/grid_mode_changed_event",
		"../canvas/handlers/grid_handler",
		"../canvas/handlers/mouse_modes"],
	function(LoadStateEvent, EventListener, MouseModeChangedEvent, AddElementEvent, LoadCombinedImagesEvent, GridModeChangedEvent, GridHandler, MouseModes){
		var ToolBar = function(target_div, state_proxy, messaging_system){
			var self = this;
			this.target_div = target_div;
			this.messaging_system = messaging_system;
			this.state_proxy = state_proxy;

			// Mouse Mode: edition mode
			// Mouse Mode: canvas drag mode
			// Mouse Mode: selection mode
			// Mouse mode: grid mode
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
							MouseModes.EditMode));
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
							MouseModes.CanvasMode));
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
							MouseModes.SelectionMode));
				}).button()
				.mouseup(function(){
					$(this).blur();
				});
			this.grid_tool_btn = $('<button>')
				.append($('<span>').addClass('glyphicon glyphicon-th'))
				.attr({
					'title' : 'Edit grid',
					'data-toggle' : 'button'
				})
				.addClass('btn btn-default btn-view-mode')
				.click(function(){
					self.messaging_system.fire(self.messaging_system.events.MouseModeChanged,
					new MouseModeChangedEvent(MouseModes.GridMode));
				}).button()
				.mouseup(function(){
					$(this).blur();
				});
			this.mouse_mode_btns = $('<div>')
				.addClass('btn-group')
				.attr('data-toggle', 'buttons')
				.append(this.edit_tool_btn)
				.append(this.canvas_tool_btn)
				.append(this.selection_tool_btn)
				.append(this.grid_tool_btn);
			self.messaging_system.addEventListener(
				self.messaging_system.events.MouseModeChanged,
				new EventListener(this, this.mouseModeChanged));
			self.messaging_system.addEventListener(
				self.messaging_system.events.LineExtensionsSet,
				new EventListener(this, this.lineExtensionsSet)
			);
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
			this.toggle_grid_button = $('<button>')
				.addClass('btn btn-default')
				.append($('<i>').addClass('glyphicon glyphicon-th'))
				.attr('title', 'Toggle grid')
				.click(function(){
					self.messaging_system.fire(self.messaging_system.events.ToggleGrid, null);
				}).mouseup(function(){
					$(this).blur();
				});
			this.other_buttons.append(this.toggle_grid_button);
			this.target_div.append(this.other_buttons);
			this.addGridButtons();

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
			this.edit_tool_btn.click();

			this.messaging_system.addEventListener(this.messaging_system.events.GridEnabled, new EventListener(this, function(){
				this.toggle_grid_button.addClass('active');
			}));
			this.messaging_system.addEventListener(this.messaging_system.events.GridDisabled, new EventListener(this, function(){
				this.toggle_grid_button.removeClass('active');
			}));
			this.grid_mode_changed_listener = new EventListener(this, this.gridModeChanged);
			this.messaging_system.addEventListener(this.messaging_system.events.GridModeChanged, this.grid_mode_changed_listener);
		};
		ToolBar.prototype.gridModeChanged = function(signal, data){
			this.move_grid_button.removeClass('active');
			this.add_vertical_line_button.removeClass('active');
			this.add_horizontal_line_button.removeClass('active');
			switch(data.getGridMode()){
				case GridHandler.Modes.Default:
					this.move_grid_button.addClass('active');
					break;
				case GridHandler.Modes.AddHorizontalGridLine:
					this.add_horizontal_line_button.addClass('active');
					break;
				case GridHandler.Modes.AddVerticalGridLine:
					this.add_vertical_line_button.addClass('active');
					break
			}
		};
		ToolBar.prototype.mouseModeChanged = function(signal, data){
			this.edit_tool_btn.removeClass('active');
			this.canvas_tool_btn.removeClass('active');
			this.selection_tool_btn.removeClass('active');
			this.grid_tool_btn.removeClass('active');
			this.grid_buttons_div.hide();
			switch(data.getMode()){
				case MouseModes.EditMode:
					this.edit_tool_btn.addClass('active');
					break;
				case MouseModes.CanvasMode:
					this.canvas_tool_btn.addClass('active');
					break;
				case MouseModes.SelectionMode:
					this.selection_tool_btn.addClass('active');
					break;
				case MouseModes.GridMode:
					this.grid_tool_btn.addClass('active');
					this.grid_buttons_div.show();
					break;
				default:
					break;
			}
		};
		ToolBar.prototype.addGridButtons = function(){
			var self = this;
			this.grid_buttons_div = $('<div>').addClass('btn-group');
			this.move_grid_button = $('<button>')
				.addClass('btn btn-default')
				.append($('<i>').addClass('glyphicon glyphicon-move'))
				.attr('title', 'Drag grid corners')
				.click(function(){
					self.messaging_system.fire(self.messaging_system.events.GridModeChanged, new GridModeChangedEvent(GridHandler.Modes.Default));
				});
			this.add_vertical_line_button = $('<button>')
				.addClass('btn btn-default')
				.append($('<i>').addClass('glyphicon glyphicon-option-vertical'))
				.attr('title', 'Add vertical grid line')
				.click(function(){
					self.messaging_system.fire(self.messaging_system.events.GridModeChanged, new GridModeChangedEvent(GridHandler.Modes.AddVerticalGridLine));
				});
			this.add_horizontal_line_button = $('<button>')
				.addClass('btn btn-default')
				.append($('<i>').addClass('glyphicon glyphicon-option-horizontal'))
				.attr('title', 'Add horizontal grid line')
				.click(function(){
					self.messaging_system.fire(self.messaging_system.events.GridModeChanged, new GridModeChangedEvent(GridHandler.Modes.AddHorizontalGridLine));
				});
			this.clear_grid_button = $('<button>')
				.addClass('btn btn-default')
				.append($('<i>').addClass('glyphicon glyphicon-refresh'))
				.attr('title', 'Clear grid lines')
				.click(function(){
					self.messaging_system.fire(self.messaging_system.events.ClearGrid, null);
				});
			this.equal_spacing_grid_button = $('<button>')
				.addClass('btn btn-default')
				.append($('<i>').addClass('glyphicon glyphicon-menu-hamburger'))
				.attr('title', 'Equal spacing between grid lines')
				.click(function(){
					self.messaging_system.fire(self.messaging_system.events.EqualSpacingGridLines, null);
				});
			this.grid_buttons_div
				.append(this.move_grid_button)
				.append(this.add_horizontal_line_button)
				.append(this.add_vertical_line_button)
				.append(this.clear_grid_button)
				.append(this.equal_spacing_grid_button);
			this.target_div.append(this.grid_buttons_div);
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