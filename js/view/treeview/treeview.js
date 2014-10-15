define([ "../../messaging_system/event_listener",
	"../../messaging_system/events/re_ordered_event",
	"../../messaging_system/events/add_element_event",
	"./group_tree_node",
	"./configuration_tree_node"], function(EventListener, ReOrderedEvent, AddElementEvent, GroupTreeNode, ConfigurationTreeNode){
	// Manages the whole tree
	var TreeView = function(target_view, state_proxy, messaging_system){
		var self = this;
		this.messaging_system = messaging_system;
		this.btns = $('<div>').addClass('btn-group');
		this.add_digit_element = $('<button>').attr({
			'type' : 'button',
			'data-toggle' : 'tooltip',
			'title' : "Add number"
		}).addClass('btn btn-default').click(
			function(){
				self.messaging_system.fire(
					self.messaging_system.events.AddElement,
					new AddElementEvent('group', self.state_proxy
						.getIdentification(), 'digit', true));
			}).append($('<span>').addClass('glyphicon glyphicon-plus'))
			.append($('<span>').text('Number'));
		this.btns.append(this.add_digit_element);
		this.add_dot_element = $('<button>').attr({
			'type' : 'button',
			'data-toggle' : 'tooltip',
			'title' : "Add leds group"
		}).addClass('btn btn-default').click(
			function(){
				self.messaging_system.fire(
					self.messaging_system.events.AddElement,
					new AddElementEvent('group', self.state_proxy
						.getIdentification(), 'dot', true));
			}).append($('<span>').addClass('glyphicon glyphicon-plus'))
			.append($('<span>').text('Leds'));
		this.btns.append(this.add_dot_element);
		this.add_configuration_key_element = $('<button>').attr({
			'type' : 'button',
			'data-toggle' : 'tooltip',
			'title' : "Add configuration key"
		}).addClass('btn btn-default').click(
			function(){
				self.messaging_system.fire(
					self.messaging_system.events.AddElement,
					new AddElementEvent('configuration_key',
						self.state_proxy.getIdentification()));
			}).append($('<span>').addClass('glyphicon glyphicon-plus'))
			.append($('<span>').text('Configuration'));
		this.btns.append(this.add_configuration_key_element);
		target_view
			.append($('<div>').addClass('btn-toolbar').append(this.btns));

		this.tree_element = $('<ul>').attr({
			'class' : 'list_toolbox_objects_tree'
		});
		this.nodes = new Array();
		target_view.append(this.tree_element);
		this.setProxy(state_proxy);
	};
	TreeView.prototype.addNode = function(dataProxy, id){
		var tree_node;
		switch(dataProxy.getType()){
			case "group":
				tree_node = new GroupTreeNode(null, dataProxy, this.messaging_system);
				break;
			case "configuration_key":
				tree_node = new ConfigurationTreeNode(null, dataProxy, this.messaging_system);
				break;
		}
		this.nodes.push(tree_node);
	};
	TreeView.prototype.setProxy = function(proxy){
		this.state_proxy = proxy;
		this.loadView();
	};
	TreeView.prototype.loadView = function(){
		var self = this;
		this.tree_element.empty();
		this.nodes.length = 0;
		var sub_nodes = this.state_proxy.getSubNodes();
		for(var i = 0; i < sub_nodes.length; ++i){
			this.addNode(sub_nodes[i], i);
		}
		for(var i = 0; i < this.nodes.length; ++i){
			var li = $('<li>');
			this.tree_element.append(li);
			this.nodes[i].loadContent(li);
		}
		this.tree_element.sortable('destroy');
		this.tree_element.sortable({
			forcePlaceholderSize : true
		}).bind(
			'sortupdate',
			function(e, ui){
				var new_order = new Array();
				self.tree_element.children('li').each(
					function(index){
						new_order.push($(this).children(
							'input[name=id]').val());
					});
				self.messaging_system.fire(
					self.messaging_system.events.ReOrdered,
					new ReOrderedEvent(new_order, self.state_proxy
						.getIdentification()));
			});
	};
	return TreeView;
});
