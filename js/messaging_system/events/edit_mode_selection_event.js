define([], function(){
	var EditModeSelectionEvent = function(proxy){
		this.proxy = proxy;
	};
	EditModeSelectionEvent.prototype.getProxy = function(){
		return this.proxy;
	};
	return EditModeSelectionEvent;
});