define([ '../../messaging_system/event_listener',
		'../../messaging_system/events/selection_event' ], function(
		EventListener, SelectionEvent) {
	// Button to expand a subtree
	// Groups the data about the current node and its children
	// the children's list is collapsed by default
	var TreeNode = function(target_view, data_proxy, messaging_system,
			on_root_level) {
		var self = this;
		this.on_root_level = on_root_level;
		this.messaging_system = messaging_system;
		this.data_proxy = data_proxy;
		this.sub_nodes = new Array();
		this.title = "";
		this.id_element = $('<input>').attr({
			'type' : 'hidden',
			'name' : 'id'
		}).val('-1');
		this.title_element = $('<span>').attr({
			'class' : 'span_li_title'
		});
		this.sub_nodes_element = $('<ul>').attr({
			'class' : 'tree_node_subnodes_list'
		}).collapse().on('show.bs.collapse', function() {
			self.collapse_button_expand_icon.hide();
			self.collapse_button_collapse_icon.show();
		}).on('hide.bs.collapse', function() {
			self.collapse_button_collapse_icon.hide();
			self.collapse_button_expand_icon.show();
		});
		this.collapse_button_collapse_icon = $('<i>').addClass(
				'fa fa-toggle-up').hide();
		this.collapse_button_expand_icon = $('<i>').addClass(
				'fa fa-toggle-down');
		this.collapse_button = $('<button>').addClass('btn btn-xs').click(
				function() {
					self.sub_nodes_element.collapse('toggle');
					console.log("collapse toggle finished!");
					return false;
				}).append(this.collapse_button_collapse_icon).append(
				this.collapse_button_expand_icon);
		
		this.tree_controls_element = $('<span>').attr({
		}).append(this.collapse_button);
		this.node_element = $('<li>').attr({
			'draggable' : this.on_root_level
		}).append(this.id_element).append(this.tree_controls_element).append(
				this.title_element).append(this.sub_nodes_element).click(
				function() {
					var e = new SelectionEvent(data_proxy.getSelectionTree());
					messaging_system.fire(messaging_system.events.SelectionSet,
							e);
					return false;
				});
		this.lock_depth = 0;
		target_view.append(this.node_element);
		this.loadData();
		this.setUpdateListeners(this.data_proxy.getUpdateEvents());
		this.selectionSetEventListener = new EventListener(this,
				this.selectionSet);
		this.messaging_system.addEventListener(
				this.messaging_system.events.SelectionSet,
				this.selectionSetEventListener);
	};
	TreeNode.prototype.expand = function() {
		this.sub_nodes_element.collapse('show');
	};
	TreeNode.prototype.collapse = function() {
		this.sub_nodes_element.collapse('hide');
	};
	TreeNode.prototype.selectionSet = function(signal, data) {
		var tree = data.getTree();
		if (tree.isSelected(this.data_proxy.getIdentification())) {
			this.expand();
		} else {
			this.collapse();
		}
	};
	// sets all events that cause the current node to be updated
	TreeNode.prototype.setUpdateListeners = function(events) {
		for (var i = 0; i < events.length; ++i) {
			this.messaging_system.addEventListener(events[i],
					new EventListener(this, this.updated));
		}
	};
	TreeNode.prototype.update = function() {
		this.loadData();
		for (var i = 0; i < this.sub_nodes.length; ++i) {
			this.sub_nodes[i].update();
		}
	};
	TreeNode.prototype.updated = function(signal, data) {
		var identification = data.getTargetIdentification();
		if (this.data_proxy.isPossiblyAboutThis(identification)) {
			this.update();
		}
	};
	// adds a sub node (which can have subnodes as well)
	TreeNode.prototype.addSubNode = function(data, id) {
		var tree_node = new TreeNode(this.sub_nodes_element, data,
				this.messaging_system, false);
		this.sub_nodes.push(tree_node);
		tree_node.setId(id);
		this.subNodesChanged();
	};
	TreeNode.prototype.setTitle = function(title) {
		this.title = title;
		if (title == null) {
			this.title_element.html("&nbsp;");
		} else {
			this.title_element.html(title);
		}
	};
	TreeNode.prototype.setId = function(id) {
		this.id = id;
		this.id_element.val(id);
	};
	TreeNode.prototype.setSubNodes = function(sub_nodes) {
		if (!sub_nodes) {
			return;
		}
		this.sub_nodes.length = 0;
		this.sub_nodes_element.empty();
		if (this.data_proxy.getType() == "group"
				|| this.data_proxy.getType() == "state"
				|| this.data_proxy.getType() == "digit") {
			for (var i = 0; i < sub_nodes.length; ++i) {
				this.addSubNode(sub_nodes[i], i);
			}
		}
		this.subNodesChanged();
	};
	// When the sub nodes have changed, it might be possible that the
	// tree_controls should be shown/hidden and that this was not the case
	// before
	TreeNode.prototype.subNodesChanged = function() {
		if (this.sub_nodes.length > 0) {
			this.tree_controls_element.show();
		} else {
			this.tree_controls_element.hide();
		}
	};
	TreeNode.prototype.loadData = function() {
		this.setTitle(this.data_proxy.getTitle());
		this.setId(this.data_proxy.getId());
		this.setSubNodes(this.data_proxy.getSubNodes());
	};
	return TreeNode;
});
