define(["../../messaging_system/events/submit_group_details_event",
	"../../messaging_system/event_listener"],function(SubmitGroupDetailsEvent, EventListener){
	var ConfigurationKeyDetailsView = function(target_view, data_proxy, messaging_system){
		var self = this;
		this.messaging_system = messaging_system;
		this.target_view = target_view;
		this.data_proxy = data_proxy;
		this.content_element = $('<div>');
		this.target_view.append(this.content_element);
		this.key_element = $('<input>');
		this.value_element = $('<input>');
		this.form_element = $('<form>');
		this.title_element = $('<span>').text('');
		this.content_element
			.append(this.title_element)
			.append(this.form_element);
		this.form_element
			.append($('<label>').text('Key: '))
			.append(this.key_element)
			.append($('<br>'))
			.append($('<label>').text('Value: '))
			.append(this.value_element)
			.append($('<button>').text('submit').click(function(){
				self.form_element.submit();
				return false;
			}))
			.submit(function(){
				var data = self.collectFormData();
				var identification = self.data_proxy.getIdentification();
				self.messaging_system.fire(self.messaging_system.events.SubmitGroupDetails, new SubmitGroupDetailsEvent(identification, data));
				return false;
			});
		this.loadContent();
		messaging_system.addEventListener(messaging_system.events.GroupChanged, new EventListener(this, this.groupChanged));
	};
	ConfigurationKeyDetailsView.prototype.groupChanged = function(signal, data){
		if(this.data_proxy.isPossiblyAboutThis(data.getTargetIdentification())){
			this.loadContent();
		}
	};
	ConfigurationKeyDetailsView.prototype.loadContent = function(){
		this.title_element.text(this.data_proxy.getTitle());
		this.key_element.val(this.data_proxy.getKey());
		this.value_element.val(this.data_proxy.getValue());
	};
	ConfigurationKeyDetailsView.prototype.cleanUp = function(){

	};
	ConfigurationKeyDetailsView.prototype.collectFormData = function(){
		var data = new Object();
		data.key = this.key_element.val();
		data.value = this.value_element.val();
		return data;
	};
	return ConfigurationKeyDetailsView;
});
