define(['../../messaging_system/messaging_system'], function(MessagingSystem){
	var BaseProxy = function(){
		
	};
	BaseProxy.prototype.update_events = new Array();	
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
	BaseProxy.prototype.getIdentification = function(){
		return this.obj.getIdentification();
	};
	/*BaseProxy.applyMethods = function(type){
		type.update_events = new Array();	
		type.setObj = function(o){
			this.obj = o;
		};
		type.getTitle = function(){
			return this.obj.getTitle();
		};
		type.getSubNodes = function(){
			return this.obj.getSubNodesProxies();
		};
		type.getId = function(){
			return this.obj.getId();
		};
		type.getUpdateEvents = function(){
			return this.update_events;
		};
		type.getParent = function(){
			return this.obj.getParent().getProxy();
		};
		type.getType = function(){
			return this.obj.getType();
		};
		type.isPossiblyAboutThis = function(d){
			return this.obj.isPossiblyAboutThis(d);
		};
		type.getDisplaying = function(){
			return this.obj.getDisplaying();
		};
		type.getIdentification = function(){
			return this.obj.getIdentification();
		};
	};*/
	return BaseProxy;
});
