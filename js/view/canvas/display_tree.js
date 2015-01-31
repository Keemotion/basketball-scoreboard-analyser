define([
		'./base_display',
		'./group_display',
		'../../messaging_system/event_listener',
		"./dummy_display",
		"../../model/selection_tree",
		"../../model/selection_node"
	],
	function(BaseDisplay, GroupDisplay, EventListener, DummyDisplay, SelectionTree, SelectionNode){
		//represents the root node of all display objects
		var DisplayTree = function(proxy, messaging_system){
			this.init();
			this.setParent(null);
			this.messaging_system = messaging_system;
			this.setProxy(proxy);
			this.loadSubComponents();
			this.messaging_system.addEventListener(this.messaging_system.events.StateChanged, new EventListener(this, this.stateChanged));
			this.messaging_system.addEventListener(this.messaging_system.events.GroupChanged, new EventListener(this, this.groupChanged));
		};
		DisplayTree.prototype = new BaseDisplay();
		DisplayTree.prototype.drawMyself = function(context, transformation, selection_tree){
		};
		DisplayTree.prototype.stateChanged = function(signal, data){
			this.loadSubComponents();
		};
		DisplayTree.prototype.groupChanged = function(signal, data){
			if(this.getProxy().isPossiblyAboutThis(data.getTargetIdentification())){
				this.loadSubComponents();
			}
		};
		DisplayTree.prototype.loadSubComponents = function(){
			var sub_proxies = this.getProxy().getSubNodes();
			this.sub_components.length = 0;
			for(var i = 0; i < sub_proxies.length; ++i){
				if(sub_proxies[i].getType() == "configuration_key"){
					this.sub_components.push(new DummyDisplay(sub_proxies[i]));
					continue;
				}
				this.sub_components.push(new GroupDisplay(this, sub_proxies[i], this.messaging_system));
			}
		};
		DisplayTree.prototype.getCompleteSelectionTree = function(){
			var tree = new SelectionTree();
			tree.getRoot().setProxy(this.getProxy());
			for(var i = 0; i < this.sub_components.length; ++i){
				if(!this.sub_components[i].canBeSelected()){
					continue;
				}
				var tmp_node = new SelectionNode(this.sub_components[i].getProxy(), true);
				var children = this.sub_components[i].getSubComponents();
				for(var j = 0; j < children.length; ++j){
					tmp_node.addChild(new SelectionNode(children[j].getProxy(), true));
				}
				tree.getRoot().addChild(tmp_node);
			}
			return tree;
		};
		return DisplayTree;
	});
