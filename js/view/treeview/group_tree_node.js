define(["./base_tree_node",
		"./digit_tree_node",
		"./dot_tree_node",
		"../../messaging_system/events/add_element_event",
		"../../messaging_system/events/remove_group_event",
		"../../messaging_system/events/group_changed_event",
		"../../messaging_system/events/selection_event"],
	function(BaseTreeNode, DigitTreeNode, DotTreeNode, AddElementEvent, RemoveGroupEvent, GroupChangedEvent, SelectionEvent){
		var GroupTreeNode = function(parent_node, data_proxy, messaging_system){
			this.init(parent_node, data_proxy, messaging_system);
			var self = this;
			this.clearCommands();
			this.add_configuration_button = $('<button>')
				.addClass('btn btn-default')
				.attr('title', 'Add configuration to current group')
				.append($('<i>').addClass('fa fa-cog'))
				.click(function(){
					self.add_configuration(null, null);
				});
			this.addCommand(this.add_configuration_button);

			this.add_sub_node_button = $('<button>')
				.addClass('btn btn-default')
				.attr('title', 'Add ' + this.data_proxy.getGroupType() + ' to this group.')
				.append($('<i>').addClass('fa fa-plus'))
				.click(function(){
					self.messaging_system.fire(self.messaging_system.events.AddElement, new AddElementEvent(self.data_proxy.getGroupType(), self.data_proxy.getIdentification(), null, true));
				});
			this.addCommand(this.add_sub_node_button);

			this.reset_button = $('<button>')
				.addClass('btn btn-default')
				.attr('title', 'Reset group')
				.append($('<i>').addClass('fa fa-refresh'))
				.click(function(){
					self.messaging_system.fire(self.messaging_system.events.SelectionSet, new SelectionEvent(self.data_proxy.getSelectionTree()));
					self.messaging_system.fire(self.messaging_system.events.GroupReset, new GroupChangedEvent(self.data_proxy.getIdentification()));
				});
			this.addCommand(this.reset_button);

			this.remove_button = $('<button>')
				.addClass('btn btn-default')
				.attr('title', 'Remove this group')
				.append($('<i>').addClass('fa fa-times'))
				.click(function(){
					self.messaging_system.fire(messaging_system.events.SelectionReset, new SelectionEvent(null, false));
					self.messaging_system.fire(messaging_system.events.RemoveGroup, new RemoveGroupEvent(data_proxy.getIdentification()));
				});
			this.addCommand(this.remove_button);
			this.loadSubNodes();
		};
		GroupTreeNode.prototype = new BaseTreeNode();

		GroupTreeNode.prototype.loadSubNodes = function(){
			var sub_nodes = this.data_proxy.getSubNodes();
			this.sub_tree_nodes = new Array();
			for(var i = 0; i < sub_nodes.length; ++i){
				var sub_tree_node = null;
				if(this.data_proxy.getGroupType() == "dot"){
					sub_tree_node = new DotTreeNode(this, sub_nodes[i], this.messaging_system);
				}else{
					sub_tree_node = new DigitTreeNode(this, sub_nodes[i], this.messaging_system);
				}
				this.sub_tree_nodes.push(sub_tree_node);
			}
		};
		GroupTreeNode.prototype.nameEditable = function(){
			return true;
		};
		GroupTreeNode.prototype.showConfiguration = function(){
			return true;
		};
		return GroupTreeNode;
	});