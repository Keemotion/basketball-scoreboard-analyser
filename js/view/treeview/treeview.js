define(["./treenode", "../../messaging_system/event_listener", "../../messaging_system/events/ReOrderedEvent"],function(TreeNode, EventListener, ReOrderedEvent){
    var TreeView = function(target_view, state_proxy, messaging_system){
        this.messaging_system = messaging_system;
        this.tree_element = $('<ul>')
            .attr({
                'class':'list_toolbox_objects_tree'
            });
        this.nodes = new Array();
        target_view.append(this.tree_element);
		this.setProxy(state_proxy);
    };
    TreeView.prototype.addNode = function(dataProxy, id){
    	var tree_node = new TreeNode(this.tree_element, dataProxy, this.messaging_system, true);
    	tree_node.setId(id);
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
        this.tree_element.sortable('destroy');
        this.tree_element.sortable({forcePlaceholderSize:true}).bind('sortupdate', function(e, ui){
        	var new_order = new Array();
        	self.tree_element.children('li').each(function(index){
        		new_order.push($(this).children('input[name=id]').val());
        	});
        	self.messaging_system.fire(self.messaging_system.events.ReOrdered, new ReOrderedEvent(new_order, self.state_proxy.getIdentification()));
        });
    };
    return TreeView;
});
