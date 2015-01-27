/**
 * Created by fkint on 27/01/15.
 */
define([], function(){
	var LineExtensionsSetEvent = function(val){
		this.value = val;
	};
	LineExtensionsSetEvent.prototype.getValue = function(){
		return this.value;
	};
	return LineExtensionsSetEvent;
});