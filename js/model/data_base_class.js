define([
		"../messaging_system/event_listener",
		"../messaging_system/events/group_changed_event",
		"../model/selection_node",
		"../model/selection_tree",
		"../messaging_system/events/selection_event",
		"../messaging_system/events/edit_mode_selection_event"],
	function(EventListener, GroupChangedEvent, SelectionNode, SelectionTree, SelectionEvent, EditModeSelectionEvent){
		//Base class for groups/digits/corners/state
		var BaseDataClass = function(type){
			this.type = type;
		};
		BaseDataClass.prototype.init = function(){
			this.notification_lock = 0;
			this.selected = false;
			this.sub_nodes = new Array();
			this.displaying = true;
			this.simulating = true;
			this.toggleDisplayObjectListener = new EventListener(this, this.toggleDisplay);
			this.messaging_system.addEventListener(this.messaging_system.events.ToggleDisplayObject, this.toggleDisplayObjectListener);
			//when the order of the sub nodes changed, this function is called to save changes
			this.reOrderedListener = new EventListener(this, this.reOrdered);
			this.messaging_system.addEventListener(this.messaging_system.events.ReOrdered, this.reOrderedListener);
			this.messaging_system.addEventListener(this.messaging_system.events.SubmitGroupDetails, new EventListener(this, this.submitGroupDetails));
			this.messaging_system.addEventListener(this.messaging_system.events.RemoveGroup, new EventListener(this, this.removeElement));
			this.messaging_system.addEventListener(this.messaging_system.events.GroupReset, new EventListener(this, this.resetGroup));
			//this.messaging_system.addEventListener(this.messaging_system.events.MoveModeObjectsMoved, new EventListener(this, this.moveModeMoved));
			//this.messaging_system.addEventListener(this.messaging_system.events.ObjectsMoved, new EventListener(this, this.moved));
			if(this.addElement){
				this.addElementListener = new EventListener(this, this.addElement);
				this.messaging_system.addEventListener(this.messaging_system.events.AddElement, this.addElementListener);
			}
		};
		//event listener when a sub node is removed in the GUI
		BaseDataClass.prototype.removeElement = function(signal, data){
			if(data.getHandled())
				return;
			if(this.isPossiblyAboutThis(data.getTargetIdentification())){
				if(this.getParent()){
					this.getParent().removeSubNode(this.getId());
				}
				this.messaging_system.fire(this.messaging_system.events.SelectionRemoved, new SelectionEvent(this.getSelectionTree(true, null), false));
				data.setHandled(true);
			}
		};
		//save changes that were submitted from the GUI
		BaseDataClass.prototype.submitGroupDetails = function(signal, data){
			if(this.isPossiblyAboutThis(data.getTargetIdentification())){
				if(data.getPartial()){
					this.partialUpdate(data.getData());
				}else{
					this.update(data.getData());
				}
			}
		};
		//sets whether this object should be displayed on the canvas
		BaseDataClass.prototype.toggleDisplay = function(signal, data){
			if(this.isPossiblyAboutThis(data.target_identification)){
				this.setDisplaying(data.displaying);
			}
		};
		//when the order of the sub nodes changed, this function is called to save changes
		BaseDataClass.prototype.reOrdered = function(signal, data){
			if(this.isPossiblyAboutThis(data.getTargetIdentification())){
				this.reArrange(data.getNewOrder());
			}
		};
		//saves which parameters were present about this object in the file that was loaded
		BaseDataClass.prototype.setConfigurationKeys = function(configuration_keys){
			this.configuration_keys = configuration_keys;
		};
		BaseDataClass.prototype.getConfigurationKeys = function(){
			return this.configuration_keys;
		};
		//the proxy which the view can use to collect data about this object
		BaseDataClass.prototype.getProxy = function(){
			return this.proxy;
		};
		BaseDataClass.prototype.setProxy = function(proxy){
			this.proxy = proxy;
		};
		//generates an array of proxies of the sub nodes
		BaseDataClass.prototype.getSubNodesProxies = function(){
			var sub_nodes_proxies = new Array();
			var sub_nodes = this.getSubNodes();
			for(var i = 0; i < sub_nodes.length; ++i){
				sub_nodes_proxies.push(sub_nodes[i].getProxy());
			}
			return sub_nodes_proxies;
		};
		//Default title generation: type + id
		BaseDataClass.prototype.getTitle = function(){
			if(this.name != null)
				return this.name;
			return this.getType() + " #" + (this.getId() + 1);
		};
		BaseDataClass.prototype.getId = function(){
			return this.id;
		};
		BaseDataClass.prototype.setId = function(id){
			if(id == this.id)
				return;
			this.id = id;
			this.notifyGroupChanged();
		};
		BaseDataClass.prototype.getParent = function(){
			return this.parent;
		};
		BaseDataClass.prototype.setParent = function(parent){
			this.parent = parent;
		};
		BaseDataClass.prototype.getType = function(){
			return this.type;
		};
		//when changing a bunch of objects at once, notifications can be blocked by lockNotification()
		//each unlockNotification undoes one lockNotification
		//When no lockNotifications are active, notifications are sent to the messaging system
		BaseDataClass.prototype.lockNotification = function(){
			this.notification_lock++;
		};
		BaseDataClass.prototype.unlockNotification = function(){
			this.notification_lock--;
		};
		BaseDataClass.prototype.canNotify = function(){
			if(this.notification_lock != 0)
				return false;
			if(this.getParent())
				return this.getParent().canNotify();
			return true;
		};
		BaseDataClass.prototype.notifyGroupChanged = function(){
			if(!this.canNotify()){
				return;
			}
			this.messaging_system.fire(this.messaging_system.events.GroupChanged, new GroupChangedEvent(this.getIdentification()));
		};
		//checks whether the target identification matches the identification of this object
		BaseDataClass.prototype.isPossiblyAboutThis = function(target, index){
			if(target.length == 0)
				return false;
			if(typeof(index) == 'undefined')
				index = target.length - 1;
			if(index < 0)
				return true;
			var current_identification = target[index];
			if(current_identification['type'] == this.getType() && current_identification['id'] == this.getId()){
				if(index == 0)
					return true;
				if(this.getParent()){
					return this.getParent().isPossiblyAboutThis(target, index - 1);
				}
			}
			return false;
		};
		//returns whether this object has to be displayed on the canvas
		BaseDataClass.prototype.getDisplaying = function(){
			return this.displaying;
		};
		//sets whether this object has to be displayed on the canvas.
		//This settings is applied to all children objects as well
		BaseDataClass.prototype.setDisplaying = function(displaying, send_notification){
			this.displaying = displaying;
			if(send_notification == null){
				send_notification = true;
			}
			var sub_nodes = this.getSubNodes();
			for(var i = 0; i < sub_nodes.length; ++i){
				sub_nodes[i].setDisplaying(displaying, false);
			}
			if(send_notification){
				this.messaging_system.fire(this.messaging_system.events.DisplayObjectsChanged, null);
			}
		};
		//returns whether this object has to be simulated (used when dragging this object around the canvas, to draw only the current object)
		BaseDataClass.prototype.getSimulating = function(){
			return this.simulating;
		};
		//sets whether this object has to be simulated (used when dragging this object around the canvas, to draw only the current object)
		BaseDataClass.prototype.setSimulating = function(simulating, send_notification){
			this.simulating = simulating;
			if(send_notification == null){
				send_notification = true;
			}
			var sub_nodes = this.getSubNodes();
			for(var i = 0; i < sub_nodes.length; ++i){
				sub_nodes[i].setSimulating(simulating, false);
			}
			if(send_notification){
				this.messaging_system.fire(this.messaging_system.DisplayObjectsChanged, null);
			}
		};
		BaseDataClass.prototype.getCustomIdentification = function(identification){
			return identification;
		};
		//generate an object containing all identification data about this object and its ancestors
		BaseDataClass.prototype.getIdentification = function(){
			var identification;
			if(this.getParent()){
				identification = this.getParent().getIdentification();
			}else{
				identification = new Array();
			}
			var id = {'type' : this.getType(), 'id' : this.getId(), 'title' : this.getTitle()};
			this.getCustomIdentification(id);
			identification.push(id);
			return identification;
		};
		BaseDataClass.prototype.clear = function(){
			this.clearSubNodes();
		};
		BaseDataClass.prototype.getSubNodes = function(){
			return this.sub_nodes;
		};
		BaseDataClass.prototype.setSubNodes = function(sub_nodes){
			this.clearSubNodes();
			this.lockNotification();
			for(var i = 0; i < sub_nodes.length; ++i){
				this.addSubNode(sub_nodes[i]);
			}
			this.unlockNotification();
			this.notifyGroupChanged();
		};
		BaseDataClass.prototype.clearSubNodes = function(){
			for(var i = 0; i < this.sub_nodes.length; ++i){
				this.sub_nodes[i].clear();
			}
			this.sub_nodes.length = 0;
			this.notifyGroupChanged();
		};
		BaseDataClass.prototype.addSubNode = function(sub_node, auto_select){
			sub_node.setId(this.sub_nodes.length);
			this.sub_nodes.push(sub_node);
			sub_node.setParent(this);
			this.notifyGroupChanged();
			if(auto_select){
				//this.messaging_system.fire(this.messaging_system.events.EditModeSelectionSet, new EditModeSelectionEvent(sub_node.getProxy()))
				this.messaging_system.fire(this.messaging_system.events.SelectionSet, new SelectionEvent(sub_node.getSelectionTree()));
			}
		};
		BaseDataClass.prototype.removeSubNode = function(index){
			this.lockNotification();
			this.sub_nodes[index].cleanUp();
			for(var i = index + 1; i < this.sub_nodes.length; ++i){
				this.sub_nodes[i - 1] = this.sub_nodes[i];
				this.sub_nodes[i - 1].setId(i - 1);
			}
			this.sub_nodes.length = this.sub_nodes.length - 1;
			this.unlockNotification();
			this.notifyGroupChanged();
		};
		BaseDataClass.prototype.cleanUp = function(){
			//TODO: remove event listeners
			//TODO: specific clean handler (digit/state/group...)
			this.clear();
		};
		//returns all data about this object and its children in an Object that can be converted to JSON by the export function
		BaseDataClass.prototype.getStringifyData = function(){
			var d = new Object();
			d.name = this.name;
			d.sub_nodes = new Array();
			d.type = this.getType();
			var sub_nodes = this.getSubNodes();
			for(var i = 0; i < sub_nodes.length; ++i){
				d.sub_nodes.push(sub_nodes[i].getStringifyData());
			}
			d.configuration_keys = this.getConfigurationKeys();

			return d;
		};
		BaseDataClass.prototype.reArrange = function(indices){
			var good = false;
			for(var i = 0; i < indices.length && !good; ++i){
				if(indices[i] != i)
					good = true;
			}
			if(!good)
				return;
			var new_sub_nodes = new Array();
			this.lockNotification();
			for(var i = 0; i < indices.length; ++i){
				new_sub_nodes.push(this.sub_nodes[indices[i]]);
				this.sub_nodes[indices[i]].setId(i);
			}
			this.sub_nodes = new_sub_nodes;
			this.unlockNotification();
			this.notifyGroupChanged();
		};
		BaseDataClass.prototype.isAboutThisOrAncestors = function(identifications){
			if(this.getParent()){
				if(this.getParent().isAboutThisOrAncestors(identifications)){
					return true;
				}
			}
			for(var i = 0; i < identifications.length; ++i){
				if(this.isPossiblyAboutThis(identifications[i])){
					return true;
				}
			}
			return false;
		};
		BaseDataClass.prototype.clear = function(){
			this.sub_nodes.length = 0;
			this.configuration_keys = new Object();
			this.notifyGroupChanged();
		};
		BaseDataClass.prototype.getSelectionTree = function(selected, child_tree){
			if(selected == null)
				selected = true;
			var tree = new SelectionTree();
			tree.getRoot().setProxy(this.getProxy());
			tree.getRoot().setSelected(selected);
			if(child_tree != null){
				tree.getRoot().addChild(child_tree.getRoot());
			}
			if(this.getParent && this.getParent()){
				return this.getParent().getSelectionTree(false, tree);
			}
			return tree;
		};
		BaseDataClass.prototype.moveSelection = function(node, translation){
			if(node.getSelected()){
				this.move(translation);
				return;
			}
			var children = node.getChildren();
			for(var i = 0; i < children.length; ++i){
				this.sub_nodes[children[i].getId()].moveSelection(children[i], translation);
			}
		};
		BaseDataClass.prototype.move = function(translation){
			for(var i = 0; i < this.sub_nodes.length; ++i){
				this.sub_nodes[i].move(translation);
			}
		};
		BaseDataClass.prototype.applyGlobalConfiguration = function(current_configuration, end_index){
			if(typeof end_index === 'undefined'){
				end_index = this.sub_nodes.length;
			}
			for(var i = 0; i < end_index; ++i){
				current_configuration = this.sub_nodes[i].applyGlobalConfiguration(current_configuration);
			}
			return current_configuration;
		};
		BaseDataClass.prototype.getGlobalConfiguration = function(end_index){
			var current_configuration = new Object();
			if(this.getParent()){
				current_configuration = this.getParent().getGlobalConfiguration(this.getId());
			}
			current_configuration = this.applyGlobalConfiguration(current_configuration, end_index);
			return current_configuration;
		};
		BaseDataClass.prototype.getBoundingRectangle = function(rectangle){
			if(rectangle == null){
				rectangle = new BoundingRectangle();
			}
			var sub_nodes = this.getSubNodes();
			for(var i = 0; i < sub_nodes.length; ++i){
				sub_nodes[i].getBoundingRectangle(rectangle);
			}
			return rectangle;
		};

		BaseDataClass.prototype.isComplete = function(){
			if(this.sub_nodes.length == 0){
				return false;
			}
			for(var i = 0; i < this.sub_nodes.length; ++i){
				if(!this.sub_nodes[i].isComplete()){
					return false;
				}
			}
			return true;
		};
		BaseDataClass.prototype.reset = function(){
			console.log("implement reset for: " + this.getType());
		};
		BaseDataClass.prototype.resetGroup = function(signal, data){
			if(!this.isPossiblyAboutThis(data.getTargetIdentification())){
				return;
			}
			this.reset();
			this.notifyGroupChanged();
		};
		BaseDataClass.prototype.getParentOfTypeIdentification = function(type){
			if(type == this.getType()){
				return this.getIdentification();
			}
			if(this.getParent()){
				return this.getParent().getParentOfTypeIdentification(type);
			}
			return null;
		};
		BaseDataClass.prototype.getParentOfTypeProxy = function(type){
			if(type == this.getType()){
				return this.getProxy();
			}
			if(this.getParent()){
				return this.getParent().getParentOfTypeProxy(type);
			}
			return null;
		};
		BaseDataClass.prototype.isAncestorOf = function(other_identification){
			var own_identification = this.getIdentification();
			if(own_identification.length > other_identification.length){
				return false;
			}
			for(var i = 0; i < own_identification.length; ++i){
				if(own_identification[i].type != other_identification[i].type){
					return false;
				}
				if(own_identification[i].id != other_identification[i].id){
					return false;
				}
			}
			return true;
		};
		BaseDataClass.prototype.hasParentOfType = function(type){
			if(this.getType() == type){
				return true;
			}
			if(this.getParent()){
				return this.getParent().hasParentOfType(type);
			}
			return false;
		};
		/*BaseDataClass.prototype.moveModeMoved = function(signal, data){
			var targets = data.getTargets();
			for(var i = 0; i < targets.length; ++i){
				if(this.isPossiblyAboutThis(targets[i])){
					this.move(data.getTranslation());
					break;
				}
			}
		};*/
		/*BaseDataClass.prototype.moved = function(signal, data){
			var tree = data.getTree();
			if(!tree.isSelected(this.getIdentification())){
				return;
			}
			console.log("selected: "+JSON.stringify(this.getIdentification()));
			this.move(data.getTranslation());
		};*/
		return BaseDataClass;
	});
