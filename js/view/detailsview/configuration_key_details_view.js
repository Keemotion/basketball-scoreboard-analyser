define(["../../messaging_system/events/submit_group_details_event",
	"../../messaging_system/event_listener"], function(SubmitGroupDetailsEvent, EventListener){
	var ConfigurationKeyDetailsView = function(target_view, data_proxy, messaging_system){
		var self = this;
		this.messaging_system = messaging_system;
		this.target_view = target_view;
		this.data_proxy = data_proxy;
		this.content_element = $('<div>');
		this.target_view.append(this.content_element);
		this.key_element = $('<select>').change(function(){
			self.form_element.submit();
		});
		var options = this.data_proxy.getKeyOptions();
		for(var i = 0; i < options.length; ++i){
			this.key_element.append($('<option>').attr('value', options[i]).text(options[i]));
		}
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
			.append($('<button>').attr('title', 'submit')
				.addClass('btn btn-sm btn-default')
				.append($('<i>').addClass('fa fa-save'))
				.click(function(){
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
		var self = this;
		this.title_element.text(this.data_proxy.getTitle());
		this.key_element.val(this.data_proxy.getKey());
		if(this.value_element){
			this.value_element.remove();
		}
		//this.value_element.val(this.data_proxy.getValue());
		var possible_values = this.data_proxy.getPossibleValues(this.data_proxy.getKey());
		console.log(JSON.stringify(possible_values));
		if(possible_values instanceof Array){
			this.value_element = $('<select>')
				.change(function(){
					self.form_element.submit();
				});
			this.value_element.append($('<option>').text(''));
			for(var i = 0; i < possible_values.length; ++i){
				this.value_element
					.append($('<option>').attr('value', possible_values[i]).text(possible_values[i]));
			}
			console.log(this.data_proxy.getValue());
		}else if(possible_values == "text" || possible_values == "numeric"){
			this.value_element = $('<input>');
		}else{
			this.value_element = $('<input>');
		}
		this.value_element.val(this.data_proxy.getValue());
		this.content_element.find('button').before(this.value_element);
	};
	ConfigurationKeyDetailsView.prototype.cleanUp = function(){

	};
	ConfigurationKeyDetailsView.prototype.collectFormData = function(){
		var data = new Object();
		data.key = this.key_element.val();
		data.value = this.value_element.val();
		var options = this.data_proxy.getPossibleValues(data.key);
		if(options == "text"){
			//ok!
		}else if(options == "numeric"){
			if(isNaN(data.value)){
				data.value = 0;
			}
		}else if(options instanceof Array){
			if(options.indexOf(data.value) == -1){
				data.value = null;
			}
		}
		return data;
	};
	return ConfigurationKeyDetailsView;
});
