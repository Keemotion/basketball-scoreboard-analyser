define(
	["../../messaging_system/event_listener", "../../model/coordinate",
		"./transformation", "./display_tree",
		"./handlers/display_changed_handler",
		"../../messaging_system/events/canvas_key_event",
		"./handlers/canvas_mouse_handler",
		"../../model/selection_tree",
		"../../messaging_system/events/mouse_event",
		"../../model/bounding_rectangle",
		"../../messaging_system/events/line_extensions_set_event"],
	function(EventListener, Coordinate, Transformation, DisplayTree, DisplayChangedHandler, CanvasKeyEvent, CanvasMouseHandler, SelectionTree, MouseEvent, BoundingRectangle, LineExtensionsSetEvent){
		var MyCanvas = function(view, target_view, proxy, messaging_system){
			var self = this;
			this.view = view;
			this.selected = new Array();
			this.messaging_system = messaging_system;
			this.canvas_element = $('<canvas>').attr({
				class : 'canvas_image',
				width : '1024',
				height : '768',
				tabindex : '1'
			}).on('selectstart', function(){
				return false;
			});
			this.canvas_element = this.canvas_element[0];
			this.context = this.canvas_element.getContext('2d');
			this.container_element = target_view;
			this.transformation = new Transformation(new Coordinate(0, 0),
				1, 1, 1, 1, 1);
			this.canvas_mouse_handler = new CanvasMouseHandler(this,
				this.messaging_system);
			this.display_tree = null;
			$(this.container_element).append(this.canvas_element);
			this.messaging_system.addEventListener(
				this.messaging_system.events.StateChanged,
				new EventListener(this, this.updateCanvas));
			this.messaging_system.addEventListener(
				this.messaging_system.events.LoadImage,
				new EventListener(this, this.loadImage));
			this.messaging_system.addEventListener(this.messaging_system.events.LoadCombinedImages, new EventListener(this, this.loadCombinedImages));
			this.messaging_system.addEventListener(
				this.messaging_system.events.WindowResized,
				new EventListener(this, this.windowResized));
			this.messaging_system.addEventListener(
				this.messaging_system.events.ImageDisplayChanged,
				new EventListener(this, this.updateCanvas));
			this.messaging_system.addEventListener(
				this.messaging_system.events.SelectionChanged,
				new EventListener(this, this.updateCanvas));
			this.messaging_system.addEventListener(
				this.messaging_system.events.ResetCanvasView,
				new EventListener(this, this.resetCanvasView));
			this.messaging_system.addEventListener(
				this.messaging_system.events.GroupChanged,
				new EventListener(this, this.updateCanvas));
			this.messaging_system.addEventListener(
				this.messaging_system.events.ToggleLineExtensions,
				new EventListener(this, this.toggleLineExtension)
			);
			//this.messaging_system.addEventListener(this.messaging_system.events.MouseModeChanged, new EventListener(this, this.mouseModeChanged));
			this.windowResized(null, null);
			var scrollF = function(e){
				self.fireMouseEvent(
					self.messaging_system.events.CanvasScrolled, e);
			};
			this.canvas_element.addEventListener('DOMMouseScroll', scrollF,
				false);
			this.canvas_element.addEventListener('mousewheel', scrollF,
				false);
			$(this.canvas_element)
				.mousemove(
				function(e){
					self
						.fireMouseEvent(
						self.messaging_system.events.CanvasMouseMove,
						e);
				});
			$(this.canvas_element)
				.mousedown(
				function(e){
					self
						.fireMouseEvent(
						self.messaging_system.events.CanvasMouseDown,
						e);
				});
			$(this.canvas_element).mouseup(
				function(e){
					self.fireMouseEvent(
						self.messaging_system.events.CanvasMouseUp,
						e);
				});
			$(this.canvas_element)
				.focusout(
				function(e){
					self
						.fireMouseEvent(
						self.messaging_system.events.CanvasFocusOut,
						e);
				});
			$(this.canvas_element)
				.mouseleave(
				function(e){
					self
						.fireMouseEvent(
						self.messaging_system.events.CanvasFocusOut,
						e);
				});
			$(this.canvas_element)
				.click(
				function(e){
					self
						.fireMouseEvent(
						self.messaging_system.events.CanvasImageClick,
						e);
				});
			$(this.canvas_element)
				.dblclick(
				function(e){
					self
						.fireMouseEvent(
						self.messaging_system.events.CanvasImageDoubleClick,
						e);
				});
			$(this.canvas_element).keydown(
				function(e){
					messaging_system.fire(
						messaging_system.events.CanvasKeyDown,
						new CanvasKeyEvent(e));
				})
				.keyup(function(e){
					messaging_system.fire(messaging_system.events.CanvasKeyUp, new CanvasKeyEvent(e));
				});
			this.displayObjectsChangedListener = new EventListener(this,
				this.displayObjectsChanged);
			this.messaging_system.addEventListener(
				this.messaging_system.events.DisplayObjectsChanged,
				this.displayObjectsChangedListener);

			this.autoFocusListener = new EventListener(this, this.autoFocus);
			this.messaging_system.addEventListener(
				this.messaging_system.events.AutoFocusSelection,
				this.autoFocusListener);
			this.setProxy(proxy);
			this.display_changed_handler = new DisplayChangedHandler(this);
			this.line_extension = false;
		};
		MyCanvas.prototype.fireMouseEvent = function(event_type, event_data){
			var coordinate = new Coordinate(event_data.pageX
			- this.canvas_element.offsetLeft, event_data.pageY
			- this.canvas_element.offsetTop);
			if(event_type == this.messaging_system.events.CanvasFocusOut){
				this.messaging_system.fire(
					this.messaging_system.events.CanvasMouseUp,
					new MouseEvent(coordinate, event_data,
						this.getTransformation));
			}
			this.messaging_system.fire(event_type, new MouseEvent(
				coordinate, event_data, this.getTransformation()));
		};
		// one of the display objects has changed
		MyCanvas.prototype.displayObjectsChanged = function(signal, data){
			this.updateCanvas();
		};
		MyCanvas.prototype.getSelectionTree = function(selection_rectangle, type){
			var tree = new SelectionTree();
			var image_coordinates_rectangle = selection_rectangle
				.transformCanvasCoordinatesToRelativeImageCoordinates(this
					.getTransformation());
			return this.display_tree
				.getSelectionTree(image_coordinates_rectangle, type);
		};
		MyCanvas.prototype.getObjectAroundCanvasCoordinate = function(coordinate, selected_object_identification){
			var res = this.display_tree
				.getObjectAroundCoordinate(coordinate, this.getTransformation(), selected_object_identification, this.getView().getCurrentSelectionTree(), this.getView().getApplicationState());
			if(res != null)
				return res;
			return null;
		};
		// event handler for window resize
		MyCanvas.prototype.windowResized = function(signal, data){
			this.canvas_element.height = $(this.canvas_element).parent()
				.height();
			this.canvas_element.width = $(this.canvas_element).parent()
				.width();
			this.updateTransformation();
			this.drawCanvas();
		};
		// update the display matrix for the canvas based on canvas
		// width/height
		MyCanvas.prototype.updateTransformation = function(){
			this.transformation.setCanvasWidth(this.canvas_element.width);
			this.transformation.setCanvasHeight(this.canvas_element.height);
			if(this.image){
				this.transformation.setImageWidth(this.image.width);
				this.transformation.setImageHeight(this.image.height);
			}
		};
		MyCanvas.prototype.editModeSelectionSet = function(signal, data){
			this.edit_mode_selected_proxy = data.getProxy();
			this.updateCanvas(signal, data);
		};
		MyCanvas.prototype.resetCanvasView = function(){
			this.updateTransformation();
			this.transformation.reset();
			this.updateCanvas();
		};
		MyCanvas.prototype.getElement = function(){
			return $(this.canvas_element);
		};
		MyCanvas.prototype.getDisplayTree = function(){
			return this.display_tree;
		};
		MyCanvas.prototype.setProxy = function(proxy){
			this.resetDisplayObjects();
			this.edit_mode_selected_proxy = null;
			this.proxy = proxy;
			this.display_tree = new DisplayTree(this.proxy,
				this.messaging_system);
		};
		MyCanvas.prototype.resetDisplayObjects = function(){
			this.display_tree = null;
		};
		// something has changed on the canvas, warn displayChangedChandler
		// (to prevent all display objects from being drawn every time ->
		// lag)
		MyCanvas.prototype.drawTree = function(){
			if(this.display_tree){
				this.display_tree.draw(this.context, this.transformation, this.getView().getCurrentSelectionTree(), this.getView().getApplicationState());
			}
		};
		MyCanvas.prototype.toggleLineExtension = function(){
			this.setLineExtension(!this.getLineExtension());
		};
		MyCanvas.prototype.setLineExtension = function(on){
			this.line_extension = on;
			this.messaging_system.fire(this.messaging_system.events.LineExtensionsSet, new LineExtensionsSetEvent(on));
			this.updateCanvas();
		};
		MyCanvas.prototype.getLineExtension = function(){
			return this.line_extension;
		};
		MyCanvas.prototype.drawSelected = function(){
			if(this.display_tree == null)
				return;
			this.display_tree.drawSelected(this.getView().getCurrentSelectionTree().getRoot(), this.context, this.transformation, false, this.getView().getApplicationState(), true, this.getView().getCurrentSelectionTree(), this.getLineExtension());
			var moving_tree = this.canvas_mouse_handler.getMovingObjectsTree();
			if(moving_tree != null)
				this.display_tree.drawSelected(moving_tree.getRoot(), this.context, this.transformation, false, this.getView().getApplicationState(), false, this.getView().getCurrentSelectionTree());
			var temporary_coordinates = this.canvas_mouse_handler.getTemporaryDigitCoordinates();
			if(temporary_coordinates != null && temporary_coordinates.length > 0){
				for(var i = 0; i < temporary_coordinates.length; ++i){
					temporary_coordinates[i] = this.getTransformation().transformRelativeImageCoordinateToCanvasCoordinate(temporary_coordinates[i]);
				}
				var prev_coordinate = temporary_coordinates[0];
				temporary_coordinates.push(this.canvas_mouse_handler.getPreviousMouseCoordinate());
				this.context.beginPath();
				this.context.moveTo(temporary_coordinates[0].getX(), temporary_coordinates[0].getY());
				for(var i = 1; i < temporary_coordinates.length; ++i){
					this.context.lineTo(temporary_coordinates[i].getX(), temporary_coordinates[i].getY());
				}
				this.context.stroke();
			}
		};
		MyCanvas.prototype.updateCanvas = function(signal, data){
			this.getDisplayChangedHandler().fireEdited();
			this.drawCanvas();
		};
		// load image to the canvas and update transformation
		MyCanvas.prototype.loadImage = function(signal, data){
			var self = this;
			this.image = new Image();
			this.image.onload = function(){
				self.resetCanvasView();
				self.messaging_system.fire(
					self.messaging_system.events.ImageDisplayChanged,
					null);
			};
			this.image.src = data;
		};
		MyCanvas.prototype.loadCombinedImages = function(signal, data){
			var files = data.getFiles();
			var self = this;
			var images = new Array();

			function calculate_luminance(imageData, index){
				var r = imageData.data[index];
				var g = imageData.data[index + 1];
				var b = imageData.data[index + 2];
				var luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
				return luminance;
			}

			function generate_image(){
				var result_width = images[0].width;
				var result_height = images[0].height;
				var result_image_data = null;
				for(var i = 0; i < images.length; ++i){
					console.dir(images[i]);
					if(images[i].width != result_width || images[i].height != result_height){
						alert("Incorrect dimensions");
						return;
					}
					var curr_canvas = $('<canvas>')[0];
					curr_canvas.width = result_width;
					curr_canvas.height = result_height;
					var context = curr_canvas.getContext("2d");
					context.drawImage(images[i], 0, 0);
					var imageData = context.getImageData(0, 0, result_width, result_height);
					if(i == 0){
						result_image_data = imageData;
					}else{
						for(var i = 0; i < result_height; ++i){
							for(var j = 0; j < result_width; ++j){
								var index = (i * 4) * imageData.width + (j * 4);
								var curr_luminance = calculate_luminance(imageData, index);
								var prev_luminance = calculate_luminance(result_image_data, index);
								if(curr_luminance > prev_luminance){
									for(var i = 0; i < 4; ++i){
										result_image_data[index + i] = imageData[index + i];
									}
								}
							}
						}
					}
					var img = new Image();
					var curr_canvas = $('<canvas>')[0];
					curr_canvas.width = result_width;
					curr_canvas.height = result_height;
					var context = curr_canvas.getContext("2d");
					context.putImageData(result_image_data, 0, 0);
					img.src = curr_canvas.toDataURL();
					self.messaging_system.fire(self.messaging_system.events.LoadImage, img.src);
				}
			};
			for(var i = 0; i < files.length; ++i){
				var img = new Image();
				img.onload = function(){
					images.push(img);
					if(images.length == files.length){
						generate_image();
					}
				}
				img.src = files[i];
			}
		};
		// return whether all display objects have to be drawn
		MyCanvas.prototype.getDrawComplete = function(){
			return this.getDisplayChangedHandler().canBeDrawn();
		};
		// the displayChangedHandler prevents all display objects from being
		// drawn every time the canvas is updated -> lag
		// it waits until there haven't been any updates for a certain time
		// to allow the display objects to be drawn
		MyCanvas.prototype.getDisplayChangedHandler = function(){
			return this.display_changed_handler;
		};
		// draws the canvas image and (if needed) the display objects
		MyCanvas.prototype.drawCanvas = function(){
			this.context.clearRect(0, 0, this.canvas_element.width, this.canvas_element.height);
			if(this.image){
				var canvas_top_left = this.transformation
					.transformAbsoluteImageCoordinateToCanvasCoordinate(new Coordinate(
						0, 0));
				var canvas_bottom_right = this.transformation
					.transformAbsoluteImageCoordinateToCanvasCoordinate(new Coordinate(
						this.transformation.getImageWidth(), this.transformation.getImageHeight()));
				canvas_top_left.round();
				canvas_bottom_right.round();
				this.context.mozImageSmoothingEnabled = false;
				this.context.webkitImageSmoothingEnabled = false;
				this.context.drawImage(this.image, 0, 0,
					this.transformation.getImageWidth(),
					this.transformation.getImageHeight(),
					canvas_top_left.x, canvas_top_left.y,
					canvas_bottom_right.x - canvas_top_left.x,
					canvas_bottom_right.y - canvas_top_left.y);
				var rect = this.canvas_mouse_handler
					.getSelectionRectangle();
				if(rect.getActive()){
					this.context.beginPath();
					this.context.lineWidth = "1";
					this.context.strokeStyle = "aqua";
					this.context.rect(rect.getTopLeft().getX(), rect
						.getTopLeft().getY(), rect.getWidth(), rect
						.getHeight());
					this.context.stroke();
				}
				if(this.getDrawComplete()){
					this.drawTree();
				}
				this.drawSelected();
			}
		};
		MyCanvas.prototype.getTransformation = function(){
			return this.transformation;
		};
		MyCanvas.prototype.getImage = function(){
			return this.image;
		};
		MyCanvas.prototype.autoFocus = function(signal, data){
			var bounding_rectangle = new BoundingRectangle();
			var selected_elements = this.getView().getCurrentSelectionTree().getSelectedFlat();
			for(var i = 0; i < selected_elements.length; ++i){
				selected_elements[i].getBoundingRectangle(bounding_rectangle);
			}
			this.transformation
				.updateToContainRectangle(bounding_rectangle);
			this.updateCanvas();
		};
		MyCanvas.prototype.getView = function(){
			return this.view;
		};
		MyCanvas.prototype.getCompleteSelectionTree = function(){
			return this.getDisplayTree().getCompleteSelectionTree();
		};
		return MyCanvas;
	});
