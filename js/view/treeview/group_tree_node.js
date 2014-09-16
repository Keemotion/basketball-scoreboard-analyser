define(["./base_tree_node", "./digit_tree_node", "./dot_tree_node", "../../messaging_system/events/add_element_event"], function(BaseTreeNode, DigitTreeNode, DotTreeNode, AddElementEvent){
	var GroupTreeNode = function(parent_node, data_proxy, messaging_system){
		this.init(parent_node, data_proxy, messaging_system);
		var self = this;
		this.clearCommands();
		this.add_configuration_button = $('<button>')
			.addClass('btn btn-xs btn-default')
			.attr('title', 'Add configuration to current group')
			.append($('<i>').addClass('fa fa-cog'))
			.click(function(){
				
			});
		this.addCommand(this.add_configuration_button);
		
		this.add_sub_node_button = $('<button>')
			.addClass('btn btn-xs btn-default')
			.attr('title', 'Add ' + this.data_proxy.getGroupType()+ ' to this group.')
			.append($('<i>').addClass('fa fa-plus'))
			.click(function(){
				self.messaging_system.fire(self.messaging_system.events.AddElement, new AddElementEvent(self.data_proxy.getGroupType(), self.data_proxy.getIdentification()));
			});
		this.addCommand(this.add_sub_node_button);
		
		this.remove_button = $('<button>')
			.addClass('btn btn-xs btn-default')
			.attr('title', 'Remove this group')
			.append($('<i>').addClass('fa fa-times'))
			.click(function(){
				
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
	return GroupTreeNode;
});