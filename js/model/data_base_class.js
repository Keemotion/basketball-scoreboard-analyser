define([],function(){
	var BaseDataClass = new Object();
	BaseDataClass.applyMethods = function(type){
		type.init = function(){
			this.sub_nodes_proxies = new Array();
		};
		type.getProxy = function(){
			return this.proxy;
		};
		type.setProxy = function(proxy){
			this.proxy = proxy;
		};
		type.getSubNodesProxies = function(){
			return this.sub_nodes_proxies;
		};
		type.getTitle = function(){
			return this.name;
		};
		type.getId = function(){
			return this.id;
		};
		type.getParent = function(){
			return this.parent_state;
		};
		type.getType = function(){
			return this.type;
		};
		type.notifyLabelChanged = function(){
			this.getParent().notifyLabelChanged();
		};
		type.isPossiblyAboutThis = function(target){
			if(this.getType() in target){
				if(this.getId() != target[this.getType()]){
					return false;
				}
			}	
			if(this.getParent() && this.getParent().isPossiblyAboutThis){
				return this.getParent().isPossiblyAboutThis(target);
			}
			return true;
		};

	};
	return BaseDataClass;
});
