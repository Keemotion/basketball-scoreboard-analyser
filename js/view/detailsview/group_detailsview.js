define([
	"./digit_details_content_view",
	"./dot_details_content_view", 
	"./group_details_content_view",
	"../../messaging_system/event_listener", 
	"../../messaging_system/events/submit_group_details_event",
	"../../messaging_system/events/toggle_display_object_event"], 
	function(
		DigitDetailsContentView, 
		DotDetailsContentView,
		GroupDetailsContentView,
		EventListener, 
		SubmitGroupDetailsEvent,
		ToggleDisplayObjectEvent){
	var HighlightButton = function(data_proxy, messaging_system){
		var self = this;
		this.displaying = data_proxy.getDisplaying();
		this.element = $('<button>')
			.attr('type', 'button')
			.text('highlight')
			.addClass('btn-highlight'+(data_proxy.getDisplaying()?' active':''))
			.click(function(){
				self.displaying = !self.displaying;
				if(self.displaying){
					self.element.addClass('active');
				}else{
					self.element.removeClass('active');
				}
				var target_identification = data_proxy.getIdentification();
				messaging_system.fire(messaging_system.events.ToggleDisplayObject, new ToggleDisplayObjectEvent(target_identification, self.displaying));
			});
	};
	var AddDigitButton = function(data_proxy, messaging_system){
		this.element = $('<button>').text('add digit');
	};
	var GroupDetailsView = function(target_view, data_proxy, messaging_system){
		var self = this;
		this.target_view = target_view;
		this.data_proxy = data_proxy;
		this.messaging_system = messaging_system;
		this.content_elements = new Array();
		this.form = $('<form>')
			.submit(function(e){
				e.preventDefault();
				var d = new Object();
				d.data = self.collectFormData();
				d.target = self.data_proxy.getIdentification();
				messaging_system.fire(messaging_system.events.SubmitGroupDetails, new SubmitGroupDetailsEvent(d.target, d.data));
			});
		this.element = $('<div>')
			.attr({
				'class':'div_group_details'
			});
		this.title_element = $('<span>')
			.attr({
				'class':'span_details_title'
			})
			.text('Group details');
		this.highlight_button = new HighlightButton(this.data_proxy, this.messaging_system);
		this.add_digit_button = new AddDigitButton(this.data_proxy, this.messaging_system);
		this.controls_element = $('<div>')
			.attr({
				'class':'span_details_controls'
			})
			.append(this.highlight_button.element)
			.append(this.add_digit_button.element);
		this.content_element = $('<div>').text(this.data_proxy.getTitle());
		this.element.append(this.title_element)
			.append(this.controls_element)
			.append(this.content_element);
		this.form.append(this.element);
		this.target_view.append(this.form);
		this.loadContent();
		this.groupChangedListener = new EventListener(this, this.groupChanged);
		this.messaging_system.addEventListener(this.messaging_system.events.GroupChanged, this.groupChangedListener);
	};
	GroupDetailsView.prototype.collectFormData = function(){
		var d = new Object();
		d.id = this.data_proxy.getId();
		d.name = this.data_proxy.getTitle();
		d.digits = new Array();
		for(var i = 0; i < this.content_elements.length; ++i){
			d.digits.push(this.content_elements[i].collectFormData());
		}
		return d;
	};
	GroupDetailsView.prototype.loadContent = function(){
		var subnodes = this.data_proxy.getSubNodes();
		this.content_element.empty();
		this.title_element.text(this.data_proxy.getTitle());
		this.content_elements.length = 0;
		for(var i = 0; i < subnodes.length; ++i){
			var el;
			switch(subnodes[i].getType()){
				case 'digit':
					el = new DigitDetailsContentView(this.content_element, subnodes[i], this.messaging_system);
					break;
				case 'dot':
					el = new DotDetailsContentView(this.content_element, subnodes[i], this.messaging_system);
					break;
				case 'group':
					el = new GroupDetailsContentView(this.content_element, subnodes[i], this.messaging_system);
					break;
			}
			this.content_elements.push(el);
		}
	};
	GroupDetailsView.prototype.update = function(){
		this.title_element.text(this.data_proxy.getTitle());
		for(var i = 0; i < this.content_elements.length; ++i){
			this.content_elements[i].update();
		}
	};
	GroupDetailsView.prototype.groupChanged = function(signal, data){
		//TODO: proper identification (already implemented!)
		if(data.getGroupId() == this.data_proxy.getId()){
			this.update();
		}
	};
	GroupDetailsView.prototype.cleanUp = function(){
		this.messaging_system.removeEventListener(this.messaging_system.events.GroupChanged, this.groupChangedListener);
		for(var i = 0; i < this.content_elements.length; ++i){
			this.content_elements[i].cleanUp();
		}
	};
	return GroupDetailsView;
});
