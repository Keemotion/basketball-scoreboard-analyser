define(["./base_tree_node", "../../messaging_system/events/coordinate_listen_event",
		"../../messaging_system/events/submit_group_details_event",
		"../../model/coordinate"],
	function(BaseTreeNode, CoordinateListenEvent, SubmitGroupDetailsEvent, Coordinate){
		var CornerTreeNode = function(parent_node, data_proxy, messaging_system){
			this.init(parent_node, data_proxy, messaging_system);
			this.set_corner_button = $('<button>')
				.addClass('btn btn-xs btn-default')
				.attr('title', 'Set corner coordinate')
				.append($('<i>').addClass('fa fa-crosshairs'))
				.click(function(){
					messaging_system.fire(messaging_system.events.CoordinateListen, new CoordinateListenEvent(data_proxy));
				});
			this.addCommand(this.set_corner_button);

			this.reset_corner_button = $('<button>')
				.addClass('btn btn-xs btn-default')
				.attr('title', 'Reset corner coordinate')
				.append($('<i>').addClass('fa fa-refresh'))
				.click(function(){
					var coordinate_data = new Object();
					coordinate_data.coordinate = new Coordinate();
					var identification = data_proxy.getIdentification();
					messaging_system.fire(messaging_system.events.SubmitGroupDetails, new SubmitGroupDetailsEvent(identification, coordinate_data));

				});
			this.addCommand(this.reset_corner_button);
		};
		CornerTreeNode.prototype = new BaseTreeNode();
		return CornerTreeNode;
	});