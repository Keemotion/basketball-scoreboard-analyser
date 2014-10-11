define(["./corner_details_content_view",
		"../../messaging_system/event_listener",
		"../../messaging_system/events/submit_group_details_event",
		"../../messaging_system/events/remove_group_event",
		"./canvas_multiple_click_listener",
		"./digit_detect_listener"],
	function(CornerDetailsContentView, EventListener, SubmitGroupDetailsEvent, RemoveGroupEvent, CanvasMultipleClickListener, DigitDetectListener){
		//Groups all data about this digit
		var DigitDetailsContentView = function(target_view, data_proxy, messaging_system){
			var self = this;
			this.messaging_system = messaging_system;
			this.target_view = target_view;
			this.content_elements = new Array();
			this.data_proxy = data_proxy;

			this.title_div = $('<div>');
			this.collapse_button_collapse_icon = $('<i>').addClass('fa fa-toggle-up');
			this.collapse_button_expand_icon = $('<i>').addClass('fa fa-toggle-down').hide();
			this.collapse_button = $('<button>').addClass('btn btn-sm btn-default').click(function(){
				self.form.collapse('toggle');
			}).append(this.collapse_button_expand_icon)
				.append(this.collapse_button_collapse_icon);
			this.title_span = $('<span>')
				.text('');
			this.title_div.append(this.collapse_button)
				.append(this.title_span);

			this.content_element = $('<div>')
				.append($('<span>').text(''));

			this.configuration_element = $('<ul>');
			this.canvasClickListener = null;
			this.canvasClickListener = new CanvasMultipleClickListener(this, this.messaging_system, 4);
			this.digit_detect_listener = new DigitDetectListener(this, this.messaging_system);

			this.click_button = $('<button>')
				.addClass('btn btn-sm btn-default')
				.attr('title', 'Set digit by clicking on consecutive points on the image')
				.append($('<i>').addClass('fa fa-crosshairs'))
				.click(function(e){
					e.preventDefault();
					self.canvasClickListener.toggleListening();
					return false;
				});
			this.detect_button = $('<button>')
				.addClass('btn btn-sm btn-default')
				.attr('title', 'Auto-detect digit corners in selected area')
				.append($('<i>').addClass('fa fa-search'))
				.click(function(e){
					e.preventDefault();
					self.startDetecting();
					return false;
				});
			this.remove_button = $('<button>')
				.addClass('btn btn-sm btn-default')
				.attr('title', 'Delete digit')
				.append($('<i>').addClass('fa fa-times'))
				.attr({'type' : 'button'})
				.click(function(){
					messaging_system.fire(messaging_system.events.RemoveGroup, new RemoveGroupEvent(data_proxy.getIdentification()));
					return false;
				});
			this.toolbar = $('<div>').addClass('btn-group');
			this.toolbar
				.append(this.click_button)
				.append(this.detect_button)
				.append(this.remove_button);
			this.title_div.append(this.toolbar);

			this.form = $('<form>')
				.append(this.content_element)
				.append(this.configuration_element)
				.submit(function(){
					var data = self.collectFormData();
					var target = self.data_proxy.getIdentification();
					self.messaging_system.fire(self.messaging_system.events.SubmitGroupDetails, new SubmitGroupDetailsEvent(target, data));
					return false;
				}).collapse()
				.on('hide.bs.collapse', function(){
					self.collapse_button_collapse_icon.hide();
					self.collapse_button_expand_icon.show();
				})
				.on('show.bs.collapse', function(){
					self.collapse_button_collapse_icon.show();
					self.collapse_button_expand_icon.hide();
				});
			this.target_view
				.append(this.title_div)
				.append(this.form);
			this.loadContent();
			this.groupChangedListener = new EventListener(this, this.groupChanged);
			messaging_system.addEventListener(messaging_system.events.GroupChanged, this.groupChangedListener);
		};
		DigitDetailsContentView.prototype.startDetecting = function(){
			this.digit_detect_listener.startListening();
			this.detect_button.addClass('active');
		};
		DigitDetailsContentView.prototype.stopDetecting = function(){
			this.detect_button.removeClass('active');
		};
		DigitDetailsContentView.prototype.groupChanged = function(signal, data){
			if(this.data_proxy.isPossiblyAboutThis(data.getTargetIdentification())){
				this.loadContent();
			}
		};
		//Loads the details about this digit and its four corners
		DigitDetailsContentView.prototype.loadContent = function(){
			var subnodes = this.data_proxy.getSubNodes();
			this.content_elements.length = 0;
			this.content_element.empty();
			this.title_span.text(this.data_proxy.getTitle());

			this.configuration_element.empty();
			var configuration_keys = this.data_proxy.getConfigurationKeys();

			for(var k in configuration_keys){
				this.configuration_element.append($('<li>').text('configuration_key: ' + k + " = " + configuration_keys[k]));
			}
			for(var i = 0; i < 4; ++i){
				var el = new CornerDetailsContentView(this.content_element, subnodes[i], this.messaging_system);
				this.content_elements.push(el);
			}
		};
		DigitDetailsContentView.prototype.stoppedListening = function(){
			this.click_button.removeClass('active');
		};
		DigitDetailsContentView.prototype.startedListening = function(){
			this.click_button.addClass('active');
		};
		//Updates the shown data of the digit and the data of the four corners in the GUI
		DigitDetailsContentView.prototype.update = function(){
			this.title_span.text(this.data_proxy.getTitle());
			for(var i = 0; i < 4; ++i){
				this.content_elements[i].update();
			}
		};
		//Collects the data about this digit in an Object, including the data of the four corners
		DigitDetailsContentView.prototype.collectFormData = function(){
			var d = new Object();
			d.id = this.data_proxy.getId();
			d.name = this.data_proxy.getTitle();
			d.type = this.data_proxy.getType();
			d.corners = new Array();
			for(var i = 0; i < this.content_elements.length; ++i){
				d.corners.push(this.content_elements[i].collectFormData());
			}
			return d;
		};
		DigitDetailsContentView.prototype.cleanUp = function(){
			for(var i = 0; i < this.content_elements.length; ++i){
				this.content_elements[i].cleanUp();
			}
			this.canvasClickListener.cleanUp();
			this.digit_detect_listener.cleanUp();
			this.messaging_system.removeEventListener(this.messaging_system.events.GroupChanged, this.groupChangedListener);
		};
		return DigitDetailsContentView;
	});
