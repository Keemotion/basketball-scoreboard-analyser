define(["./base_tree_node"], function(BaseTreeNode){
	var CornerTreeNode = function(parent_node, data_proxy, messaging_system){
		this.init(parent_node, data_proxy, messaging_system);
		this.set_corner_button = $('<button>')
			.addClass('btn btn-xs btn-default')
			.attr('title', 'Set corner coordinate')
			.append($('<i>').addClass('fa fa-crosshairs'))
			.click(function(){
				
			});
		this.addCommand(this.set_corner_button);
		
		this.reset_corner_button = $('<button>')
			.addClass('btn btn-xs btn-default')
			.attr('title', 'Reset corner coordinate')
			.append($('<i>').addClass('fa fa-refresh'))
			.click(function(){
				
			});
		this.addCommand(this.reset_corner_button);
	};
	CornerTreeNode.prototype = new BaseTreeNode();
	return CornerTreeNode;
});