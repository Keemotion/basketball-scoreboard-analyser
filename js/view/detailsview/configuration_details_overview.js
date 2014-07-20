define([], function(){
	var ConfigurationDetailsOverview = function(data_proxy, target_element){
		var self = this;
		this.data_proxy = data_proxy;
		this.target_element = target_element;
		this.target_element.empty();
		this.list_element = $('<ul>');
		this.expand_element = $('<span>&gt;</span>').addClass('expand-command').click(function(){
			self.expand_details();
		});
		this.collapse_element = $('<span>v</span>').addClass('collapse-command').click(function(){
			self.collapse_details();
		});
		this.title_element = $('<span>')
			.append(this.expand_element)
			.append(this.collapse_element)
			.append($('<span>').html('&nbsp;Global configuration overview'));
		this.target_element.append(this.title_element);
		this.target_element.append(this.list_element);
		this.loadContent();
	};
	ConfigurationDetailsOverview.prototype.loadContent = function(){
		this.list_element.empty();
		var configuration = this.data_proxy.getGlobalConfiguration();
		console.log("new configuration details overview!");
		for(var k in configuration){
			if(configuration.hasOwnProperty(k)){
				this.list_element.append($('<li>').text(k+" = "+configuration[k]));
			}
		}
		this.collapse_details();
	};
	ConfigurationDetailsOverview.prototype.cleanUp = function(){

	};
	ConfigurationDetailsOverview.prototype.collapse_details = function(){
		this.list_element.hide();
		this.collapse_element.hide();
		this.expand_element.show();
	};
	ConfigurationDetailsOverview.prototype.expand_details = function(){
		this.list_element.show();
		this.collapse_element.show();
		this.expand_element.hide();
	};
	return ConfigurationDetailsOverview;
});
