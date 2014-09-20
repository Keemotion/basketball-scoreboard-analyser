define(["../../messaging_system/events/selection_event",
        "../../messaging_system/event_listener",
        "../../messaging_system/events/edit_mode_selection_event",
        "../../messaging_system/events/submit_group_details_event"], function(SelectionEvent, EventListener, EditModeSelectionEvent, SubmitGroupDetailsEvent) {
	var BaseTreeNode = function() {
	};
	BaseTreeNode.prototype.init = function(parent_node, data_proxy,
			messaging_system) {
		this.parent_node = parent_node;
		this.data_proxy = data_proxy;
		this.messaging_system = messaging_system;
		this.commands = new Array();
		this.sub_tree_nodes = new Array();
		this.is_selected = false;
		this.setUpdateListeners(data_proxy.getUpdateEvents());
		this.editModeSelectionSetListener = new EventListener(this, this.editModeSelectionSet);
		this.messaging_system.addEventListener(this.messaging_system.events.EditModeSelectionSet, this.editModeSelectionSetListener);
	};
	BaseTreeNode.prototype.addCommand = function(command) {
		this.commands.push(command);
	};
	BaseTreeNode.prototype.clearCommands = function(){
		this.commands.length = 0;
	};
	BaseTreeNode.prototype.collapse = function(){
		//this.sub_nodes_element.collapse('hide');
		this.collapse_button_collapse_icon.hide();
		this.collapse_button_expand_icon.show();
		this.sub_nodes_element.removeClass('in');
	};
	BaseTreeNode.prototype.expand = function(){
		if(this.parent_node){
			this.parent_node.expand();
		}
		//this.sub_nodes_element.collapse('show');
		this.sub_nodes_element.addClass('in');
		this.collapse_button_expand_icon.hide();
		this.collapse_button_collapse_icon.show();
	};
	
	BaseTreeNode.prototype.editModeSelectionSet = function(signal, data){
		//if data.getProxy() is about this.data_proxy or one of its (grand..)children
		this.is_selected = false;
		if(data.getProxy() == null){
			this.collapse();
		}else if(this.data_proxy.isPossiblyAboutThis(data.getProxy().getIdentification())){
			this.expand();
			this.collapse();
			this.is_selected = true;
			if(this.nameEditable()){
				this.title_span.select();
			}
		}else{
			if(!this.data_proxy.isAncestorOf(data.getProxy())){
				this.collapse();
			}else{
				this.expand();
			}
		}
		this.updateContent();
		/*if(this.data_proxy.getType() != 'corner'){
			console.log("own identification = "+JSON.stringify(this.data_proxy.getIdentification()));
			console.log("selection's identification = "+JSON.stringify(data.getProxy().getIdentification()));
		}
		if(this.data_proxy.isAncestorOf(data.getProxy())){
			console.log("ancestor!");
			if(this.data_proxy.getType() == "digit"){
				console.log("hide digit!");
				this.sub_nodes_element.collapse('hide');
			}else{
				this.sub_nodes_element.collapse('show');
			}
		}else{
			console.log("no ancestor!");
			this.sub_nodes_element.collapse('hide');
		}*/
	};
	BaseTreeNode.prototype.loadContent = function(element) {
		var self = this;
		this.element = element;
		this.id_element = $('<input>').attr('type', 'hidden').attr('name', 'id');
		this.title_div = $('<div>').click(
				function() {
					var e = new SelectionEvent(self.data_proxy
							.getSelectionTree());
					self.messaging_system.fire(
							self.messaging_system.events.SelectionSet, e);
					var e2 = new EditModeSelectionEvent(self.data_proxy);
					self.messaging_system.fire(self.messaging_system.events.EditModeSelectionSet, e2);
					return false;
				});

		this.commands_div = $('<div>').addClass('btn-group');
		for (var i = 0; i < this.commands.length; ++i) {
			this.commands[i].detach();
			this.commands_div.append(this.commands[i]);
		}
		this.element.empty();
		this.element.append(this.id_element);

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
		this.title_span = $('<input>').change(function(){
			var data = new Object();
			data.name = $(this).val();
			self.messaging_system.fire(self.messaging_system.events.SubmitGroupDetails, new SubmitGroupDetailsEvent(self.data_proxy.getIdentification(), data, true));
		}).focus(function(){$(this).select();}).prop('readonly', !this.nameEditable());
		/*this.title_span = $('<a>').editable({
			type: 'text',
			title: 'Name',
			mode:'inline',
			name:'name',
			pk:1,
			send:"never",
			url:'/index.html',
			success:function(response, new_value){
				console.log("success");
				var data = new Object();
				data.name = new_value;
				self.messaging_system.fire(self.messaging_system.events.SubmitGroupDetails, new SubmitGroupDetailsEvent(self.data_proxy, data, true));
			}
		}).on('save', function(){
			console.log("saved!");
		});*/
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
		this.id_element.val(this.data_proxy.getId());
		this.title_span.val(this.data_proxy.getTitle());
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
	BaseTreeNode.prototype.nameEditable = function(){
		return false;
	};
	BaseTreeNode.prototype.loadSubNodes = function(){};
	return BaseTreeNode;
});