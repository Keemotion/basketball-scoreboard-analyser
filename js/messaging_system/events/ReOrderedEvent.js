define([], function(){
	var ReOrderedEvent = function(new_order, identification){
		this.new_order = new_order;
		this.target_identification = identification;
	};
	ReOrderedEvent.prototype.getNewOrder = function(){
		return this.new_order;
	};
	ReOrderedEvent.prototype.getTargetIdentification = function(){
		return this.target_identification;
	};
	return ReOrderedEvent;
});
