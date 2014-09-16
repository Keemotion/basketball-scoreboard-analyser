define(["../../messaging_system/events/selection_event",
        "../../messaging_system/event_listener"], function(SelectionEvent, EventListener) {
	var BaseTreeNode = function() {
	};
	BaseTreeNode.prototype.init = function(parent_node, data_proxy,
			messaging_system) {
		this.parent_node = parent_node;
		this.data_proxy = data_proxy;
		this.messaging_system = messaging_system;
		this.commands = new Array();
		this.sub_tree_nodes = new Array();
		this.setUpdateListeners(data_proxy.getUpdateEvents());
	};
	BaseTreeNode.prototype.addCommand = function(command) {
		this.commands.push(command);
	};
	BaseTreeNode.prototype.clearCommands = function(){
		this.commands.length = 0;
	};
	BaseTreeNode.prototype.loadContent = function(element) {
		var self = this;
		this.element = element;
		this.title_div = $('<div>').click(
				function() {
					var e = new SelectionEvent(self.data_proxy
							.getSelectionTree());
					self.messaging_system.fire(
							self.messaging_system.events.SelectionSet, e);
					return false;
				});

		this.commands_div = $('<div>').addClass('btn-group');
		for (var i = 0; i < this.commands.length; ++i) {
			this.commands[i].detach();
			this.commands_div.append(this.commands[i]);
		}
		this.element.empty();

		this.collapse_button_collapse_icon = $('<i>').addClass(
				'fa fa-toggle-up').hide();
		this.collapse_button_expand_icon = $('<i>').addClass(
				'fa fa-toggle-down');
		this.collapse_button = $('<button>').addClass('btn btn-xs').click(
				function() {
					self.sub_nodes_element.collapse('toggle');
					return false;
				}).append(this.collapse_button_collapse_icon).append(
				this.collapse_button_expand_icon);
		this.title_div.append(this.collapse_button);

		this.title_span = $('<span>');
		this.title_div.append(this.title_span);

		this.title_div.append(this.commands_div);
		this.element.append(this.title_div);

		this.sub_nodes_element = $('<div>').addClass('collapse').on('show.bs.collapse',
				function() {
					self.collapse_button_expand_icon.hide();
					self.collapse_button_collapse_icon.show();
				}).on('hide.bs.collapse', function() {
					self.collapse_button_collapse_icon.hide();
					self.collapse_button_expand_icon.show();
				});
		this.element.append(this.sub_nodes_element);
		this.loadSubNodesContent();
		this.updateContent();
	};
	BaseTreeNode.prototype.updateContent = function() {
		this.title_span.text(this.data_proxy.getTitle());
		if(this.data_proxy.isComplete()){
			this.title_span.css('font-weight', 'normal');
		}else{
			this.title_span.css('font-weight', 'bold');
		}
		if(this.sub_tree_nodes.length > 0){
			this.collapse_button.show();
		}else{
			this.collapse_button.hide();
		}
	};
	BaseTreeNode.prototype.loadSubNodesContent = function() {
		this.sub_nodes_list = $('<ul>');
		for (var i = 0; i < this.sub_tree_nodes.length; ++i) {
			var li = $('<li>');
			this.sub_nodes_list.append(li);
			this.sub_tree_nodes[i].loadContent(li);
		}
		this.sub_nodes_element.append(this.sub_nodes_list);
	};
	// sets all events that cause the current node to be updated
	BaseTreeNode.prototype.setUpdateListeners = function(events) {
		for (var i = 0; i < events.length; ++i) {
			this.messaging_system.addEventListener(events[i],
					new EventListener(this, this.updated));
		}
	};
	BaseTreeNode.prototype.update = function() {
		this.updateContent();
		for (var i = 0; i < this.sub_tree_nodes.length; ++i) {
			this.sub_tree_nodes[i].update();
		}
		if(this.parent_node){
			this.parent_node.childUpdated();
		}
	};
	BaseTreeNode.prototype.childUpdated = function(){
		this.updateContent();
		if(this.parent_node){
			this.parent_node.childUpdated();
		}
	};
	BaseTreeNode.prototype.updated = function(signal, data) {
		var identification = data.getTargetIdentification();
		if (this.data_proxy.isPossiblyAboutThis(identification)) {
			if(data.isStructuralChange()){
				this.loadSubNodes();
				this.loadContent(this.element);
			}
			this.update();
		}
	};
	BaseTreeNode.prototype.loadSubNodes = function(){};
	return BaseTreeNode;
});