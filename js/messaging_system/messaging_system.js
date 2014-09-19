define([], function() {
	//Manages all custom events
	var MessagingSystem = function() {
	};
	MessagingSystem.prototype.events = new Object({
		//A new tree was loaded
		LoadState : 'LoadState',

		//Reset state
		ResetState : 'ResetState',

		//Clear state (empty all groups of digits/dots but keep empty groups)
		ClearState : 'ClearState',

		//Data in the current state changed
		GroupChanged : 'GroupChanged',
		GroupReset : 'GroupReset',

		//Something at the root level of the state tree changed
		StateChanged : 'StateChanged',

		//A new image was loaded
		LoadImage : 'LoadImage',

		//The browser window was resized
		WindowResized : 'WindowResized',

		//Something on the canvas changed
		ImageDisplayChanged : 'ImageDisplayChanged',

		//Reset Canvas View (zoom, translation)
		ResetCanvasView : 'ResetCanvasView',

		//A group was clicked (request to show details)
		GroupClicked : 'GroupClicked',

		//An object was selected
		ObjectSelected : 'ObjectSelected',

		//An object was unselected
		ObjectUnSelected : 'ObjectUnSelected',

		//Try to select all objects in a rectangle on the canvas (canvas coordinate)
		AreaSelect : 'AreaSelect',

		//Data was submitted in the GUI and needs to be applied to the model
		SubmitGroupDetails : 'SubmitGroupDetails',
		//An object or a group of objects has been moved
		ObjectsMoved : 'ObjectsMoved',

		//Canvas events
		CanvasScrolled : 'CanvasScrolled',
		CanvasMouseMove : 'CanvasMouseMove',
		CanvasMouseUp : 'CanvasMouseUp',
		CanvasMouseDown : 'CanvasMouseDown',
		CanvasFocusOut : 'CanvasFocusOut',
		CanvasImageClick : 'CanvasImageClick',
		CanvasImageDoubleClick : 'CanvasImageDoubleClick',
		CanvasKeyDown : 'CanvasKeyDown',
		CanvasKeyUp : 'CanvasKeyUp',

		//User started clicking in the canvas to set coordinates (so don't do anything else with the clicks
		CoordinateClickListenerStarted : 'CoordinateClickListenerStarted',

		//Some new objects should be displayed on the canvas and/or some objects don't need to be shown on the canvas anymore
		DisplayObjectsChanged : 'DisplayObjectsChanged',

		//The display property of an object was toggled
		ToggleDisplayObject : 'ToggleDisplayObject',

		//A file has been submitted for loading
		LoadStateFile : 'LoadStateFile',

		//The order of the objects has changed in the GUI
		ReOrdered : 'ReOrdered',

		//A new element was added in the GUI
		AddElement : 'AddElement',
		
		DigitAdded : 'DigitAdded',

		//A group was deleted in the GUI
		RemoveGroup : 'RemoveGroup',

		//The user started dragging a display object, so don't do anything else with mouse dragging
		StartObjectDragging : 'StartObjectDragging',

		//The user stopped dragging a display object, so mouse dragging can again be processed
		StopObjectDragging : 'StopObjectDragging',

		SelectionAdded : 'SelectionAdded',
		SelectionRemoved : 'SelectionRemoved',
		SelectionToggled : 'SelectionToggled',
		SelectionSet : 'SelectionSet',
		SelectionReset : 'SelectionReset',

		SelectionChanged : 'SelectionChanged',

		MouseModeChanged : 'MouseModeChanged',
		
		AutoFocusSelection: 'AutoFocusSelection',
		EditModeSelectionSet: 'EditModeSelectionSet',
		RequestEditModeSelection: 'RequestEditModeSelection'
	});
	MessagingSystem.prototype.eventListeners = new Object();
	MessagingSystem.prototype.fire = function(signal, data) {
		if (!( signal in this.eventListeners)) {
			return;
		}
		for (var i = 0; i < this.eventListeners[signal].length; ++i) {
			this.eventListeners[signal][i].eventFired(signal, data);
		}
	};
	MessagingSystem.prototype.addEventListener = function(signal, listener) {
		if (!( signal in this.eventListeners)) {
			this.eventListeners[signal] = new Array();
		}
		this.eventListeners[signal].push(listener);
	};
	MessagingSystem.prototype.removeEventListener = function(signal, listener) {
		if (!( signal in this.eventListeners))
			return;
		for (var i = 0; i < this.eventListeners[signal].length; ++i) {
			if (this.eventListeners[signal][i] == listener) {
				this.eventListeners[signal][i] = this.eventListeners[signal][this.eventListeners[signal].length - 1];
				this.eventListeners[signal].pop();
				break;
			}
		}
	};
	return MessagingSystem;
});
