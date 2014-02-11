define(['../../messaging_system/messaging_system'], function(MessagingSystem){
	var BaseProxy = new Object();
	BaseProxy.applyMethods = function(type){
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
		type.getDrawing = function(){
			return this.obj.getDrawing();
		};
	};
	return BaseProxy;
});
