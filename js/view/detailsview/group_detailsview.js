define([
	"./digit_details_content_view",
	"./dot_details_content_view", 
	"./group_details_content_view",
	"../../messaging_system/event_listener", 
	"../../messaging_system/events/submit_group_details_event",
	"../../messaging_system/events/toggle_display_object_event",
	"../../messaging_system/events/add_element_event",
	"../../messaging_system/events/remove_group_event"], 
	function(
		DigitDetailsContentView, 
		DotDetailsContentView,
		GroupDetailsContentView,
		EventListener, 
		SubmitGroupDetailsEvent,
		ToggleDisplayObjectEvent,
		AddElementEvent,
		RemoveGroupEvent){
	//Button to toggle display on canvas for this group object
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
	//Button to add a subelement to this group
	var AddButton = function(data_proxy, messaging_system, type){
		var self = this;
		this.element = $('<button>')
			.text('add '+type)
			.click(function(){
				messaging_system.fire(messaging_system.events.AddElement, new AddElementEvent(type, data_proxy.getIdentification()));
				return false;
			});
	};
	//Groups all details data about this group in the GUI (also sub elements: dots/corners/...)
	var GroupDetailsView = function(target_view, data_proxy, messaging_system){
		var self = this;
		this.target_view = target_view;
		this.data_proxy = data_proxy;
		this.messaging_system = messaging_system;
		this.content_elements = new Array();
		this.element = $('<div>')
			.attr({
				'class':'div_group_details'
			});
		this.title_input = $('<input>').attr({'type':'text','name':'name'}).val(this.data_proxy.getTitle());
		this.title_form = $('<form>')
			.append($('<span>').text('Name: '))
			.append(this.title_input)
			.append($('<button>').attr({'type':'button'}).text('submit').click(function(){self.title_form.submit();}))
			.submit(function(e){
				var identification = data_proxy.getIdentification();
				var data = self.collectFormData();
				messaging_system.fire(messaging_system.events.SubmitGroupDetails, new SubmitGroupDetailsEvent(identification, data));
				return false;
			});
		this.highlight_button = new HighlightButton(this.data_proxy, this.messaging_system);
		this.add_digit_button = new AddButton(this.data_proxy, this.messaging_system, 'digit');
		this.add_dot_button = new AddButton(this.data_proxy, this.messaging_system, 'dot');
		this.controls_element = $('<div>')
			.attr({
				'class':'span_details_controls'
			})
			.append(this.highlight_button.element)
			.append(this.add_digit_button.element)
			.append(this.add_dot_button.element);
		this.content_element = $('<div>');
		this.element.append(this.title_form)
			.append(this.controls_element)
			.append(this.content_element)
			.append($('<button>').text('Delete group').attr('type','button').click(function(){
				messaging_system.fire(messaging_system.events.RemoveGroup, new RemoveGroupEvent(self.data_proxy.getIdentification()));
				return false;
			}));
		this.target_view.append(this.element);
		this.loadContent();
		this.groupChangedListener = new EventListener(this, this.groupChanged);
		this.messaging_system.addEventListener(this.messaging_system.events.GroupChanged, this.groupChangedListener);
	};
	//Collects all data about the current group in an Object that can be sent to the Messaging System
	//this data does NOT include the children, the children have own collectFormData methods
	GroupDetailsView.prototype.collectFormData = function(){
		var d = new Object();
		d.name = this.title_input.val();
		return d;
	};
	//loads the details div
	//Only direct children are shown (children of subgroups are NOT shown)
	GroupDetailsView.prototype.loadContent = function(){
		var subnodes = this.data_proxy.getSubNodes();
		this.content_element.empty();
		this.title_input.val(this.data_proxy.getTitle());
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
	//updates the content of the div when data about this group has changed
	GroupDetailsView.prototype.groupChanged = function(signal, data){
		if(this.data_proxy.isPossiblyAboutThis(data.getTargetIdentification())){
			this.loadContent();
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
