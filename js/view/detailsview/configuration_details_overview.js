define([], function(){
	var ConfigurationDetailsOverview = function(data_proxy, target_element){
		this.data_proxy = data_proxy;
		this.target_element = target_element;
		this.target_element.empty();
		this.list_element = $('<ul>');
		this.target_element.append($('<span>').text('Global configuration overview'));
		this.target_element.append(this.list_element);
		this.loadContent();
	};
	ConfigurationDetailsOverview.prototype.loadContent = function(){
		this.list_element.empty();
		var configuration = this.data_proxy.getGlobalConfiguration();
		for(var k in configuration){
			if(configuration.hasOwnProperty(k)){
				this.list_element.append($('<li>').text(k+" = "+configuration[k]));
			}
		}
	};
	ConfigurationDetailsOverview.prototype.cleanUp = function(){

	};
	return ConfigurationDetailsOverview;
});
