define(["./base_tree_node"], function(BaseTreeNode){
	var ConfigurationTreeNode = function(parent_node, data_proxy, messaging_system){
		this.init(parent_node, data_proxy, messaging_system);
	};
	ConfigurationTreeNode.prototype = new BaseTreeNode();
	return ConfigurationTreeNode;
});