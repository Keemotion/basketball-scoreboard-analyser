define(["../../model/coordinate", 
	'../../messaging_system/event_listener', 
	'../../messaging_system/events/submit_group_details_event',
	'./canvas_single_click_listener'], 
	function(Coordinate, 
		EventListener, 
		SubmitGroupDetailsEvent,
		CanvasSingleClickListener){
	//Groups the coordinate of a corner together with a button to set the coordinate by clicking on the canvas
	var CornerDetailsContentView = function(target_view, data_proxy, messaging_system){
		var self = this;
		this.target_view = target_view;
		this.data_proxy = data_proxy;
		this.messaging_system = messaging_system;
		this.messaging_system.addEventListener(this.messaging_system.events.CoordinateClickListenerAdded, new EventListener(self, self.stopListening));
		this.canvasClickListener = new CanvasSingleClickListener(this, this.messaging_system);
		this.x_text = $('<input>')
			.val('');
		this.y_text = $('<input>')
			.val('');
		this.x_label = $('<label>').text('X');
		this.y_label = $('<label>').text('Y');
		this.click_button = $('<button>')
			.text('Click')
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
		this.form = $('<form>')
			.append(this.content_element)
			.submit(function(){
				var data = self.collectFormData();
				var identification = self.data_proxy.getIdentification();
				self.messaging_system.fire(self.messaging_system.events.SubmitGroupDetails, new SubmitGroupDetailsEvent(identification, data));
				return false;
			});
		this.target_view.append(this.form);
		this.loadContent();
        messaging_system.addEventListener(messaging_system.events.GroupChanged, new EventListener(this, this.groupChanged));
	};
    CornerDetailsContentView.prototype.groupChanged = function(signal, data){
        if(this.data_proxy.isPossiblyAboutThis(data.getTargetIdentification())){
            this.loadContent();
        }
    };
	//setCoordinate can by used by the CanvasClickListener
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
	//Collects all data about this corner in an Object that can be sent to the Messaging System
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
