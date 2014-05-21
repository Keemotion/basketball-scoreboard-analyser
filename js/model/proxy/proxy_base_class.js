define(['../../messaging_system/messaging_system'], function(MessagingSystem){
	//provdes some basic methods all proxies need
	var BaseProxy = function(){
		
	};
	BaseProxy.prototype.update_events = [MessagingSystem.prototype.events.GroupChanged];	
	BaseProxy.prototype.setObj = function(o){
		this.obj = o;
	};
	BaseProxy.prototype.getTitle = function(){
		return this.obj.getTitle();
	};
	BaseProxy.prototype.getSubNodes = function(){
		return this.obj.getSubNodesProxies();
	};
	BaseProxy.prototype.getId = function(){
		return this.obj.getId();
	};
	//returns all events that affect the status of the corresponding object, so views can listen to them
	BaseProxy.prototype.getUpdateEvents = function(){
		return this.update_events;
	};
	BaseProxy.prototype.getParent = function(){
		return this.obj.getParent().getProxy();
	};
	BaseProxy.prototype.getType = function(){
		return this.obj.getType();
	};
	BaseProxy.prototype.isPossiblyAboutThis = function(d){
		return this.obj.isPossiblyAboutThis(d);
	};
	BaseProxy.prototype.getDisplaying = function(){
		return this.obj.getDisplaying();
	};
	BaseProxy.prototype.getSimulating = function(){
		return this.obj.getSimulating();
	};
	BaseProxy.prototype.getIdentification = function(){
		return this.obj.getIdentification();
	};
	BaseProxy.prototype.getData = function(){
		return this.obj.getData();
	};
	BaseProxy.prototype.getSelected = function(){
		return this.obj.getSelected();
	};
	return BaseProxy;
});
