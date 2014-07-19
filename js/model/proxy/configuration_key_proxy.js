define(["./proxy_base_class"], function(ProxyBaseClass){
	var ConfigurationKeyProxy = function(configuration_key){
		this.obj = configuration_key;
	};
	ConfigurationKeyProxy.prototype = new ProxyBaseClass();
	ConfigurationKeyProxy.prototype.getKey = function(){
		return this.obj.getKey();
	};
	ConfigurationKeyProxy.prototype.getValue = function(){
		return this.obj.getValue();
	};
	ConfigurationKeyProxy.prototype.getKeyOptions = function(){
		return this.obj.getKeyOptions();
	};
	ConfigurationKeyProxy.prototype.getPossibleValues = function(key){
		return this.obj.getPossibleValues(key);
	};
	return ConfigurationKeyProxy;
});
