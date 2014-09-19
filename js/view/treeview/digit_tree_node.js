define(["./base_tree_node",
        "./corner_tree_node",
        "../../messaging_system/events/group_changed_event",
        "../../messaging_system/events/remove_group_event",
        "../../messaging_system/events/auto_detect_digit_event"], function(BaseTreeNode, CornerTreeNode, GroupChangedEvent, RemoveGroupEvent, AutoDetectDigitEvent){
	var DigitTreeNode = function(parent_node, data_proxy, messaging_system){
		this.init(parent_node, data_proxy, messaging_system);
		this.reset_button = $('<button>')
			.addClass('btn btn-xs btn-default')
			.attr('title', 'Reset')
			.append($('<i>').addClass('fa fa-refresh'))
			.click(function(){
				messaging_system.fire(messaging_system.events.GroupReset, new GroupChangedEvent(data_proxy.getIdentification()));
			});
		this.addCommand(this.reset_button);
		
		this.auto_detect_button = $('<button>')
			.addClass('btn btn-xs btn-default')
			.attr('title', 'Auto-detect corners')
			.append($('<i>').addClass('fa fa-search'))
			.click(function(){
				console.log("TODO: implement auto detect digit");
				messaging_system.fire(messaging_system.events.AutoDetectDigit, new AutoDetectDigitEvent(data_proxy));
			});
		this.addCommand(this.auto_detect_button);
		
		this.manually_set_digit_button = $('<button>')
			.addClass('btn btn-xs btn-default')
			.attr('title', 'Manually set digit')
			.append($('<i>').addClass('fa fa-crosshairs'))
			.click(function(){
				console.log("TODO: implement manually set digit");
			});
		this.addCommand(this.manually_set_digit_button);
		
		this.remove_digit_button = $('<button>')
			.addClass('btn btn-xs btn-default')
			.attr('title', 'Remove digit')
			.append($('<i>').addClass('fa fa-times'))
			.click(function(){
				messaging_system.fire(messaging_system.events.RemoveGroup, new RemoveGroupEvent(data_proxy.getIdentification()));
			});
		this.addCommand(this.remove_digit_button);
		
		this.loadSubNodes();
	};
	DigitTreeNode.prototype = new BaseTreeNode();
	DigitTreeNode.prototype.loadSubNodes = function(){
		var sub_nodes = this.data_proxy.getSubNodes();
		this.sub_tree_nodes = new Array();
		for(var i = 0; i < sub_nodes.length; ++i){
			var sub_tree_node = new CornerTreeNode(this, sub_nodes[i], this.messaging_system);
			this.sub_tree_nodes.push(sub_tree_node);
		}
	};
	return DigitTreeNode;
});