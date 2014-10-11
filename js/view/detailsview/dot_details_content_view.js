define(["../../model/coordinate",
		"../../messaging_system/event_listener",
		"../../messaging_system/events/submit_group_details_event",
		"../../messaging_system/events/remove_group_event",
		"./canvas_single_click_listener"],
	function(Coordinate, EventListener, SubmitGroupDetailsEvent, RemoveGroupEvent, CanvasSingleClickListener){
		//Groups all details data about a dot (coordinate, button to set the coordinate)
		var DotDetailsContentView = function(target_view, data_proxy, messaging_system){
			var self = this;
			this.messaging_system = messaging_system;
			this.target_view = target_view;
			this.content_elements = new Array();
			this.data_proxy = data_proxy;
			this.content_element = $('<div>')
				.append($('<span>').text('test'));
			this.title_span = $('<span>')
				.text('');
			this.canvasClickListener = null;
			this.canvasClickListener = new CanvasSingleClickListener(this, this.messaging_system);
			this.click_button = $('<button>')
				.addClass('btn btn-sm btn-default')
				.append($('<i>').addClass('fa fa-crosshairs'))
				.attr('title', 'Click on the image to set the led coordinate')
				.click(function(e){
					self.canvasClickListener.toggleListening();
					return false;
				});
			this.remove_button = $('<button>')
				.addClass('btn btn-sm btn-default')
				.attr('title', 'Delete dot')
				.append($('<i>').addClass('fa fa-times'))
				.attr('type', 'button')
				.click(function(){
					messaging_system.fire(messaging_system.events.RemoveGroup, new RemoveGroupEvent(data_proxy.getIdentification()));
					return false;
				});
			this.toolbar = $('<div>')
				.addClass('btn-group')
				.append(this.click_button)
				.append(this.remove_button)
			this.x_text = $('<input>')
				.val('');
			this.y_text = $('<input>')
				.val('');
			this.x_label = $('<label>').text('X');
			this.y_label = $('<label>').text('Y');

			this.form = $('<form>')
				.append(this.content_element)
				.submit(function(){
					var identification = data_proxy.getIdentification();
					var data = self.collectFormData();
					self.messaging_system.fire(self.messaging_system.events.SubmitGroupDetails, new SubmitGroupDetailsEvent(identification, data));
					return false;
				});
			this.target_view
				.append(this.form);
			this.loadContent();
			messaging_system.addEventListener(messaging_system.events.GroupChanged, new EventListener(this, this.groupChanged));
		};
		DotDetailsContentView.prototype.groupChanged = function(signal, data){
			if(this.data_proxy.isPossiblyAboutThis(data.getTargetIdentification())){
				this.loadContent();
			}
		};
		DotDetailsContentView.prototype.loadContent = function(){
			var subnodes = this.data_proxy.getSubNodes();
			this.content_elements.length = 0;
			this.content_element.empty();
			this.title_span.text(this.data_proxy.getTitle());
			this.content_element
				.append(this.title_span)
				.append(this.toolbar)
				.append($('<br>'))
				.append(this.x_label)
				.append(this.x_text)
				.append($('<br>'))
				.append(this.y_label)
				.append(this.y_text);
			this.update();
		};
		DotDetailsContentView.prototype.stoppedListening = function(){
			this.click_button.removeClass('active');
		};
		DotDetailsContentView.prototype.startedListening = function(){
			this.click_button.addClass('active');
		};
		DotDetailsContentView.prototype.update = function(){
			this.title_span.text(this.data_proxy.getTitle());
			this.x_text.val(this.data_proxy.getCoordinate().getX());
			this.y_text.val(this.data_proxy.getCoordinate().getY());
		};
		//Collects all data about this object in an Object that can be sent to the Messaging System
		DotDetailsContentView.prototype.collectFormData = function(){
			var d = new Object();
			d.id = this.data_proxy.getId();
			d.name = this.data_proxy.getTitle();
			d.type = this.data_proxy.getType();
			d.coordinate = new Coordinate(this.x_text.val(), this.y_text.val());
			return d;
		};
		//setCoordinate can be used by the Canvas Click Listener
		DotDetailsContentView.prototype.setCoordinate = function(x, y){
			this.x_text.val(x);
			this.y_text.val(y);
			this.content_element.closest('form').submit();
		};
		DotDetailsContentView.prototype.cleanUp = function(){
			this.canvasClickListener.cleanUp();
		};
		return DotDetailsContentView;
	});
