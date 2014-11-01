define([
		"../../../messaging_system/event_listener",
		"../../../model/coordinate",
		"../../../messaging_system/events/selection_event",
		"../../../messaging_system/events/objects_moved_event",
		"../../../messaging_system/events/mouse_mode_changed_event",
		"../../../messaging_system/events/auto_detect_digit_area_selected_event",
		"../../../image_processing/digit_detector",
		"../../../messaging_system/events/digit_added_event",
		"../../../messaging_system/events/edit_mode_selection_event",
		"../../../messaging_system/events/submit_group_details_event",
		"../../../messaging_system/events/remove_group_event",
		"../../../messaging_system/events/dot_added_event",
		"../../../messaging_system/events/group_changed_event",
		"../../../messaging_system/events/digit_corners_listen_event",
		"../../../messaging_system/events/add_element_event",
		"../../../messaging_system/events/move_mode_objects_moved_event",
		"../../../messaging_system/events/tree_node_expand_event",
		"require",
		"../../view"]
	, function(EventListener, Coordinate, SelectionEvent, ObjectsMovedEvent, MouseModeChangedEvent, AutoDetectDigitAreaSelectedEvent, DigitDetector, DigitAddedEvent, EditModeSelectionEvent, SubmitGroupDetailsEvent, RemoveGroupEvent, DotAddedEvent, GroupChangedEvent, DigitCornersListenEvent, AddElementEvent, MoveModeObjectsMovedEvent, TreeNodeExpandEvent, require, View){
		var SelectionRectangle = function(){
			this.start_coordinate = new Coordinate();
			this.end_coordinate = new Coordinate();
			this.active = false;
		};
		SelectionRectangle.prototype.getActive = function(){
			return this.active;
		};
		SelectionRectangle.prototype.getTopLeft = function(){
			return new Coordinate(Math.min(this.start_coordinate.getX(), this.end_coordinate.getX()), Math.min(this.start_coordinate.getY(), this.end_coordinate.getY()));
		};
		SelectionRectangle.prototype.getTopRight = function(){
			return new Coordinate(Math.max(this.start_coordinate.getX(), this.end_coordinate.getX()), Math.min(this.start_coordinate.getY(), this.end_coordinate.getY()));
		};
		SelectionRectangle.prototype.getBottomRight = function(){
			return new Coordinate(Math.max(this.start_coordinate.getX(), this.end_coordinate.getX()), Math.max(this.start_coordinate.getY(), this.end_coordinate.getY()));
		};
		SelectionRectangle.prototype.getBottomLeft = function(){
			return new Coordinate(Math.min(this.start_coordinate.getX(), this.end_coordinate.getX()), Math.max(this.start_coordinate.getY(), this.end_coordinate.getY()));
		};
		SelectionRectangle.prototype.getHeight = function(){
			return Math.abs(this.start_coordinate.getY() - this.end_coordinate.getY());
		};
		SelectionRectangle.prototype.getWidth = function(){
			return Math.abs(this.start_coordinate.getX() - this.end_coordinate.getX());
		};
		SelectionRectangle.prototype.transformCanvasCoordinatesToRelativeImageCoordinates = function(transformation){
			var result = new SelectionRectangle();
			result.startSelection(transformation.transformCanvasCoordinateToRelativeImageCoordinate(this.start_coordinate));
			result.updateSelection(transformation.transformCanvasCoordinateToRelativeImageCoordinate(this.end_coordinate));
			return result;
		};
		SelectionRectangle.prototype.transformCanvasCoordinatesToAbsoluteCoordinates = function(transformation){
			var result = new SelectionRectangle();
			result.startSelection(transformation.transformCanvasCoordinateToAbsoluteImageCoordinate(this.start_coordinate));
			result.updateSelection(transformation.transformCanvasCoordinateToAbsoluteImageCoordinate(this.end_coordinate));
			return result;
		};
		SelectionRectangle.prototype.startSelection = function(coordinate){
			this.start_coordinate = coordinate.clone();
			this.end_coordinate = coordinate.clone();
			this.active = true;
		};
		SelectionRectangle.prototype.updateSelection = function(coordinate){
			this.end_coordinate = coordinate.clone();
		};
		SelectionRectangle.prototype.stopSelection = function(){
			this.active = false;
		};
		var CanvasMouseHandler = function(canvas, messaging_system){

			View = require('../../view');

			this.canvas = canvas;
			this.messaging_system = messaging_system;

			this.previous_mouse_coordinate = new Coordinate();
			this.mouse_down_time = 0;
			this.mouse_down = false;

			//this.edit_mode_selected_proxy = null;
			//this.move_mode_selected_digits = new Array();
			//this.temporary_move_mode_selected_digits = new Array();

			this.current_mouse_mode = CanvasMouseHandler.MouseModes.EditMode;
			this.previous_mouse_mode = CanvasMouseHandler.MouseModes.EditMode;
			//this.current_digit_corners_listen_for_new = false;
			this.selection_rectangle = new SelectionRectangle;

			this.messaging_system.addEventListener(this.messaging_system.events.CanvasScrolled, new EventListener(this, this.canvasScrolled));
			this.messaging_system.addEventListener(this.messaging_system.events.CanvasMouseMove, new EventListener(this, this.mouseMove));
			this.messaging_system.addEventListener(this.messaging_system.events.CanvasMouseUp, new EventListener(this, this.mouseUp));
			this.messaging_system.addEventListener(this.messaging_system.events.CanvasMouseDown, new EventListener(this, this.mouseDown));
			this.messaging_system.addEventListener(this.messaging_system.events.CanvasFocusOut, new EventListener(this, this.focusOut));
			this.messaging_system.addEventListener(this.messaging_system.events.CanvasImageClick, new EventListener(this, this.click));
			this.messaging_system.addEventListener(this.messaging_system.events.CanvasImageDoubleClick, new EventListener(this, this.doubleClick));
			this.messaging_system.addEventListener(this.messaging_system.events.CanvasKeyDown, new EventListener(this, this.keyDown));
			this.messaging_system.addEventListener(this.messaging_system.events.CanvasKeyUp, new EventListener(this, this.keyUp));

			this.messaging_system.addEventListener(this.messaging_system.events.MouseModeChanged, new EventListener(this, this.mouseModeChanged));
			this.messaging_system.addEventListener(this.messaging_system.events.EditModeSelectionSet, new EventListener(this, this.editModeSelectionSet));
			this.messaging_system.addEventListener(this.messaging_system.events.RequestEditModeSelection, new EventListener(this, this.editModeSelectionRequested));

			this.messaging_system.addEventListener(this.messaging_system.events.AutoDetectDigit, new EventListener(this, this.autoDetectDigitRequested));
			this.messaging_system.addEventListener(this.messaging_system.events.DigitCornersListen, new EventListener(this, this.digitCornersListenRequested));
			this.messaging_system.addEventListener(this.messaging_system.events.CoordinateListen, new EventListener(this, this.coordinateListenRequested));
		};
		CanvasMouseHandler.MouseModes = {
			EditMode : "EditMode",
			CanvasMode : "CanvasMode",
			SelectionMode : "SelectionMode",
			AutoDetectDigitMode : "AutoDetectDigitMode",
			SingleCoordinateListenMode : "SingleCoordinateListenMode",
			DigitCornersListenMode : "DigitCornersListenMode",
			Other : "Other"
		};
		CanvasMouseHandler.prototype.canvasScrolled = function(signal, data){
			var evt = data.event_data;
			var delta = evt.wheelDelta ? evt.wheelDelta / 40 : evt.detail ? -evt.detail : 0;
			var factor = 0;
			if(delta > 0){
				factor = 9 / 10;
			}else{
				factor = 10 / 9;
			}
			var mouse_coordinate = this.canvas.getTransformation().transformCanvasCoordinateToRelativeImageCoordinate(data.getCoordinate());
			this.canvas.getTransformation().setScale(this.canvas.getTransformation().getScale() * factor, mouse_coordinate);
			this.canvas.updateCanvas(signal, data);
			return data.event_data.preventDefault() && false;
		};
		CanvasMouseHandler.prototype.mouseMove = function(signal, data){
			/*var c = data.getCoordinate();
			var relative = this.canvas.getTransformation().transformCanvasCoordinateToRelativeImageCoordinate(c);
			var absolute = this.canvas.getTransformation().transformCanvasCoordinateToAbsoluteImageCoordinate(c);
			console.log("canvas                     = "+JSON.stringify(c));
			var rel_canvas = this.canvas.getTransformation().transformRelativeImageCoordinateToCanvasCoordinate(relative);
			var abs_canvas = this.canvas.getTransformation().transformAbsoluteImageCoordinateToCanvasCoordinate(absolute);
			console.log("canvas based on absolute   = "+JSON.stringify(abs_canvas));
			console.log("canvas based on relative   = "+JSON.stringify(rel_canvas));
			var rel_abs = this.canvas.getTransformation().transformAbsoluteImageCoordinateToRelativeImageCoordinate(absolute);
			var abs_rel = this.canvas.getTransformation().transformRelativeImageCoordinateToAbsoluteImageCoordinate(relative);
			console.log("relative                   = "+JSON.stringify(relative));
			console.log("relative based on absolute = "+JSON.stringify(rel_abs));
			console.log("absolute                   = "+JSON.stringify(absolute));
			console.log("absolute based on relative = "+JSON.stringify(abs_rel));*/
			if(this.mouse_down){
				this.mouse_dragged = true;
			}
			var application_state = this.getCanvas().getView().getApplicationState();
			console.log("current state = "+application_state);
			var transformed = this.canvas.getTransformation().transformCanvasTranslationToRelativeImageTranslation(data.getCoordinate().add(this.previous_mouse_coordinate.scalarMultiply(-1.0)));
			switch(this.current_mouse_mode){
				case CanvasMouseHandler.MouseModes.EditMode:
					//var DOWN_TIME = 100;
					if(this.mouse_down){
						/*this.selection_rectangle.updateSelection(data.getCoordinate());
						//check if inside a digit -> select that digit
						//if not inside digit, but near the selected digit -> select nearest corner of that digit and drag it (only if mouse has been down for more than 0.5 s)
						//else: try to add a new digit to the currently selected digit group (if none is selected, don't do anything)
						var mouse_release_time = new Date();
						var time_down = mouse_release_time.getTime() - this.mouse_down_time.getTime();
						if(time_down > DOWN_TIME){
							if(this.current_drag_corner_move){
								var corner_data = this.current_drag_corner_move_corner.getData();
								corner_data.coordinate = this.canvas.getTransformation().transformCanvasCoordinateToRelativeImageCoordinate(data.getCoordinate());
								this.messaging_system.fire(this.messaging_system.events.SubmitGroupDetails, new SubmitGroupDetailsEvent(this.current_drag_corner_move_corner.getIdentification(), corner_data));
							}else if(this.current_drag_dot_move){
								var dot_data = this.current_drag_dot_move_dot.getData();
								dot_data.coordinate = this.canvas.getTransformation().transformCanvasCoordinateToRelativeImageCoordinate(data.getCoordinate());
								this.messaging_system.fire(this.messaging_system.events.SubmitGroupDetails, new SubmitGroupDetailsEvent(this.current_drag_dot_move_dot.getIdentification(), dot_data));
							}
						}
*/
						switch(application_state){
							case View.ApplicationStates.MULTI_SELECTION:
								//this.messaging_system.fire(this.messaging_system.events.MoveModeObjectsMoved, new MoveModeObjectsMovedEvent(this.getMoveModeSelectedDigitsIdentifications(), transformed));
								this.messaging_system.fire(this.messaging_system.events.ObjectsMoved, new ObjectsMovedEvent(this.getCanvas().getView().getCurrentSelectionTree(), transformed));
								break;
							case View.ApplicationStates.SINGLE_SELECTION:
								if(this.mouse_down_object != null){
									console.log("moving! transformed = "+JSON.stringify(transformed));
									if(this.getCanvas().getView().getCurrentSelectionTree().hasSelectedParent(this.mouse_down_object.getIdentification())){
										console.log("selected");
										this.messaging_system.fire(this.messaging_system.events.ObjectsMoved, new ObjectsMovedEvent(this.mouse_down_object.getProxy().getSelectionTree(), transformed));
									}
								}else{
									this.selection_rectangle.updateSelection(data.getCoordinate());
								}
								break;
							case View.ApplicationStates.NO_SELECTION:
								break;
						}
						this.canvas.updateCanvas(signal, data);
					}
					break;
				case CanvasMouseHandler.MouseModes.CanvasMode:
					//move canvas
					if(this.mouse_down){
						var old_center = this.canvas.getTransformation().getCanvasCenter();
						var mv = this.canvas.getTransformation().transformCanvasTranslationToRelativeImageTranslation(data.getCoordinate().add(this.previous_mouse_coordinate.scalarMultiply(-1.0))).scalarMultiply(-1.0);
						this.canvas.getTransformation().setCanvasCenter(old_center.add(mv));
						this.canvas.updateCanvas(signal, data);
					}
					break;
				case CanvasMouseHandler.MouseModes.AutoDetectDigitMode:
					if(this.mouse_down){
						this.selection_rectangle.updateSelection(data.getCoordinate());
						this.canvas.updateCanvas(signal, data);
					}
					break;
				case CanvasMouseHandler.MouseModes.SelectionMode:
					//move selected digits at once
					if(this.mouse_down){
						if(this.moving){
							var transformed = this.canvas.getTransformation().transformCanvasTranslationToRelativeImageTranslation(data.getCoordinate().add(this.previous_mouse_coordinate.scalarMultiply(-1.0)));
							this.messaging_system.fire(this.messaging_system.events.MoveModeObjectsMoved, new MoveModeObjectsMovedEvent(this.getMoveModeSelectedDigitsIdentifications(), transformed));
						}else{
							this.updateSelection(data);
							this.canvas.updateCanvas(signal, data);
						}
					}
					break;
				case CanvasMouseHandler.MouseModes.DigitCornersListenMode:
					this.canvas.updateCanvas(signal, data);
					break;
				case CanvasMouseHandler.MouseModes.Other:
					//let another handler handle these events
					break;
			}
			this.previous_mouse_coordinate = data.getCoordinate();

		};

		CanvasMouseHandler.prototype.getEditModeSelectedGroupType = function(){
			if(this.getEditModeSelectedProxy() == null)
				return null;
			var selected_group_identification = this.getEditModeSelectedGroupIdentification();
			return selected_group_identification[selected_group_identification.length - 1]["group_type"];
		};
		CanvasMouseHandler.prototype.coordinateListenRequested = function(signal, data){
			this.coordinate_proxy = data.getProxy();
			this.messaging_system.fire(this.messaging_system.events.MouseModeChanged, new MouseModeChangedEvent(CanvasMouseHandler.MouseModes.SingleCoordinateListenMode));
		}
		CanvasMouseHandler.prototype.getTemporaryDigitCoordinates = function(){
			if(this.current_mouse_mode != CanvasMouseHandler.MouseModes.DigitCornersListenMode){
				return null;
			}
			var coordinates = new Array();
			var sub_nodes = this.digit_corners_proxy.getSubNodes();
			for(var i = 0; i < sub_nodes.length; ++i){
				if(sub_nodes[i].getCoordinate().isValid()){
					coordinates.push(sub_nodes[i].getCoordinate());
				}
			}
			return coordinates;
		};
		CanvasMouseHandler.prototype.digitCornersListenRequested = function(signal, data){
			this.digit_corners_proxy = data.getProxy();
			this.current_digit_corners_listen_for_new = data.isNew();
			this.current_digit_corner_index = 0;
			this.messaging_system.fire(this.messaging_system.events.GroupReset, new GroupChangedEvent(this.digit_corners_proxy.getIdentification()));
			this.messaging_system.fire(this.messaging_system.events.MouseModeChanged, new MouseModeChangedEvent(CanvasMouseHandler.MouseModes.DigitCornersListenMode));
		};
		CanvasMouseHandler.prototype.autoDetectDigitRequested = function(signal, data){
			this.auto_detect_digit_proxy = data.getProxy();
			this.messaging_system.fire(this.messaging_system.events.MouseModeChanged, new MouseModeChangedEvent(CanvasMouseHandler.MouseModes.AutoDetectDigitMode));
		};
		CanvasMouseHandler.prototype.autoDetectDigit = function(){
			console.log("autodetect");
			if(this.getSingleSelectedElementProxy().getType() != "digit"){
				return;
			}
			console.log("starting");
			var selection_rectangle = this.selection_rectangle.transformCanvasCoordinatesToAbsoluteCoordinates(this.canvas.getTransformation());
			var img = this.canvas.getImage();
			var top_left = selection_rectangle.getTopLeft();
			var bottom_right = selection_rectangle.getBottomRight();
			top_left.round();
			bottom_right.round();
			var image_part = new Array();
			var canvas = $('<canvas>')[0];
			var context = canvas.getContext("2d");
			canvas.width = img.width;
			canvas.height = img.height;
			context.mozImageSmoothingEnabled = false;
			context.webkitImageSmoothingEnabled = false;
			context.drawImage(img, 0, 0);
			var imageData = context.getImageData(0, 0, img.width, img.height);
			/*console.log("coordinates");
			console.log(JSON.stringify(top_left));
			console.log(JSON.stringify(bottom_right));*/
			for(var i = top_left.getY(); i <= bottom_right.getY(); ++i){
				image_part.push(new Array());
				for(var j = top_left.getX(); j <= bottom_right.getX(); ++j){
					var index = (i * 4) * imageData.width + (j * 4);
					var r = imageData.data[index];
					var g = imageData.data[index + 1];
					var b = imageData.data[index + 2];
					var y = (r + g + b) / 3.0;
					image_part[parseInt(i - top_left.getY())].push(y);
				}
			}
			var corners = DigitDetector.digit_corners(image_part);
			if(corners == null){
				return;
			}
			var result = new Array();
			for(var index = 0; index < 4; ++index){
				var x = corners[index].x + top_left.getX();
				var y = corners[index].y + top_left.getY();
				var coord = this.canvas.getTransformation().transformAbsoluteImageCoordinateToRelativeImageCoordinate(new Coordinate(x, y));
				result.push(coord);
			}
			var group_identification = this.getSingleSelectedElementProxy().getParent().getIdentification();
			this.messaging_system.fire(this.messaging_system.events.DigitAdded, new DigitAddedEvent(group_identification, result));
			var parent_children = this.getSingleSelectedElementProxy().getParent().getSubNodes();
			return parent_children[parent_children.length-1];
			/*if(this.current_mouse_mode == CanvasMouseHandler.MouseModes.AutoDetectDigitMode){
				var data = new Object();
				data.name = proxy.getTitle();
				for(var i = 0; i < result.length; ++i){
					result[i] = {coordinate : {"x" : result[i].x, "y" : result[i].y}};
				}
				data.corners = result;
				this.messaging_system.fire(this.messaging_system.events.SubmitGroupDetails, new SubmitGroupDetailsEvent(proxy.getIdentification(), data));
			}else{
				var group_identification = this.getEditModeSelectedGroupIdentification();
				this.messaging_system.fire(this.messaging_system.events.DigitAdded, new DigitAddedEvent(group_identification, result));
			}*/
		};
		CanvasMouseHandler.prototype.getEditModeSelectedProxy = function(){
			return this.edit_mode_selected_proxy;
		};
		CanvasMouseHandler.prototype.getEditModeSelectedGroupProxy = function(){
			return this.edit_mode_selected_proxy.getParentOfTypeProxy("group");
		};
		CanvasMouseHandler.prototype.getEditModeSelectedGroupIdentification = function(){
			return this.edit_mode_selected_proxy.getParentOfTypeIdentification("group");
		};
		CanvasMouseHandler.prototype.setEditModeSelectedObjectProxy = function(proxy){
			this.edit_mode_selected_proxy = proxy;
		};
		CanvasMouseHandler.prototype.editModeSelectionSet = function(signal, data){
			this.setEditModeSelectedObjectProxy(data.getProxy());
		};
		CanvasMouseHandler.prototype.editModeSelectionRequested = function(signal, data){
			this.sendEditModeSelection();
		};
		CanvasMouseHandler.prototype.sendEditModeSelection = function(){
			if(this.edit_mode_selected_proxy == null)
				return;
			this.messaging_system.fire(this.messaging_system.events.EditModeSelectionSet, new EditModeSelectionEvent(this.edit_mode_selected_proxy));
		};
		CanvasMouseHandler.prototype.cancelDragging = function(){
			if(this.mouse_down){
				this.mouse_down = false;
				this.selection_rectangle.stopSelection();
				this.canvas.updateCanvas(null, null);
			}
		};
		CanvasMouseHandler.prototype.mouseUp = function(signal, data){
			console.log("mouse up");
			if(!this.mouse_down){
				return;
			}
			this.mouse_down = false;
			var mouse_release_time = new Date();
			var time_down = mouse_release_time.getTime() - this.mouse_down_time.getTime();
			var application_state = this.getCanvas().getView().getApplicationState();
			switch(this.current_mouse_mode){
				case CanvasMouseHandler.MouseModes.EditMode:
					switch(application_state){
						case View.ApplicationStates.MULTI_SELECTION:

							break;
						case View.ApplicationStates.SINGLE_SELECTION:
							if(this.mouse_down_object == null){
								this.selection_rectangle.updateSelection(data.getCoordinate());
								var newly_selected = this.autoDetectDigit();
								this.setSelection(newly_selected.getSelectionTree());
							}
							this.selection_rectangle.stopSelection();
							break;
						case View.ApplicationStates.NO_SELECTION:
							break;
					}
					/*this.selection_rectangle.updateSelection(data.getCoordinate());
					var DOWN_TIME = 100;
					if(!this.mouse_dragged || time_down <= DOWN_TIME){
						var res = this.canvas.getObjectAroundCanvasCoordinate(data.getCoordinate());
						if(res){
							var e = new EditModeSelectionEvent(res.getProxy());
							this.messaging_system.fire(this.messaging_system.events.EditModeSelectionSet, e);
						}else{
							//add digit or dot to currently selected group
							if(this.getEditModeSomethingSelected()){
								switch(this.getEditModeSelectedGroupType()){
									case 'digit':
										this.messaging_system.fire(this.messaging_system.events.AddElement, new AddElementEvent("digit", this.getEditModeSelectedGroupIdentification(), null, true));
										var data2 = new DigitCornersListenEvent(this.getEditModeSelectedProxy(), true);
										this.digitCornersListenRequested(signal, data2);
										break;
									case 'dot':
										var coordinate = this.canvas.getTransformation().transformCanvasCoordinateToRelativeImageCoordinate(data.getCoordinate());
										this.messaging_system.fire(this.messaging_system.events.DotAdded, new DotAddedEvent(this.getEditModeSelectedGroupIdentification(), coordinate));
										break;
									default:
										console.log("editmodeselectedgroupidentification = " + JSON.stringify(this.getEditModeSelectedGroupIdentification()));
										break;
								}
							}
						}
						//pretend it was a click -> if inside digit -> select it
					}else{
						if(this.current_drag_corner_move){
							var corner_data = this.current_drag_corner_move_corner.getData();
							corner_data.coordinate = this.canvas.getTransformation().transformCanvasCoordinateToRelativeImageCoordinate(data.getCoordinate());
							this.messaging_system.fire(this.messaging_system.events.SubmitGroupDetails, new SubmitGroupDetailsEvent(this.current_drag_corner_move_corner.getIdentification(), corner_data));
						}else if(this.current_drag_dot_move){
							console.log("TODO: implement dot move");
							var dot_data = this.current_drag_dot_move_dot.getData();
							dot_data.coordinate = this.canvas.getTransformation().transformCanvasCoordinateToRelativeImageCoordinate(data.getCoordinate());
							this.messaging_system.fire(this.messaging_system.events.SubmitGroupDetails, new SubmitGroupDetailsEvent(this.current_drag_dot_move_dot.getIdentification(), dot_data));
						}else{
							this.autoDetectDigit();
						}
					}
					this.selection_rectangle.stopSelection();*/
					break;
				case CanvasMouseHandler.MouseModes.CanvasMode:
					this.canvas.getElement().css('cursor', '-webkit-grab');
					break;
				case CanvasMouseHandler.MouseModes.AutoDetectDigitMode:
					this.autoDetectDigit(this.auto_detect_digit_proxy);
					this.messaging_system.fire(this.messaging_system.events.MouseModeChanged, new MouseModeChangedEvent(null));
					this.selection_rectangle.stopSelection();
					break;
				case CanvasMouseHandler.MouseModes.SelectionMode:
					if(!this.moving){
						this.stopSelection(data);
					}
					this.moving = false;
					//this.updateSelection(data);
					this.canvas.drawCanvas();
					break;
				case CanvasMouseHandler.MouseModes.Other:
					break;
			}
		};
		CanvasMouseHandler.prototype.getPreviousMouseCoordinate = function(){
			return this.previous_mouse_coordinate;
		};
		CanvasMouseHandler.prototype.getEditModeSomethingSelected = function(){
			return this.getEditModeSelectedProxy() != null;
		};
		CanvasMouseHandler.prototype.mouseDown = function(signal, data){
			//console.log("mouse down");
			var application_state = this.getCanvas().getView().getApplicationState();
			var identification = null;
			if(application_state == View.ApplicationStates.SINGLE_SELECTION){
				identification = this.getSingleSelectedElementProxy().getIdentification();
			}
			var clicked_object = this.canvas.getObjectAroundCanvasCoordinate(data.getCoordinate(), identification);
			var parent_group = null;
			if(clicked_object){
				if(clicked_object.getProxy().hasParentOfType('digit')){
					parent_group = clicked_object.getProxy().getParentOfTypeProxy("digit");
				}else if(clicked_object.getProxy().hasParentOfType('dot')){
					parent_group = clicked_object.getProxy().getParentOfTypeProxy("dot");
				}
			}
			this.mouse_down_object = clicked_object;
			//console.log("mouse_down_object = "+JSON.stringify(this.mouse_down_object.getProxy().getIdentification()));
			if(this.mouse_down_object != null){
				console.log("type of mouse_down_object = "+this.mouse_down_object.getProxy().getType());
			}
			this.mouse_down = true;
			this.mouse_dragged = false;
			this.mouse_down_time = new Date();
			this.previous_mouse_coordinate = data.getCoordinate();
			switch(this.current_mouse_mode){
				case CanvasMouseHandler.MouseModes.EditMode:
					switch(application_state){
						case View.ApplicationStates.MULTI_SELECTION:
							//if not -> clear selection

							if(parent_group != null && this.getCanvas().getView().getSelectionTree().isSelected(parent_group.getIdentification())){
								//if parent_group selected, no worries
							}else{
								this.resetSelection();
							}
							break;
						case View.ApplicationStates.SINGLE_SELECTION:
							if(parent_group != null && this.getCanvas().getView().getCurrentSelectionTree().isSelected(parent_group.getIdentification())){
								//this object will be moved
							}else{
								//a new digit will be automatically added to this group
								this.mouse_down_object = null;
								this.selection_rectangle.startSelection(data.getCoordinate());
							}
							break;
						case View.ApplicationStates.NO_SELECTION:
							break;
					}
					/*var MAX_DISTANCE = 80;//px

					this.current_drag_corner_move = false;
					this.current_drag_digit_detect = false;
					this.current_drag_dot_move = false;

					if(this.getEditModeSomethingSelected() && this.getEditModeSelectedProxy().getType() == "digit"){
						//find if closest corner of selected digit (canvas coordinate) is within MAX_DISTANCE of data.getCoordinate()
						var sub_nodes = this.getEditModeSelectedProxy().getSubNodes();
						var closest_sub_node = null;
						var closest_distance = MAX_DISTANCE * MAX_DISTANCE;
						for(var i = 0; i < sub_nodes.length; ++i){
							var distance = Coordinate.getSquareDistance(data.getCoordinate(), this.canvas.getTransformation().transformRelativeImageCoordinateToCanvasCoordinate(sub_nodes[i].getCoordinate()));
							if(distance <= closest_distance){
								closest_sub_node = sub_nodes[i];
								closest_distance = distance;
							}
						}
						this.current_drag_corner_move_corner = closest_sub_node;
						if(this.current_drag_corner_move_corner == null){
							this.current_drag_corner_move = false;
						}else{
							this.current_drag_corner_move = true;
						}
					}else if(this.getEditModeSomethingSelected() && this.getEditModeSelectedGroupType() == "dot"){
						var proxy = this.getEditModeSelectedProxy();
						while(proxy.getType() != "group"){
							proxy = proxy.getParent();
						}
						var sub_nodes = proxy.getSubNodes();
						var closest_sub_node = null;
						var closest_distance = MAX_DISTANCE * MAX_DISTANCE;
						for(var i = 0; i < sub_nodes.length; ++i){
							var distance = Coordinate.getSquareDistance(data.getCoordinate(), this.canvas.getTransformation().transformRelativeImageCoordinateToCanvasCoordinate(sub_nodes[i].getCoordinate()));
							if(distance <= closest_distance){
								closest_sub_node = sub_nodes[i];
								closest_distance = distance;
							}
						}
						this.current_drag_dot_move_dot = closest_sub_node;
						if(this.current_drag_dot_move_dot == null){
							this.current_drag_dot_move = false;
						}else{
							this.current_drag_dot_move = true;
						}
					}
					if(!this.current_drag_corner_move && !this.current_drag_dot_move && this.getEditModeSelectedGroupType() == "digit"){
						this.current_drag_digit_detect = true;
					}
					if(this.current_drag_digit_detect){
						this.selection_rectangle.startSelection(data.getCoordinate());
					}*/
					break;
				case CanvasMouseHandler.MouseModes.CanvasMode:
					this.canvas.getElement().css('cursor', '-webkit-grabbing');
					break;
				case CanvasMouseHandler.MouseModes.SelectionMode:
					if(!data.getEventData().shiftKey && !data.getEventData().ctrlKey){
						this.messaging_system.fire(this.messaging_system.events.SelectionReset, null);
					}
					this.startSelection(data.getCoordinate());
					break;
				case CanvasMouseHandler.MouseModes.AutoDetectDigitMode:
					this.selection_rectangle.startSelection(data.getCoordinate());
					break;
				case CanvasMouseHandler.MouseModes.SelectionMode:
					this.moving = false;
					var res = this.canvas.getObjectAroundCanvasCoordinate(data.getCoordinate());
					if(res){
						res = res.getProxy().getParentOfTypeProxy("digit");
						if(res){
							if(this.isMoveModeSelected(res)){
								this.moving = true;
							}
						}
					}
					if(!this.moving){
						this.startSelection(data.getCoordinate());
					}
					break;
			}
		};
		CanvasMouseHandler.prototype.focusOut = function(signal, data){
			this.mouse_down = false;
		};
		CanvasMouseHandler.prototype.resetSelection = function(temporary){
			this.messaging_system.fire(this.messaging_system.events.SelectionReset, new SelectionEvent(null, temporary));
		};
		CanvasMouseHandler.prototype.setSelection = function(selection_tree, temporary){
			//console.log("fire event!");
			this.messaging_system.fire(this.messaging_system.events.SelectionSet, new SelectionEvent(selection_tree, temporary));
			//console.log("event fired");
		};
		CanvasMouseHandler.prototype.getSingleSelectedElementProxy = function(){
			//console.log("flat = "+this.getCanvas().getView().getCurrentSelectionTree().getSelectedFlat());
			return this.getCanvas().getView().getCurrentSelectionTree().getSingleSelectedElementProxy();//getSelectedFlat()[0];
		};
		CanvasMouseHandler.prototype.click = function(signal, data){
			//console.log("click");
			var clicked_object = this.canvas.getObjectAroundCanvasCoordinate(data.getCoordinate());
			var parent_group = null;
			if(clicked_object){
				if(clicked_object.getProxy().hasParentOfType('digit')){
					parent_group = clicked_object.getProxy().getParentOfTypeProxy("digit");
				}else if(clicked_object.getProxy().hasParentOfType('dot')){
					parent_group = clicked_object.getProxy().getParentOfTypeProxy("dot");
				}
			}
			var application_state = this.getCanvas().getView().getApplicationState();
			switch(this.current_mouse_mode){
				case CanvasMouseHandler.MouseModes.EditMode:
					switch(application_state){
						case View.ApplicationStates.MULTI_SELECTION:
							if(parent_group && !this.mouse_dragged){
								this.setSelection(parent_group.getSelectionTree(true, null), false);
							}else{
								this.resetSelection(false);
							}
							break;
						case View.ApplicationStates.SINGLE_SELECTION:
							if(this.mouse_dragged)
								break;
							if(!this.digit_corners_listening){
								var currently_selected_object = this.getSingleSelectedElementProxy();
								if(parent_group != null){
									if(currently_selected_object.isPossiblyAboutThis(parent_group.getIdentification())){
									}else{
										this.setSelection(parent_group.getSelectionTree(true, null), false);
									}
								}else{
									this.startDigitCornersListening(currently_selected_object.getParentOfTypeProxy("group"));
								}
							}
							if(this.digit_corners_listening){
								this.addDigitCorner(data.getCoordinate());
							}
							break;
						case View.ApplicationStates.NO_SELECTION:
							if(parent_group != null){
								this.setSelection(parent_group.getSelectionTree(true, null), false);
							}else{

							}
							break;
					}
					break;
				case CanvasMouseHandler.MouseModes.SingleCoordinateListenMode:
					var coordinate_data = new Object();
					coordinate_data.coordinate = this.canvas.getTransformation().transformCanvasCoordinateToRelativeImageCoordinate(data.getCoordinate());
					var identification = this.coordinate_proxy.getIdentification();
					this.messaging_system.fire(this.messaging_system.events.SubmitGroupDetails, new SubmitGroupDetailsEvent(identification, coordinate_data));
					this.messaging_system.fire(this.messaging_system.events.MouseModeChanged, new MouseModeChangedEvent(null));
					break;
				case CanvasMouseHandler.MouseModes.DigitCornersListenMode:
					var corner_data = new Object();
					var transformation = this.canvas.getTransformation();
					corner_data.coordinate = transformation.transformCanvasCoordinateToRelativeImageCoordinate(data.getCoordinate());
					var identification = this.digit_corners_proxy.getSubNodes()[this.current_digit_corner_index].getIdentification();
					this.messaging_system.fire(this.messaging_system.events.SubmitGroupDetails, new SubmitGroupDetailsEvent(identification, corner_data));
					this.current_digit_corner_index++;
					if(this.current_digit_corner_index >= this.digit_corners_proxy.getSubNodes().length){
						this.messaging_system.fire(this.messaging_system.events.MouseModeChanged, new MouseModeChangedEvent(null));
					}
					break;
			}
		};
		CanvasMouseHandler.prototype.startDigitCornersListening = function(group){
			this.digit_corners_listening = true;
			this.current_digit_corner_index = 0;
			this.messaging_system.fire(this.messaging_system.events.AddElement, new AddElementEvent("digit", group.getIdentification(), null, true));
			var subnodes = group.getSubNodes();
			this.current_listening_digit = subnodes[subnodes.length-1];
			this.setSelection(this.current_listening_digit.getSelectionTree(), false);
		};
		CanvasMouseHandler.prototype.addDigitCorner = function(coordinate){
			var relative_coordinate = this.getCanvas().getTransformation().transformCanvasCoordinateToRelativeImageCoordinate(coordinate);
			var corner_data = new Object();
			corner_data.coordinate = relative_coordinate;
			var identification = this.current_listening_digit.getSubNodes()[this.current_digit_corner_index].getIdentification();
			this.messaging_system.fire(this.messaging_system.events.SubmitGroupDetails, new SubmitGroupDetailsEvent(identification, corner_data));
			this.current_digit_corner_index++;
			if(this.current_digit_corner_index >= this.current_listening_digit.getSubNodes().length){
				this.digit_corners_listening = false;
			}
		};
		CanvasMouseHandler.prototype.doubleClick = function(signal, data){
			var res = this.canvas.getObjectAroundCanvasCoordinate(data.getCoordinate());
			//inside digit -> select
			if(res){
				this.messaging_system.fire(this.messaging_system.events.ExpandTreeNode, new TreeNodeExpandEvent(res.getProxy().getIdentification()));
			}else{
			}
			//inside dot
		};
		CanvasMouseHandler.prototype.keyDown = function(signal, data){
			switch(data.getEventData().which){
				case 27://escape
					if(this.current_mouse_mode == CanvasMouseHandler.MouseModes.EditMode && this.mouse_down){
						this.cancelDragging();
					}else if(this.current_mouse_mode == CanvasMouseHandler.MouseModes.DigitCornersListenMode){
						if(this.current_digit_corners_listen_for_new){
							this.messaging_system.fire(this.messaging_system.events.RemoveGroup, new RemoveGroupEvent(this.getEditModeSelectedProxy().getIdentification()));
						}else{
							this.messaging_system.fire(this.messaging_system.events.GroupReset, new GroupChangedEvent(this.digit_corners_proxy.getIdentification()));
						}
						this.messaging_system.fire(this.messaging_system.events.MouseModeChanged, new MouseModeChangedEvent(null));
					}else{
						this.messaging_system.fire(this.messaging_system.events.SelectionReset, null);
					}
					break;
				case 17://control
					if(this.current_mouse_mode != CanvasMouseHandler.MouseModes.MoveMode){
						this.messaging_system.fire(this.messaging_system.events.MouseModeChanged, new MouseModeChangedEvent(CanvasMouseHandler.MouseModes.CanvasMode));
					}
					break;
				case 46://delete
					if(this.getEditModeSelectedProxy() != null){
						var identification = this.getEditModeSelectedProxy().getIdentification();
						this.messaging_system.fire(this.messaging_system.events.EditModeSelectionSet, new EditModeSelectionEvent(null));
						this.messaging_system.fire(this.messaging_system.events.RemoveGroup, new RemoveGroupEvent(identification));
					}
			}
		};
		CanvasMouseHandler.prototype.keyUp = function(signal, data){
			switch(data.getEventData().which){
				case 17://control
					if(this.current_mouse_mode != CanvasMouseHandler.MouseModes.MoveMode){
						this.messaging_system.fire(this.messaging_system.events.MouseModeChanged, new MouseModeChangedEvent(null));
					}
					break;
			}
		};
		CanvasMouseHandler.prototype.startSelection = function(coordinate){
			this.selection_rectangle.startSelection(coordinate);
		}
		CanvasMouseHandler.prototype.stopSelection = function(data){
			this.selection_rectangle.updateSelection(data.getCoordinate());
			var selected_tree = this.canvas.getSelectionTree(this.getSelectionRectangle(), "digit");
			var digits = selected_tree.getSelectedFlat();

			if(data.getEventData().ctrlKey){
				this.addMoveModeSelectedDigits(digits, false);
			}else if(data.getEventData().shiftKey){
				this.toggleMoveModeSelectedDigits(digits, false);
			}else{
				this.setMoveModeSelectedDigits(digits, false);
			}
			this.selection_rectangle.stopSelection();
		};
		CanvasMouseHandler.prototype.updateSelection = function(data){
			this.selection_rectangle.updateSelection(data.getCoordinate());
			var selected_tree = this.canvas.getSelectionTree(this.getSelectionRectangle(), "digit");
			var digits = selected_tree.getSelectedFlat();

			if(data.getEventData().ctrlKey){
				this.addMoveModeSelectedDigits(digits, true);
			}else if(data.getEventData().shiftKey){
				this.toggleMoveModeSelectedDigits(digits, true);
			}else{
				this.setMoveModeSelectedDigits(digits, true);
			}
			this.canvas.updateCanvas();
		};
		CanvasMouseHandler.prototype.getSelectionRectangle = function(){
			return this.selection_rectangle;
		};
		CanvasMouseHandler.prototype.getMoveModeSelectedDigitsIdentifications = function(){
			var identifications = new Array();
			var digits = this.getMoveModeSelectedDigits();
			for(var i = 0; i < digits.length; ++i){
				identifications.push(digits[i].getIdentification());
			}
			return identifications;
		};
		CanvasMouseHandler.prototype.getMoveModeSelectedDigits = function(){
			return this.temporary_move_mode_selected_digits;
		};
		CanvasMouseHandler.prototype.resetTemporaryMoveModeSelection = function(){
			this.temporary_move_mode_selected_digits.length = 0;
			for(var i = 0; i < this.move_mode_selected_digits.length; ++i){
				this.temporary_move_mode_selected_digits.push(this.move_mode_selected_digits[i]);
			}
		};
		CanvasMouseHandler.prototype.isMoveModeSelected = function(digit, temporary){
			if(temporary){
				for(var i = 0; i < this.temporary_move_mode_selected_digits.length; ++i){
					if(digit.isPossiblyAboutThis(this.temporary_move_mode_selected_digits[i].getIdentification())){
						return true;
					}
				}
			}else{
				for(var i = 0; i < this.move_mode_selected_digits.length; ++i){
					if(digit.isPossiblyAboutThis(this.move_mode_selected_digits[i].getIdentification())){
						return true;
					}
				}
			}
			return false;
		};
		CanvasMouseHandler.prototype.addMoveModeSelectedDigit = function(digit, temporary){
			if(this.isMoveModeSelected(digit, temporary)){
				return;
			}
			this.temporary_move_mode_selected_digits.push(digit);
			if(!temporary){
				this.move_mode_selected_digits.push(digit);
			}
			this.moveModeSelectionChanged();
		};
		CanvasMouseHandler.prototype.setMoveModeSelectedDigits = function(digits, temporary){
			this.resetMoveModeSelectedDigits(temporary);
			this.addMoveModeSelectedDigits(digits, temporary);
		};
		CanvasMouseHandler.prototype.resetMoveModeSelectedDigits = function(temporary){
			this.temporary_move_mode_selected_digits.length = 0;
			if(!temporary){
				this.move_mode_selected_digits.length = 0;
			}
			this.moveModeSelectionChanged();
		};
		CanvasMouseHandler.prototype.addMoveModeSelectedDigits = function(digits, temporary){
			for(var i = 0; i < digits.length; ++i){
				this.addMoveModeSelectedDigit(digits[i], temporary);
			}
		};
		CanvasMouseHandler.prototype.toggleMoveModeSelectedDigits = function(digits, temporary){
			for(var i = 0; i < digits.length; ++i){
				this.toggleMoveModeSelectedDigit(digits[i], temporary);
			}
		};
		CanvasMouseHandler.prototype.toggleMoveModeSelectedDigit = function(digit, temporary){
			if(this.isMoveModeSelected(digit, false)){
				this.removeMoveModeSelectedDigit(digit, temporary);
			}else{
				this.addMoveModeSelectedDigit(digit, temporary);
			}
		};
		CanvasMouseHandler.prototype.removeMoveModeSelectedDigit = function(digit, temporary){
			for(var i = 0; i < this.temporary_move_mode_selected_digits.length; ++i){
				if(this.temporary_move_mode_selected_digits[i].isPossiblyAboutThis(digit.getIdentification())){
					this.temporary_move_mode_selected_digits.splice(i, 1);
					break;
				}
			}
			if(!temporary){
				for(var i = 0; i < this.move_mode_selected_digits.length; ++i){
					if(this.move_mode_selected_digits[i].isPossiblyAboutThis(digit.getIdentification())){
						this.move_mode_selected_digits.splice(i, 1);
						break;
					}
				}
			}
			this.moveModeSelectionChanged();
		};
		CanvasMouseHandler.prototype.moveModeSelectionChanged = function(){
			this.canvas.updateCanvas();
		};
		CanvasMouseHandler.prototype.mouseModeChanged = function(signal, data){
			if(data.getMode() == null){
				data.setMode(this.previous_mouse_mode);
				this.current_mouse_mode = this.previous_mouse_mode;
			}else{
				if(this.current_mouse_mode == data.getMode()){
					return;
				}
				this.previous_mouse_mode = this.current_mouse_mode;
				this.current_mouse_mode = data.getMode();
			}
			//this.resetMoveModeSelectedDigits();
			switch(this.current_mouse_mode){
				case CanvasMouseHandler.MouseModes.EditMode:
					this.canvas.getElement().css('cursor', 'crosshair');
					break;
				case CanvasMouseHandler.MouseModes.CanvasMode:
					this.canvas.getElement().css('cursor', '-webkit-grab');
					break;
				default:
					this.canvas.getElement().css('cursor', 'auto');
			}
			this.messaging_system.fire(this.messaging_system.events.MouseModeChanged, new MouseModeChangedEvent(this.current_mouse_mode));
		};
		CanvasMouseHandler.prototype.getMouseMode = function(){
			return this.current_mouse_mode;
		};
		CanvasMouseHandler.prototype.getSelectedObjects = function(){
			switch(this.current_mouse_mode){
				case CanvasMouseHandler.MouseModes.EditMode:
					return [this.getEditModeSelectedProxy()];
				case CanvasMouseHandler.MouseModes.SelectionMode:
					return this.getMoveModeSelectedDigits();
			}
		};
		CanvasMouseHandler.prototype.getCanvas = function(){
			return this.canvas;
		};
		return CanvasMouseHandler;
	});