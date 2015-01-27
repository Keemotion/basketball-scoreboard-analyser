define(["../../messaging_system/events/selection_event",
		"../../messaging_system/event_listener",
		"../../messaging_system/events/edit_mode_selection_event",
		"../../messaging_system/events/submit_group_details_event",
		"../../model/configuration_key",
		"../../messaging_system/events/tree_node_expand_event"],
	function(SelectionEvent, EventListener, EditModeSelectionEvent, SubmitGroupDetailsEvent, ConfigurationKey, TreeNodeExpandEvent){
		var BaseTreeNode = function(){
		};
		BaseTreeNode.prototype.init = function(parent_node, data_proxy, messaging_system){
			this.parent_node = parent_node;
			this.data_proxy = data_proxy;
			this.expanded = false;
			this.messaging_system = messaging_system;
			this.commands = new Array();
			this.sub_tree_nodes = new Array();
			this.is_selected = false;
			this.detached = false;
			this.first_time_added = true;
			//this.setUpdateListeners(data_proxy.getUpdateEvents());
			this.selectionChangedListener = new EventListener(this, this.selectionChanged);
			this.messaging_system.addEventListener(this.messaging_system.events.SelectionChanged, this.selectionChangedListener);
			this.expandListener = new EventListener(this, this.treeNodeExpandRequested);
			this.messaging_system.addEventListener(this.messaging_system.events.ExpandTreeNode, this.expandListener);
			this.messaging_system.addEventListener(this.messaging_system.events.CollapseTreeNode, this.expandListener);
			this.groupChangedListener = new EventListener(this, this.updated);
			this.messaging_system.addEventListener(this.messaging_system.events.GroupChanged, this.groupChangedListener);
			this.removeGroupListener = new EventListener(this, this.groupRemoved);
			this.messaging_system.addEventListener(this.messaging_system.events.RemoveGroup, this.removeGroupListener);
			//TODO: clean-up event listeners when object is destroyed
		};
		BaseTreeNode.prototype.cleanUp = function(){
			this.messaging_system.removeEventListener(this.messaging_system.events.SelectionChanged, this.selectionChangedListener);
			this.messaging_system.removeEventListener(this.messaging_system.events.ExpandTreeNode, this.expandListener);
			this.messaging_system.removeEventListener(this.messaging_system.events.CollapseTreeNode, this.expandListener);
			this.messaging_system.removeEventListener(this.messaging_system.events.GroupChanged, this.groupChangedListener);
			this.messaging_system.removeEventListener(this.messaging_system.events.RemoveGroup, this.removeGroupListener);
		};
		BaseTreeNode.prototype.groupRemoved = function(signal, data){
			if(this.getProxy().isPossiblyAboutThis(data.getTargetIdentification())){
				this.cleanUp();
			}
		};
		BaseTreeNode.prototype.addCommand = function(command){
			this.commands.push(command);
		};
		BaseTreeNode.prototype.clearCommands = function(){
			this.commands.length = 0;
		};
		BaseTreeNode.prototype.treeNodeExpandRequested = function(signal, data, forced){
			if(!forced && !this.getProxy().isPossiblyAboutThis(data.getTargetIdentification())){
				return;
			}
			switch(signal){
				case this.messaging_system.events.ExpandTreeNode:
					this.expanded = true;
					if(this.parent_node){
						this.parent_node.treeNodeExpandRequested(signal, data, true);
					}
					break;
				case this.messaging_system.events.CollapseTreeNode:
					this.expanded = false;
					break;
				default:
					break;
			}
			this.applyCollapse();
		};
		BaseTreeNode.prototype.isExpanded = function(){
			return this.expanded;
		};
		BaseTreeNode.prototype.applyCollapse = function(){
			if(this.isExpanded()){
				this.expand();
			}else{
				this.collapse();
			}
		};
		BaseTreeNode.prototype.collapse = function(){
			this.collapse_button_collapse_icon.hide();
			this.collapse_button_expand_icon.show();
			this.sub_nodes_element.removeClass('in');
			this.configuration_element.removeClass('in');
		};
		BaseTreeNode.prototype.expand = function(){
			this.sub_nodes_element.addClass('in');
			this.configuration_element.addClass('in');
			this.collapse_button_expand_icon.hide();
			this.collapse_button_collapse_icon.show();
		};
		BaseTreeNode.prototype.loadContent = function(element){
			var self = this;
			this.element = element;
			this.element.empty();

			this.title_div = $('<div>').addClass('input-group input-group-sm').click(
				function(){
					var e = new SelectionEvent(self.data_proxy
						.getSelectionTree());
					self.messaging_system.fire(
						self.messaging_system.events.SelectionSet, e);
					return false;
				});

			this.id_element = $('<input>').attr('type', 'hidden').attr('name', 'id');
			this.title_div.append(this.id_element);

			this.collapse_button_collapse_icon = $('<i>').addClass(
				'fa fa-toggle-up').hide();
			this.collapse_button_expand_icon = $('<i>').addClass(
				'fa fa-toggle-down');
			this.collapse_button = $('<button>').addClass('btn').click(
				function(){
					if(self.isExpanded()){
						self.messaging_system.fire(self.messaging_system.events.CollapseTreeNode, new TreeNodeExpandEvent(self.getProxy().getIdentification()));
					}else{
						self.messaging_system.fire(self.messaging_system.events.ExpandTreeNode, new TreeNodeExpandEvent(self.getProxy().getIdentification()));
					}
					return false;
				}).append(this.collapse_button_collapse_icon).append(
				this.collapse_button_expand_icon);
			this.title_div.append($('<span>').addClass('input-group-btn').append(this.collapse_button));

			this.title_span = $('<input>').addClass('form-control input-sm').change(function(){
				var data = new Object();
				data.name = $(this).val();
				self.messaging_system.fire(self.messaging_system.events.SubmitGroupDetails, new SubmitGroupDetailsEvent(self.data_proxy.getIdentification(), data, true));
			}).css({}).focus(function(){
				$(this).select();
			}).prop('readonly', !this.nameEditable());
			this.title_div.append(this.title_span);

			this.commands_div = $('<span>').addClass('input-group-btn');
			for(var i = 0; i < this.commands.length; ++i){
				this.commands_div.append(this.commands[i].clone(true));
			}
			this.title_div.append(this.commands_div);

			this.element.append(this.title_div);

			this.sub_nodes_element = $('<div>').addClass('collapse').on('show.bs.collapse',
				function(){
					self.collapse_button_expand_icon.hide();
					self.collapse_button_collapse_icon.show();
				}).on('hide.bs.collapse', function(){
					self.collapse_button_collapse_icon.hide();
					self.collapse_button_expand_icon.show();
				});
			this.configuration_element = $('<div>').addClass('collapse');
			this.element.append(this.configuration_element);
			this.element.append(this.sub_nodes_element);
			this.loadSubNodesContent();
			this.loadConfigurationContent();
			this.updateContent();
			this.applyCollapse();
			this.addedToDOM();
			this.first_time_added = false;
		};
		BaseTreeNode.prototype.addedToDOM = function(){

		};
		BaseTreeNode.prototype.updateContent = function(){
			if(this.data_proxy.getId() != this.id_element.val()){
				this.id_element.val(this.data_proxy.getId());
			}
			if(this.title_span.val() != this.data_proxy.getTitle()){
				this.title_span.val(this.data_proxy.getTitle());
			}
			if(this.data_proxy.isComplete()){
				this.title_span.css('font-weight', 'normal');
			}else{
				this.title_span.css('font-weight', 'bold');
			}
			if(this.is_selected){
				this.title_span.css('text-decoration', 'underline');
			}else{
				this.title_span.css('text-decoration', 'none');
			}
			if(this.sub_tree_nodes.length > 0){
				this.collapse_button.css('visibility', 'visible');
			}else{
				this.collapse_button.css('visibility', 'hidden');
			}
		};
		BaseTreeNode.prototype.loadConfigurationContent = function(){
			this.configuration_element.empty();
			this.configuration_list = $('<ul>');
			var configuration_keys = this.getProxy().getConfigurationKeys();

			for(var k in configuration_keys){
				this.add_configuration(k, configuration_keys[k]);
			}
			this.configuration_element.append(this.configuration_list);
		};
		BaseTreeNode.prototype.add_configuration = function(key, value){
			var self = this;
			var value_element;
			var key_element = $('<select>').attr('id', 'key').addClass('key-element').change(
				function(){
					value_element.val('');
					self.submitConfigurationKeys();
				});
			var keys = ConfigurationKey.getKeyOptions();
			for(var i = 0; i < keys.length; ++i){
				key_element.append($('<option>').attr('value', keys[i])
					.text(keys[i]));
			}
			if(key != null){
				key_element.val(key);
				var options = ConfigurationKey.getPossibleValues(key);
				if(options instanceof Array){
					value_element = $('<select>');
					for(var i = 0; i < options.length; ++i){
						value_element.append($('<option>').text(options[i])
							.attr('value', options[i]));
					}
				}else if(options == "numeric" || options == "text"){
					value_element = $('<input>');
				}else{
					value_element = $('<input>');
				}
			}else{
				value = "";
				value_element = $('<input>');
			}
			value_element.attr('id', 'value').change(function(){
				self.submitConfigurationKeys();
			}).addClass('value-element').val(value);
			var li = $('<li>')
				.append(key_element).append(value_element).append(
				$('<button>').addClass('btn btn-small btn-default')
					.text('x').click(function(){
						li.remove();
						self.submitConfigurationKeys();
					}));
			this.configuration_list.append(li);
			if(value_element.val() != value){
				self.submitConfigurationKeys();
			}
		};
		BaseTreeNode.prototype.submitConfigurationKeys = function(){
			var configuration_keys = new Object();
			this.configuration_list.find('li').each(function(){
				var value = $(this).find('#value').val();
				var key = $(this).find('#key').val();
				configuration_keys[key] = value;
			});
			var data = new Object();
			data.configuration_keys = configuration_keys;
			this.messaging_system.fire(this.messaging_system.events.SubmitGroupDetails, new SubmitGroupDetailsEvent(this.getProxy().getIdentification(), data, true));
		};
		BaseTreeNode.prototype.loadSubNodesContent = function(){
			this.sub_nodes_list = $('<ul>');
			for(var i = 0; i < this.sub_tree_nodes.length; ++i){
				var li = $('<li>');
				this.sub_nodes_list.append(li);
				this.sub_tree_nodes[i].loadContent(li);
			}
			this.sub_nodes_element.append(this.sub_nodes_list);
		};
		BaseTreeNode.prototype.update = function(){
			this.updateContent();
			for(var i = 0; i < this.sub_tree_nodes.length; ++i){
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
		BaseTreeNode.prototype.updated = function(signal, data){
			var identification = data.getTargetIdentification();
			if(this.data_proxy.isPossiblyAboutThis(identification)){
				//console.log("structural change: "+data.isStructuralChange());
				if(data.isStructuralChange()){
					this.loadSubNodes();
					this.loadContent(this.element);
				}
				this.update();
			}
		};
		BaseTreeNode.prototype.nameEditable = function(){
			return false;
		};
		BaseTreeNode.prototype.showConfiguration = function(){
			return false;
		};
		BaseTreeNode.prototype.getProxy = function(){
			return this.data_proxy;
		};
		BaseTreeNode.prototype.loadSubNodes = function(){
		};
		BaseTreeNode.prototype.detach = function(){
			this.element.detach();
			this.detached = true;
		};
		BaseTreeNode.prototype.appendTo = function(element){
			element.append(this.element);
			this.detached = false;
		};
		BaseTreeNode.prototype.is_detached = function(){
			return this.detached;
		};
		BaseTreeNode.prototype.selectionChanged = function(signal, data){
			if(data.getTree().isSelected(this.getProxy().getIdentification())){
				this.is_selected = true;
				/*if(this.nameEditable()){
					this.title_span.select();
				}*/
			}else{
				this.is_selected = false;
			}
			this.updateContent();
		};
		return BaseTreeNode;
	});