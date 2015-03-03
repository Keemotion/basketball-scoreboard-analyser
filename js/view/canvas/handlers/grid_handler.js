define(["../../../model/coordinate",
	"../../../messaging_system/event_listener",
	"../../../messaging_system/events/grid_mode_changed_event",
	"./mouse_modes",
	"../grid"], function(Coordinate, EventListener, GridModeChangedEvent, MouseModes, Grid){
	var GridHandler = function(messaging_system, grid){
		this.messaging_system = messaging_system;
		this.grid = grid;
		this.mouse_down_coordinate = null;
		this.mode = GridHandler.Modes.Default;
		this.mouse_mode_changed_listener = new EventListener(this, this.mouseModeChanged);
		this.messaging_system.addEventListener(this.messaging_system.events.MouseModeChanged, this.mouse_mode_changed_listener);
		this.grid_mode_changed_listener = new EventListener(this, this.gridModeChanged);
		this.messaging_system.addEventListener(this.messaging_system.events.GridModeChanged, this.grid_mode_changed_listener);
		this.CORNER_CLICK_MARGIN = 30;
		this.grid.setCornerClickMargin(this.CORNER_CLICK_MARGIN);
		this.selected_line = null;
	};
	GridHandler.Modes = {
		Default : "Default",
		AddHorizontalGridLine : "AddHorizontalGridLine",
		AddVerticalGridLine : "AddVerticalGridLine"
	};
	GridHandler.prototype.gridModeChanged = function(signal, data){
		this.mode = data.getGridMode();
		switch(this.mode){
			case GridHandler.Modes.Default:
				this.getGrid().setCornerArea(true);
				this.getGrid().setSelectedLineHighlighting(true);
				this.getGrid().setNearbyLineHighlighting(true);
				this.getGrid().selectLine(Grid.LineDirections.None, 0);
				this.getGrid().setNearbyLine(Grid.LineDirections.None, 0);
				break;
			default:
				this.getGrid().setCornerArea(false);
				this.getGrid().setSelectedLineHighlighting(false);
				this.getGrid().setNearbyLineHighlighting(false);
				this.getGrid().selectLine(Grid.LineDirections.None, 0);
				this.getGrid().setNearbyLine(Grid.LineDirections.None, 0);
				break;
		}
		this.messaging_system.fire(this.messaging_system.events.ImageDisplayChanged, null);
	};
	GridHandler.prototype.mouseModeChanged = function(signal, data){
		if(data.getMode() == MouseModes.GridMode){
			this.mouse_down_coordinate = null;
			this.messaging_system.fire(this.messaging_system.events.GridModeChanged, new GridModeChangedEvent(GridHandler.Modes.Default));
		}else{
			this.getGrid().setCornerArea(false);
			this.getGrid().setSelectedLineHighlighting(false);
			this.getGrid().setNearbyLineHighlighting(false);
			this.messaging_system.fire(this.messaging_system.events.ImageDisplayChanged, null);
		}
	};
	GridHandler.prototype.mouseDown = function(event_data, transformation){
		this.mouse_down_coordinate = null;
		switch(this.mode){
			case GridHandler.Modes.Default:
				var closest_coordinate = this.getClosestCoordinate(transformation, event_data.getCoordinate());
				if(Coordinate.getDistance(event_data.getCoordinate(), transformation.transformRelativeImageCoordinateToCanvasCoordinate(closest_coordinate)) < this.CORNER_CLICK_MARGIN){
					this.mouse_down_coordinate = closest_coordinate;
				}else{
					var closest_line = this.getGrid().getClosestLine(transformation, event_data.getCoordinate());
					if(this.getGrid().isLineSelected(closest_line)){
						this.mouse_down_line = closest_line;
					}
				}
				break;
		}
	};
	GridHandler.prototype.mouseMove = function(event_data, transformation){
		switch(this.mode){
			case GridHandler.Modes.Default:
				if(this.mouse_down_coordinate == null){
					this.getGrid().setNearbyLine(Grid.LineDirections.None, 0);
					if(this.mouse_down_line != null){
						this.getGrid().updateLine(this.mouse_down_line, transformation.transformCanvasCoordinateToRelativeImageCoordinate(event_data.getCoordinate()));
					}else{
						var line = this.getGrid().getClosestLine(transformation, event_data.getCoordinate());
						this.getGrid().setNearbyLine(line.direction, line.index);
					}
				}else{
					var transformed_coordinate = transformation.transformCanvasCoordinateToRelativeImageCoordinate(event_data.getCoordinate());
					this.mouse_down_coordinate.setX(transformed_coordinate.getX());
					this.mouse_down_coordinate.setY(transformed_coordinate.getY());
					this.messaging_system.fire(this.messaging_system.events.ImageDisplayChanged, null);
					break;
				}
		}
	};
	GridHandler.prototype.mouseUp = function(event_data, transformation){
		switch(this.mode){
			case GridHandler.Modes.Default:
				if(this.mouse_down_coordinate == null)
					break;
				var transformed_coordinate = transformation.transformCanvasCoordinateToRelativeImageCoordinate(event_data.getCoordinate());
				this.mouse_down_coordinate.setX(transformed_coordinate.getX());
				this.mouse_down_coordinate.setY(transformed_coordinate.getY());
				this.messaging_system.fire(this.messaging_system.events.ImageDisplayChanged, null);
				break;
		}
		this.mouse_down_coordinate = null;
		this.mouse_down_line = null;
	};
	GridHandler.prototype.click = function(event_data, transformation){
		switch(this.mode){
			case GridHandler.Modes.Default:
				var closest_line = this.getGrid().getClosestLine(transformation, event_data.getCoordinate());
				this.getGrid().selectLine(closest_line.direction, closest_line.index);
				break;
			case GridHandler.Modes.AddHorizontalGridLine:
				this.getGrid().addHorizontalLine(transformation.transformCanvasCoordinateToRelativeImageCoordinate(event_data.getCoordinate()));
				break;
			case GridHandler.Modes.AddVerticalGridLine:
				this.getGrid().addVerticalLine(transformation.transformCanvasCoordinateToRelativeImageCoordinate(event_data.getCoordinate()));
				break;
			default:
				break;
		}
	};
	GridHandler.prototype.getClosestCoordinate = function(transformation, coordinate){
		var coordinates = [this.getGrid().getTopRight(), this.getGrid().getBottomLeft(), this.getGrid().getBottomRight(), this.getGrid().getTopLeft()];
		var distance = 0;
		var best_coordinate = 0;
		for(var i = 0; i < coordinates.length; ++i){
			var tmp_distance = Coordinate.getSquareDistance(coordinate, transformation.transformRelativeImageCoordinateToCanvasCoordinate(coordinates[i]));
			if(i == 0 || tmp_distance < distance){
				distance = tmp_distance;
				best_coordinate = coordinates[i];
			}
		}
		return best_coordinate;
	};
	GridHandler.prototype.getGrid = function(){
		return this.grid;
	};
	GridHandler.prototype.deleteDown = function(){
		switch(this.mode){
			case GridHandler.Modes.Default:
				this.getGrid().deleteSelectedLine();
				break;
		}

	};
	return GridHandler;
});