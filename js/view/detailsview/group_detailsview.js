define(
		[ "./digit_details_content_view", "./dot_details_content_view",
				"./group_details_content_view",
				"../../messaging_system/event_listener",
				"../../messaging_system/events/submit_group_details_event",
				"../../messaging_system/events/toggle_display_object_event",
				"../../messaging_system/events/add_element_event",
				"../../messaging_system/events/remove_group_event",
				"../../model/configuration_key" ],
		function(DigitDetailsContentView, DotDetailsContentView,
				GroupDetailsContentView, EventListener,
				SubmitGroupDetailsEvent, ToggleDisplayObjectEvent,
				AddElementEvent, RemoveGroupEvent, ConfigurationKey) {
			// Button to toggle display on canvas for this group object
			var HighlightButton = function(data_proxy, messaging_system) {
				var self = this;
				this.displaying = data_proxy.getDisplaying();
				this.visible_icon = $('<i>').addClass('fa fa-eye');
				this.invisible_icon = $('<i>').addClass('fa fa-eye-slash')
						.hide();
				this.element = $('<button>')
						.attr('type', 'button')
						// .text('highlight')
						// .addClass('btn-highlight'+(data_proxy.getDisplaying()?'
						// active':''))
						.addClass('btn btn-small btn-default')
						.click(
								function() {
									self.displaying = !self.displaying;
									if (self.displaying) {
										// self.element.addClass('active');
										self.visible_icon.show();
										self.invisible_icon.hide();
										self.element.attr('title', 'Hide');
									} else {
										// self.element.removeClass('active');
										self.visible_icon.hide();
										self.invisible_icon.show();
										self.element.attr('title', 'Show');
									}
									var target_identification = data_proxy
											.getIdentification();
									messaging_system
											.fire(
													messaging_system.events.ToggleDisplayObject,
													new ToggleDisplayObjectEvent(
															target_identification,
															self.displaying));
								}).append(this.visible_icon).append(
								this.invisible_icon);
			};
			// Button to add a subelement to this group
			var AddButton = function(data_proxy, messaging_system, type) {
				var self = this;
				this.element = $('<button>').addClass(
						'btn btn-small btn-default').attr('title', 'Add ' + type)
						.append($('<i>').addClass('fa fa-plus'))
						.click(
						function() {
							messaging_system.fire(
									messaging_system.events.AddElement,
									new AddElementEvent(type, data_proxy
											.getIdentification()));
							return false;
						});
			};
			// Groups all details data about this group in the GUI (also sub
			// elements: dots/corners/...)
			var GroupDetailsView = function(target_view, data_proxy,
					messaging_system) {
				var self = this;
				this.target_view = target_view;
				this.data_proxy = data_proxy;
				this.messaging_system = messaging_system;
				this.content_elements = new Array();
				this.element = $('<div>').attr({
					'class' : 'div_group_details'
				});
				this.title_input = $('<input>').attr({
					'type' : 'text',
					'name' : 'name'
				}).val(this.data_proxy.getTitle());
				this.title_form = $('<form>')
						.append($('<span>').text('Name: ')).append(
								this.title_input).append(
								$('<button>').attr({
									'type' : 'button'
								}).addClass('btn btn-small btn-default').attr(
										'title', 'Submit').append(
										$('<i>').addClass('fa fa-save')).click(
										function() {
											self.title_form.submit();
										})).submit(function(e) {
							self.submit();
							// var identification =
							// data_proxy.getIdentification();
							// var data = self.collectFormData();
							// messaging_system.fire(messaging_system.events.SubmitGroupDetails,
							// new SubmitGroupDetailsEvent(identification,
							// data));
							return false;
						});
				this.add_configuration_button = $('<button>').addClass(
							'btn btn-small btn-default').attr({
						'type' : 'button'
					}).attr('title', 'Add group configuration')
							.append($('<i>').addClass('fa fa-cog'))
							.click(function() {
								self.add_configuration(null, null);
								// self.submit();
							});
				this.highlight_button = new HighlightButton(this.data_proxy,
						this.messaging_system);
				this.add_digit_button = new AddButton(this.data_proxy,
						this.messaging_system, 'digit');
				this.add_dot_button = new AddButton(this.data_proxy,
						this.messaging_system, 'dot');
				this.controls_element = $('<div>').addClass('btn-group')
					.append(this.add_configuration_button)
					.append(this.highlight_button.element);
				if (data_proxy.getGroupType() == "digit") {
					this.controls_element.append(this.add_digit_button.element);
				} else if (data_proxy.getGroupType() == "dot") {
					this.controls_element.append(this.add_dot_button.element);
				}
				this.controls_element.append($('<button>').addClass(
						'btn btn-small btn-default').attr('title', 'Delete group')
						.append($('<i>').addClass('fa fa-times'))
						.attr(
						'type', 'button').click(
						function() {
							messaging_system.fire(
									messaging_system.events.RemoveGroup,
									new RemoveGroupEvent(self.data_proxy
											.getIdentification()));
							return false;
						}));
				this.content_element = $('<div>');
				this.configuration_element = $('<ul>');
				this.element.append(this.title_form).append(
						this.controls_element).append(
						this.configuration_element)
						.append(this.content_element);
				this.target_view.append(this.element);
				this.loadContent();
				this.groupChangedListener = new EventListener(this,
						this.groupChanged);
				this.messaging_system.addEventListener(
						this.messaging_system.events.GroupChanged,
						this.groupChangedListener);
			};
			// Collects all data about the current group in an Object that can
			// be sent to the Messaging System
			// this data does NOT include the children, the children have own
			// collectFormData methods
			GroupDetailsView.prototype.collectFormData = function() {
				var d = new Object();
				d.name = this.title_input.val();
				return d;
			};
			GroupDetailsView.prototype.add_configuration = function(key, value) {
				var self = this;
				var key_element = $('<select>').addClass('key-element').change(
						function() {
							self.submit();
						});
				var value_element;
				var keys = ConfigurationKey.getKeyOptions();
				for (var i = 0; i < keys.length; ++i) {
					key_element.append($('<option>').attr('value', keys[i])
							.text(keys[i]));
				}
				if (key != null) {
					key_element.val(key);
					var options = ConfigurationKey.getPossibleValues(key);
					if (options instanceof Array) {
						value_element = $('<select>');
						for (var i = 0; i < options.length; ++i) {
							value_element.append($('<option>').text(options[i])
									.attr('value', options[i]));
						}
					} else if (options == "numeric" || options == "text") {
						value_element = $('<input>');
					} else {
						value_element = $('<input>');
					}
				} else {
					value = "";
					value_element = $('<input>');
				}
				value_element.change(function() {
					self.submit();
				}).addClass('value-element').val(value);
				var li = $('<li>')
				// .text('configuration key: ')
				.append(key_element).append(value_element).append(
						$('<button>').addClass('btn btn-small btn-default')
								.text('x').click(function() {
									li.remove();
									self.submit();
								}));
				this.configuration_element.append(li);
				console.log(this.configuration_element.html());
			};
			// loads the details div
			// Only direct children are shown (children of subgroups are NOT
			// shown)
			GroupDetailsView.prototype.loadContent = function() {
				var self = this;
				var subnodes = this.data_proxy.getSubNodes();
				this.content_element.empty();
				this.title_input.val(this.data_proxy.getTitle());
				for(var i = 0; i < this.content_elements.length; ++i){
					this.content_elements[i].cleanUp();
				}
				this.content_elements.length = 0;
				for (var i = 0; i < subnodes.length; ++i) {
					var el;
					switch (subnodes[i].getType()) {
					case 'digit':
						el = new DigitDetailsContentView(this.content_element,
								subnodes[i], this.messaging_system);
						break;
					case 'dot':
						el = new DotDetailsContentView(this.content_element,
								subnodes[i], this.messaging_system);
						break;
					case 'group':
						el = new GroupDetailsContentView(this.content_element,
								subnodes[i], this.messaging_system);
						break;
					}
					this.content_elements.push(el);
				}
				var configuration_keys = this.data_proxy.getConfigurationKeys();
				this.configuration_element.empty();
				for ( var k in configuration_keys) {
					this.add_configuration(k, configuration_keys[k]);
				}
			};
			GroupDetailsView.prototype.submit = function() {
				var identification = this.data_proxy.getIdentification();
				var data = this.collectFormData();
				var configuration_keys = new Object();
				this.configuration_element.children('li').each(
						function() {
							configuration_keys[$(this).find('.key-element')
									.val()] = $(this).find('.value-element')
									.val();
						});
				data.configuration_keys = configuration_keys;
				this.messaging_system.fire(
						this.messaging_system.events.SubmitGroupDetails,
						new SubmitGroupDetailsEvent(identification, data));
			};
			// updates the content of the div when data about this group has
			// changed
			GroupDetailsView.prototype.groupChanged = function(signal, data) {
				if (this.data_proxy.isPossiblyAboutThis(data
						.getTargetIdentification())) {
					this.loadContent();
				}
			};
			GroupDetailsView.prototype.cleanUp = function() {
				this.messaging_system.removeEventListener(
						this.messaging_system.events.GroupChanged,
						this.groupChangedListener);
				for (var i = 0; i < this.content_elements.length; ++i) {
					this.content_elements[i].cleanUp();
				}
			};
			return GroupDetailsView;
		});
