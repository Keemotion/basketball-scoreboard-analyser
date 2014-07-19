define(["./data_base_class",
	"./proxy/configuration_key_proxy"],
	function(DataBaseClass,
		ConfigurationKeyProxy){
	var ConfigurationKey = function(key, value, messaging_system){
		this.messaging_system = messaging_system;
		this.init();
		this.key = key;
		this.value = value;
		this.setProxy(new ConfigurationKeyProxy(this));
	};
	ConfigurationKey.prototype = new DataBaseClass("configuration_key");
	ConfigurationKey.prototype.getKey = function(){
		return this.key;
	};
	ConfigurationKey.prototype.getValue = function(){
		return this.value;
	};
	ConfigurationKey.prototype.setValue = function(value){
		this.value = value;
	};
	ConfigurationKey.prototype.getStringifyData = function(){
		var d = new Object();
		d.type = this.getType();
		d.key = this.getKey();
		d.value = this.getValue();
		return d;
	};
	ConfigurationKey.prototype.getTitle = function(){
		return "Configuration key: "+this.getKey()+" = "+this.getValue();
	}
	return ConfigurationKey;
});
