define(["./corner_details_content_view", "../../messaging_system/event_listener"],function(CornerDetailsContentView, EventListener){
	var CanvasClickListener = function(parentView, messaging_system){
		this.parentView = parentView;
		this.listening = false;
		this.index = 0;
		this.messaging_system = messaging_system;
		this.messaging_system.addEventListener(this.messaging_system.events.CanvasImageClick, new EventListener(this ,this.clickReceived));
		this.messaging_system.addEventListener(this.messaging_system.events.CoordinateClickListenerStarted, new EventListener(this, this.stopListening));
	};
	CanvasClickListener.prototype.clickReceived = function(signal, data){
		if(this.listening == true){
			console.log("setting: "+data.imageX+", "+data.imageY);
			console.log("index = "+this.index);
			this.parentView.content_elements[this.index].setCoordinate(data.imageX, data.imageY);
			++this.index;
			if(this.index== 4){
				console.log("digit was 4");
				this.stopListening();
			}
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
	var DigitDetailsContentView = function(target_view, data_proxy, messaging_system){
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
			.text('click to set digit')
			.attr({
				'class':'button_digit_coordinate_click'
			})
			.click(function(e){
				e.preventDefault();
				//self.click_button.addClass('active');
				self.canvasClickListener.startListening();
			});
		this.target_view
			.append(this.content_element);
		this.loadContent();
	};
	DigitDetailsContentView.prototype.loadContent = function(){
		var subnodes = this.data_proxy.getSubNodes();
		this.content_elements.length = 0;
		this.content_element.empty();
		this.title_span.text(this.data_proxy.getTitle());
		this.content_element.append(this.title_span);
		this.content_element.append(this.click_button);
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
	DigitDetailsContentView.prototype.update = function(){
		this.title_span.text(this.data_proxy.getTitle());
		for(var i = 0; i < 4; ++i){
			this.content_elements[i].update();
		}
	};
	DigitDetailsContentView.prototype.collectFormData = function(){
		var d = new Object();
		d.id = this.data_proxy.getId();
		d.name = this.data_proxy.getTitle();
		d.corners = new Array();
		for(var i = 0; i < this.content_elements.length; ++i){
			d.corners.push(this.content_elements[i].collectFormData());
		}
		return d;
	};
	return DigitDetailsContentView;
});