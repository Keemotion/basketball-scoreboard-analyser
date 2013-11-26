define(["./treenode", "../../messaging_system/event_listener"],function(TreeNode, EventListener){
    var TreeView = function(target_view, state_proxy, messaging_system){
        this.messaging_system = messaging_system;
        this.tree_element = $('<ul>')
            .attr({
                'class':'list_toolbox_objects_tree'
            });
        this.nodes = new Array();
        target_view.append(this.tree_element);
        this.state_proxy = state_proxy;
        this.messaging_system.addEventListener(this.messaging_system.events.StateChanged, new EventListener(this, this.stateChanged));
        this.loadView();
    };
    TreeView.prototype.addNode = function(dataProxy){
        this.nodes.push(new TreeNode(this.tree_element, dataProxy, this.messaging_system));
    };
    TreeView.prototype.stateChanged = function(signal, data){
        this.loadView();
    };
    TreeView.prototype.loadView = function(){
        this.tree_element.empty();
        this.nodes.length = "";
        var sub_nodes = this.state_proxy.getSubNodes();
        for(var i = 0; i < sub_nodes.length; ++i){
            this.addNode(sub_nodes[i]);
        }
    };
    return TreeView;
});
