define([], function(){
	var LoadStateEvent = function(data_string){
		this.data_string = data_string;
	};
	LoadStateEvent.prototype.getDataString = function(){
		return this.data_string;
	};
	return LoadStateEvent;
});
