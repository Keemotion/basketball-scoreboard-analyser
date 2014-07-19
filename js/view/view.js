define([
		'./canvas/canvas',
		'./stateview/load_state_component',
		'./treeview/treeview',
		'./detailsview/group_detailsview',
		'../messaging_system/event_listener',
		'./canvas/display_tree',
		'./stateview/current_state_component',
		"../model/selection_tree",
		"../model/selection_node",
		"../messaging_system/events/selection_event",
		"./detailsview/details_view"
		]
	, function(
		MyCanvas,
		LoadStateComponent,
		TreeView,
		GroupDetailsView,
		EventListener,
		DisplayTree,
		CurrentStateComponent,
		SelectionTree,
		SelectionNode,
		SelectionEvent,
		DetailsView
		){
	//View represents the GUI
	var View = function(controller, target_view, messaging_system){
		this.messaging_system = messaging_system;
		this.controller = controller;
		this.official_selection_tree = new SelectionTree();
		this.current_selection_tree = new SelectionTree();
		this.element = target_view;
		this.element.html('');
		this.canvas_container_div = $('<div>').attr({
				class: 'div_horizontal',
				id: 'div_image'
			});
		this.current_state_div = $('<div>').attr({
				class:'div_state',
				id: 'div_current_state'
			});
	  	this.load_state_div = $('<div>').attr({
  				class:'div_state',
  				id:'div_load_state'
  			});
		this.state_container_div = $('<div>').attr({
				class: 'div_horizontal',
				id: 'div_state_container'
			})
			.append(this.current_state_div)
			.append(this.load_state_div);
		this.left_container_div = $('<div>').attr({
				class: 'div_vertical',
				id:'div_main_container'
			})
			.append(this.canvas_container_div)
			.append(this.state_container_div);
		this.toolbox_tree_div = $('<div>').attr({
				id:'div_toolbox_objects_tree',
			});
		this.toolbox_details_div = $('<div>').attr({
				id:'div_toolbox_objects_details'
			});
		this.right_container_div = $('<div>').attr({
				class:'div_vertical',
				id:'div_toolbox'
			})
			.append(this.toolbox_tree_div)
			.append($('<hr>'))
			.append(this.toolbox_details_div);
		this.element.append(this.left_container_div)
			.append(this.right_container_div);

		//the canvas
		this.canvas = new MyCanvas(this, this.canvas_container_div, this.controller.getModel().getState().getProxy(), this.messaging_system);
		//the export field
		this.current_state_component = new CurrentStateComponent(this.current_state_div, this.controller.getModel().getState().getProxy(), this.messaging_system);
		//the import field
		this.loadStateComponent = new LoadStateComponent(this.load_state_div, this.messaging_system);
		//the tree
		this.tree_view = new TreeView(this.toolbox_tree_div, this.controller.getModel().getState().getProxy(), this.messaging_system);
		//details view
		this.details_view = new DetailsView(this, this.toolbox_details_div, this.messaging_system);

		//this.messaging_system.addEventListener(this.messaging_system.events.GroupClicked, new EventListener(this,this.groupClicked));
		this.messaging_system.addEventListener(this.messaging_system.events.StateChanged, new EventListener(this, this.stateChanged));

		this.messaging_system.addEventListener(this.messaging_system.events.SelectionAdded, new EventListener(this, this.selectionAdded));
		this.messaging_system.addEventListener(this.messaging_system.events.SelectionRemoved, new EventListener(this, this.selectionRemoved));
		this.messaging_system.addEventListener(this.messaging_system.events.SelectionToggled, new EventListener(this, this.selectionToggled));
		this.messaging_system.addEventListener(this.messaging_system.events.SelectionSet, new EventListener(this, this.selectionSet));
		this.messaging_system.addEventListener(this.messaging_system.events.SelectionReset, new EventListener(this, this.selectionReset));

		window.addEventListener('resize', function(){
			messaging_system.fire(messaging_system.events.WindowResized, null);
		});
	};
	View.prototype.getCurrentSelectionTree = function(){
		return this.current_selection_tree;
	};
	View.prototype.selectionAdded = function(signal, data){
		this.current_selection_tree = this.official_selection_tree.clone();
		this.current_selection_tree.addSelection(data.getTree());
		if(!data.getTemporary()){
			this.official_selection_tree = this.current_selection_tree.clone();
		}
		this.notifySelectionChanged();
	};
	View.prototype.selectionRemoved = function(signal, data){
		console.log("TO BE IMPLEMENTED: selection removed: "+JSON.stringify(data));
		this.notifySelectionChanged();
	};
	View.prototype.selectionToggled = function(signal, data){
		this.current_selection_tree = this.official_selection_tree.clone();
		this.current_selection_tree.toggleSelection(data.getTree());
		if(!data.getTemporary()){
			this.official_selection_tree = this.current_selection_tree.clone();
		}
		this.notifySelectionChanged();
	};
	View.prototype.selectionSet = function(signal, data){
		this.current_selection_tree = data.getTree().clone();
		this.official_selection_tree = data.getTree().clone();
		this.notifySelectionChanged();
	};
	View.prototype.selectionReset = function(signal, data){
		this.current_selection_tree = new SelectionTree();
		this.official_selection_tree = new SelectionTree();
		this.notifySelectionChanged();
	};
	View.prototype.notifySelectionChanged = function(){
		this.messaging_system.fire(this.messaging_system.events.SelectionChanged, new SelectionEvent(this.getCurrentSelectionTree()));
	};
	/*View.prototype.groupClicked = function(signal, data){
		if(data.data_proxy.getType() == "group"){
			this.loadGroupDetails(data.data_proxy);
		}
	};
	View.prototype.clearGroupDetails = function(){
		if(this.toolbox_details_content){
			this.toolbox_details_content.cleanUp();
		}
		this.toolbox_details_div.empty();
	};
	View.prototype.loadGroupDetails = function(data_proxy){
		this.clearGroupDetails();
		this.toolbox_details_content = new GroupDetailsView(this.toolbox_details_div,data_proxy, this.messaging_system);
	};*/
	View.prototype.stateChanged = function(signal, data){
		this.canvas.setProxy(this.controller.getModel().getState().getProxy());
		this.current_state_component.setProxy(this.controller.getModel().getState().getProxy());
		this.tree_view.setProxy(this.controller.getModel().getState().getProxy());
		this.selectionReset(signal, data);
		//this.clearGroupDetails();
	};
	return View;
});

