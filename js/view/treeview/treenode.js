define([], function(){
    var ExpandCommand = function(){
        var element = $('<span>').attr({
            'class':'command expand_command'
            })
            .html('&gt;&nbsp;')
            .click(function(e){
                $(this).closest('li').removeClass('collapsed').addClass('expanded');
                return false;
            });
        return element;
    };
    var CollapseCommand = function(){
        var element = $('<span>').attr({
            'class':'command collapse_command'
            })
            .html('v&nbsp;')
            .click(function(e){
                $(this).closest('li').removeClass('expanded').addClass('collapsed');
                return false;
            });
        return element;
    };
    var TreeNode = function(target_view, data_proxy, messaging_system){
        this.messaging_system = messaging_system;
        this.data_proxy = data_proxy;
        this.sub_nodes = new Array();
        this.title_element = $('<span>').attr({
            'class':'span_li_title'
        });
        this.sub_nodes_element = $('<ul>').attr({
            'class':'tree_node_subnodes_list'
        });
        this.tree_controls_element = $('<div>')
            .attr({
                'class':'tree_controls_container'
            })
            .append(new ExpandCommand())
            .append(new CollapseCommand());
        this.node_element = $('<li>')
            .attr({
                'class':'expanded'
            })
            .append(this.tree_controls_element)
            .append(this.title_element)
            .append(this.sub_nodes_element)
            .click(function(){
                var data = new Object();
                data.data_proxy = data_proxy;
                messaging_system.fire(messaging_system.events.LabelObjectClicked, data);
            });
        this.lock_depth = 0;
        target_view.append(this.node_element);
        this.loadData();
    };
    TreeNode.prototype.addSubNode = function(data){
        this.subNodesChanged();
        this.sub_nodes.push(new TreeNode(this.sub_nodes_element, data, this.messaging_system));
    };
    TreeNode.prototype.setTitle = function(title){
        this.title = title;
        this.title_element.text(title);
    };
    TreeNode.prototype.setId = function(id){
        this.id = id;
        this.node_element.attr('id', 'tree_node_'+id);
    };
    TreeNode.prototype.setSubNodes = function(sub_nodes){
        if(!sub_nodes){
            return;
        }
        this.sub_nodes.length = 0;
        for(var i = 0; i < sub_nodes.length; ++i){
            this.addSubNode(sub_nodes[i]);
        }
        this.subNodesChanged();
    }
    TreeNode.prototype.subNodesChanged = function(){
        if(this.sub_nodes.length > 0){
            this.tree_controls_element.show();
        }else{
            this.tree_controls_element.hide();
        }
    };
    TreeNode.prototype.loadData = function(){
        this.setTitle(this.data_proxy.getTitle());
        this.setId(this.data_proxy.getId());
        this.setSubNodes(this.data_proxy.getSubNodes());
    };
    return TreeNode;
});
