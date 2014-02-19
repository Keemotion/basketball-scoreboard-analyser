define(["../../model/coordinate", '../../messaging_system/event_listener'], function(Coordinate, EventListener){
	var CanvasClickListener = function(parentView, messaging_system){
		this.parentView = parentView;
		this.listening = false;
		this.messaging_system = messaging_system;
		this.clickListener = new EventListener(this ,this.clickReceived);
		this.otherListenerStartedListener = new EventListener(this, this.stopListening);
		this.messaging_system.addEventListener(this.messaging_system.events.CanvasImageClick, this.clickListener);
		this.messaging_system.addEventListener(this.messaging_system.events.CoordinateClickListenerStarted, this.otherListenerStartedListener);
	};
	CanvasClickListener.prototype.clickReceived = function(signal, data){
		if(this.listening == true){
			this.stopListening();
			this.parentView.setCoordinate(data.imageX, data.imageY);
		}
	};
	CanvasClickListener.prototype.startListening = function(){
		this.messaging_system.fire(this.messaging_system.events.CoordinateClickListenerStarted, null);
		this.listening = true;
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
	var CornerDetailsContentView = function(target_view, data_proxy, messaging_system){
		var self = this;
		this.target_view = target_view;
		this.data_proxy = data_proxy;
		this.messaging_system = messaging_system;
		this.messaging_system.addEventListener(this.messaging_system.events.CoordinateClickListenerAdded, new EventListener(self, self.stopListening));
		this.canvasClickListener = new CanvasClickListener(this, this.messaging_system);
		this.x_text = $('<input>')
			.val('');
		this.y_text = $('<input>')
			.val('');
		this.x_label = $('<label>').text('X');
		this.y_label = $('<label>').text('Y');
		this.click_button = $('<button>')
			.text('click')
			.attr({
				'class':'button_corner_coordinate_click'
			})
			.click(function(e){
				e.preventDefault();
				self.canvasClickListener.startListening();
			});
		this.content_element = $('<div>')
			.append(this.x_label)
			.append(this.x_text)
			.append($('<br>'))
			.append(this.y_label)
			.append(this.y_text)
			.append(this.click_button);
		this.target_view.append(this.content_element);
		this.loadContent();
	};
	CornerDetailsContentView.prototype.setCoordinate = function(x, y){
		this.x_text.val(x);
		this.y_text.val(y);
		this.content_element.closest('form').submit();
	};
	CornerDetailsContentView.prototype.stoppedListening = function(){		
		this.click_button.removeClass('active');
	};
	CornerDetailsContentView.prototype.startedListening = function(){
		this.click_button.addClass('active');
	};
	CornerDetailsContentView.prototype.update = function(){
		this.x_text.val(this.data_proxy.getX());
		this.y_text.val(this.data_proxy.getY());
	};
	CornerDetailsContentView.prototype.loadContent = function(){
		this.update();
	};
	CornerDetailsContentView.prototype.collectFormData = function(){
		var d = new Object();
		d.id = this.data_proxy.getId();
		d.name = this.data_proxy.getTitle();
		d.coordinate = new Coordinate(this.x_text.val(), this.y_text.val());
		return d;
	};
	CornerDetailsContentView.prototype.cleanUp = function(){
		this.canvasClickListener.cleanUp();
		this.messaging_system.removeEventListener(this.messaging_system.events.CoordinateClickListenerAdded, new EventListener(self, self.stopListening));
	};
	return CornerDetailsContentView;
});
