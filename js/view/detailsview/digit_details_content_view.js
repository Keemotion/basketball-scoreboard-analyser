define(["./corner_details_content_view", 
	"../../messaging_system/event_listener", 
	"../../messaging_system/events/submit_group_details_event",
	"../../messaging_system/events/remove_group_event",
	"./canvas_multiple_click_listener"],
	function(CornerDetailsContentView, 
		EventListener, 
		SubmitGroupDetailsEvent,
		RemoveGroupEvent,
		CanvasMultipleClickListener){
	//Groups all data about this digit
	var DigitDetailsContentView = function(target_view, data_proxy, messaging_system){
		var self = this;
		this.messaging_system = messaging_system;
		this.target_view = target_view;
		this.content_elements = new Array();
		this.data_proxy = data_proxy;
		this.content_element= $('<div>')
			.append($('<span>').text(''));
		this.title_span = $('<span>')
			.text('');
		this.canvasClickListener = null;
		this.canvasClickListener = new CanvasMultipleClickListener(this, this.messaging_system, 4);
		this.click_button = $('<button>')
			.text('Click to set digit')
			.attr({
				'class':'button_digit_coordinate_click'
			})
			.click(function(e){
				e.preventDefault();
				self.canvasClickListener.toggleListening();
				return false;
			});
		this.remove_button = $('<button>')
			.text('Delete digit')
			.attr({'type':'button'})
			.click(function(){
				messaging_system.fire(messaging_system.events.RemoveGroup, new RemoveGroupEvent(data_proxy.getIdentification()));
				return false;
			});
		
		this.form = $('<form>')
			.append(this.content_element)
			.submit(function(){
				var data = self.collectFormData();
				var target = self.data_proxy.getIdentification();
				self.messaging_system.fire(self.messaging_system.events.SubmitGroupDetails, new SubmitGroupDetailsEvent(target, data));
				return false;
			});
		this.target_view
			.append(this.form);
		this.loadContent();
        messaging_system.addEventListener(messaging_system.events.GroupChanged, new EventListener(this, this.groupChanged));
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
		this.content_element.append(this.title_span);
		this.content_element.append(this.click_button);
		this.content_element.append(this.remove_button);
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
	};
	return DigitDetailsContentView;
});
