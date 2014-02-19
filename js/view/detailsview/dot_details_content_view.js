define(["../../model/coordinate", "../../messaging_system/event_listener"],function(Coordinate, EventListener){
	
	var CanvasClickListener = function(parentView, messaging_system){
		this.parentView = parentView;
		this.listening = false;
		this.index = 0;
		this.messaging_system = messaging_system;
		this.clickListener = new EventListener(this ,this.clickReceived);
		this.otherListenerStartedListener = new EventListener(this, this.stopListening);
		this.messaging_system.addEventListener(this.messaging_system.events.CanvasImageClick, this.clickListener);
		this.messaging_system.addEventListener(this.messaging_system.events.CoordinateClickListenerStarted, this.otherListenerStartedListener);
	};
	CanvasClickListener.prototype.clickReceived = function(signal, data){
		if(this.listening == true){
			this.parentView.setCoordinate(data.imageX, data.imageY);
			this.stopListening();
		}
	};
	CanvasClickListener.prototype.startListening = function(){
		this.messaging_system.fire(this.messaging_system.events.CoordinateClickListenerStarted, null);
		this.listening = true;
		this.index = 0;
		this.parentView.startedListening();
	};
	CanvasClickListener.prototype.stopListening = function(){
		this.listening = false;
		this.parentView.stoppedListening();
	};
	CanvasClickListener.prototype.cleanUp = function(){
		this.messaging_system.removeEventListener(this.messaging_system.events.CanvasImageClick, this.clickListener);
		this.messaging_system.removeEventListener(this.messaging_system.events.CoordinateClickListenerStarted, this.otherListenerStartedListener);
	};
	var DotDetailsContentView = function(target_view, data_proxy, messaging_system){
		var self = this;
		this.messaging_system = messaging_system;
		this.target_view = target_view;
		this.content_elements = new Array();
		this.data_proxy = data_proxy;
		this.content_element= $('<div>')
			.append($('<span>').text('test'));
		this.title_span = $('<span>')
			.text('');
		this.canvasClickListener = null;
		this.canvasClickListener = new CanvasClickListener(this, this.messaging_system);
		this.click_button = $('<button>')
			.text('click to set dot')
			.attr({
				'class':'button_dot_coordinate_click'
			})
			.click(function(e){
				e.preventDefault();
				self.canvasClickListener.startListening();
			});
		this.x_text = $('<input>')
			.val('');
		this.y_text = $('<input>')
			.val('');
		this.x_label = $('<label>').text('X');
		this.y_label = $('<label>').text('Y');
		this.target_view
			.append(this.click_button)
			.append(this.content_element);
		this.loadContent();
	};
	DotDetailsContentView.prototype.loadContent = function(){
		var subnodes = this.data_proxy.getSubNodes();
		this.content_elements.length = 0;
		this.content_element.empty();
		this.title_span.text(this.data_proxy.getTitle());
		this.content_element.append(this.x_label)
			.append(this.x_text)
			.append($('<br>'))
			.append(this.y_label)
			.append(this.y_text);
		
	};
	DotDetailsContentView.prototype.stoppedListening = function(){
		this.click_button.removeClass('active');
	};
	DotDetailsContentView.prototype.startedListening = function(){
		this.click_button.addClass('active');
	};
	DotDetailsContentView.prototype.update = function(){
		this.title_span.text(this.data_proxy.getTitle());
		this.x_text.text(this.data_proxy.getCoordinate().getX());
		this.y_text.text(this.data_proxy.getCoordinate().getY());
	};
	DotDetailsContentView.prototype.collectFormData = function(){
		var d = new Object();
		d.id = this.data_proxy.getId();
		d.name = this.data_proxy.getTitle();
		d.type = this.data_proxy.getType();
		d.coordinate = new Coordinate(this.x_text.val(), this.y_text.val());
		return d;
	};
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
