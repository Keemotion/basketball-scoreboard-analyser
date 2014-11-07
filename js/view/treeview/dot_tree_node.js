define(["./base_tree_node",
		"../../messaging_system/events/coordinate_listen_event",
		"../../messaging_system/events/submit_group_details_event",
		"../../model/coordinate",
		"../../messaging_system/events/remove_group_event",
		"../../messaging_system/events/edit_mode_selection_event"],
	function(BaseTreeNode, CoordinateListenEvent, SubmitGroupDetailsEvent, Coordinate, RemoveGroupEvent, EditModeSelectionEvent){
		var DotTreeNode = function(parent_node, data_proxy, messaging_system){
			this.init(parent_node, data_proxy, messaging_system);
			this.set_corner_button = $('<button>')
				.addClass('btn btn-default')
				.attr('title', 'Set corner coordinate')
				.append($('<i>').addClass('fa fa-crosshairs'))
				.click(function(){
					messaging_system.fire(messaging_system.events.CoordinateListen, new CoordinateListenEvent(data_proxy));
				});
			this.addCommand(this.set_corner_button);

			this.reset_corner_button = $('<button>')
				.addClass('btn btn-default')
				.attr('title', 'Reset corner coordinate')
				.append($('<i>').addClass('fa fa-refresh'))
				.click(function(){
					var coordinate_data = new Object();
					coordinate_data.coordinate = new Coordinate();
					var identification = data_proxy.getIdentification();
					messaging_system.fire(messaging_system.events.SubmitGroupDetails, new SubmitGroupDetailsEvent(identification, coordinate_data));
				});
			this.addCommand(this.reset_corner_button);

			this.remove_dot_button = $('<button>')
				.addClass('btn btn-default')
				.attr('title', 'Remove led')
				.append($('<i>').addClass('fa fa-times'))
				.click(function(){
					messaging_system.fire(messaging_system.events.EditModeSelectionSet, new EditModeSelectionEvent(parent_node.getProxy()));
					messaging_system.fire(messaging_system.events.RemoveGroup, new RemoveGroupEvent(data_proxy.getIdentification()));
				});
			this.addCommand(this.remove_dot_button);
		};
		DotTreeNode.prototype = new BaseTreeNode();
		return DotTreeNode;
	});