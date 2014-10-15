define([
		'./canvas/canvas',
		'./treeview/treeview',
		'../messaging_system/event_listener',
		'./canvas/display_tree',
		"../model/selection_tree",
		"../model/selection_node",
		"../messaging_system/events/selection_event",
		"./toolbar/toolbar",
		"../messaging_system/events/edit_mode_selection_event"
	]
	, function(MyCanvas, TreeView, EventListener, DisplayTree, SelectionTree, SelectionNode, SelectionEvent,
	           ToolBar, EditModeSelectionEvent){
		//View represents the GUI
		var View = function(controller, target_view, messaging_system){
			this.messaging_system = messaging_system;
			this.controller = controller;
			this.official_selection_tree = new SelectionTree();
			this.current_selection_tree = new SelectionTree();
			this.element = target_view;
			this.element.html('');
			this.canvas_container_div = $('<div>').attr({
				class : 'div_horizontal',
				id : 'div_image'
			});
			this.toolbar_div = $('<div>');
			this.toolbar_container_div = $('<div>').attr({
				class : 'div_horizontal',
				id : 'div_toolbar_container'
			})
				.append(this.toolbar_div);
			this.left_container_div = $('<div>').attr({
				class : 'div_vertical',
				id : 'div_main_container'
			})
				.append(this.canvas_container_div)
				.append(this.toolbar_container_div);
			this.toolbox_tree_div = $('<div>').attr({
				id : 'div_toolbox_objects_tree'
			});
			this.right_container_div = $('<div>').attr({
				class : 'div_vertical',
				id : 'div_toolbox'
			})
				.append(this.toolbox_tree_div)
			this.element.append(this.left_container_div)
				.append(this.right_container_div);

			//the canvas
			this.canvas = new MyCanvas(this, this.canvas_container_div, this.controller.getModel().getState().getProxy(), this.messaging_system);
			//the tree
			this.toolbar_component = new ToolBar(this.toolbar_div, this.controller.getModel().getState().getProxy(), this.messaging_system);
			this.tree_view = new TreeView(this.toolbox_tree_div, this.controller.getModel().getState().getProxy(), this.messaging_system);
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
			this.current_selection_tree = this.official_selection_tree.clone();
			this.current_selection_tree.removeSelection(data.getTree());
			if(!data.getTemporary()){
				this.official_selection_tree = this.current_selection_tree.clone();
			}
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
			this.messaging_system.fire(this.messaging_system.events.EditModeSelectionSet, new EditModeSelectionEvent(null));
		};
		View.prototype.notifySelectionChanged = function(){
			this.messaging_system.fire(this.messaging_system.events.SelectionChanged, new SelectionEvent(this.getCurrentSelectionTree()));
		};
		View.prototype.stateChanged = function(signal, data){
			this.canvas.setProxy(this.controller.getModel().getState().getProxy());
			this.toolbar_component.setProxy(this.controller.getModel().getState().getProxy());
			this.tree_view.setProxy(this.controller.getModel().getState().getProxy());
			this.selectionReset(signal, data);
		};
		return View;
	});

