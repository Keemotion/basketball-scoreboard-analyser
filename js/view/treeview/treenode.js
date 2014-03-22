define(['../../messaging_system/event_listener'], function(EventListener){
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
    var TreeNode = function(target_view, data_proxy, messaging_system, on_root_level){
    	this.on_root_level = on_root_level;
        this.messaging_system = messaging_system;
        this.data_proxy = data_proxy;
        this.sub_nodes = new Array();
		this.title = "";
		this.id_element = $('<input>').attr({'type':'hidden', 'name':'id'}).val('-1');
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
                'class':'collapsed',
                'draggable':this.on_root_level
            })
            .append(this.id_element)
            .append(this.tree_controls_element)
            .append(this.title_element)
            .append(this.sub_nodes_element)
            .click(function(){
                var data = new Object();
                data.data_proxy = data_proxy;
                messaging_system.fire(messaging_system.events.GroupClicked, data);
                if(data_proxy.getType() == "group"){
                	return false;
                }
            });
        
        this.lock_depth = 0;
        target_view.append(this.node_element);
        this.loadData();
		this.setUpdateListeners(this.data_proxy.getUpdateEvents());
    };
	TreeNode.prototype.setUpdateListeners = function(events){
		for(var i = 0; i < events.length; ++i){
			this.messaging_system.addEventListener(events[i],new EventListener(this, this.updated));
		}
	};
	TreeNode.prototype.update = function(){
		this.setTitle(this.data_proxy.getTitle());
		this.setId(this.data_proxy.getId());
		for(var i = 0; i < this.sub_nodes.length; ++i){
			this.sub_nodes[i].update();
		}
	};
	TreeNode.prototype.updated = function(signal, data){
		var identification = data.getTarget();
		if(this.data_proxy.isPossiblyAboutThis(identification)){	
			this.update(data.getGroupId());
		}
	};
	TreeNode.prototype.addSubNode = function(data, id){
		var tree_node = new TreeNode(this.sub_nodes_element, data, this.messaging_system, false);
        this.sub_nodes.push(tree_node);
        tree_node.setId(id);
        this.subNodesChanged();
    };
    TreeNode.prototype.setTitle = function(title){
        this.title = title;
        if(title == null){
        	this.title_element.html("&nbsp;");	
        }else{
        	this.title_element.html(title);
        }
    };
    TreeNode.prototype.setId = function(id){
        this.id = id;
        this.id_element.val(id);
    };
    TreeNode.prototype.setSubNodes = function(sub_nodes){
        if(!sub_nodes){
            return;
        }
        this.sub_nodes.length = 0;
		this.sub_nodes_element.empty();
        for(var i = 0; i < sub_nodes.length; ++i){
            this.addSubNode(sub_nodes[i], i);
        }
        this.subNodesChanged();
    };
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
