define(["../../../model/coordinate", "../../../messaging_system/event_listener"], function(Coordinate, EventListener){
	var GridHandler = function(messaging_system, grid){
		this.messaging_system = messaging_system;
		this.grid = grid;
		this.mouse_down_coordinate = null;
		this.add_horizontal_grid_line_listener = new EventListener(this, this.startHorizontalGridLine);
		this.messaging_system.addEventListener(this.messaging_system.events.AddHorizontalGridLine, this.add_horizontal_grid_line_listener);
		this.add_vertical_grid_line_listener = new EventListener(this, this.startVerticalGridLine);
		this.messaging_system.addEventListener(this.messaging_system.events.AddVerticalGridLine, this.add_vertical_grid_line_listener);
		this.mode = GridHandler.Modes.Default;
	};
	GridHandler.Modes = {Default: "Default", AddHorizontalGridLine: "AddHorizontalGridLine", AddVerticalGridLine : "AddVerticalGridLine"};
	GridHandler.prototype.startHorizontalGridLine = function(){
		this.mode = GridHandler.Modes.AddHorizontalGridLine;
	};
	GridHandler.prototype.startVerticalGridLine = function(){
		this.mode = GridHandler.Modes.AddVerticalGridLine;
	};
	GridHandler.prototype.mouseDown = function(event_data, transformation){
		this.mouse_down_coordinate = null;
		switch(this.mode){
			case GridHandler.Modes.Default:
				var closest_coordinate = this.getClosestCoordinate(transformation, event_data.getCoordinate());
				var MARGIN = 30;
				if(Coordinate.getDistance(event_data.getCoordinate(), transformation.transformRelativeImageCoordinateToCanvasCoordinate(closest_coordinate)) < MARGIN){
					this.mouse_down_coordinate = closest_coordinate;
				}
				break;
		}
	};
	GridHandler.prototype.mouseMove = function(event_data, transformation){
		switch(this.mode){
			case GridHandler.Modes.Default:
				if(this.mouse_down_coordinate == null)
					return;
				var transformed_coordinate = transformation.transformCanvasCoordinateToRelativeImageCoordinate(event_data.getCoordinate());
				this.mouse_down_coordinate.setX(transformed_coordinate.getX());
				this.mouse_down_coordinate.setY(transformed_coordinate.getY());
				this.messaging_system.fire(this.messaging_system.events.ImageDisplayChanged, null);
				break;
		}
	};
	GridHandler.prototype.mouseUp = function(event_data, transformation){
		switch(this.mode){
			case GridHandler.Modes.Default:
				if(this.mouse_down_coordinate == null)
					return;
				var transformed_coordinate = transformation.transformCanvasCoordinateToRelativeImageCoordinate(event_data.getCoordinate());
				this.mouse_down_coordinate.setX(transformed_coordinate.getX());
				this.mouse_down_coordinate.setY(transformed_coordinate.getY());
				this.messaging_system.fire(this.messaging_system.events.ImageDisplayChanged, null);
				this.mouse_down_coordinate = null;
				break;
		}
	};
	GridHandler.prototype.click = function(event_data, transformation){
		switch(this.mode){
			case GridHandler.Modes.AddHorizontalGridLine:
				this.getGrid().addHorizontalLine(transformation.transformCanvasCoordinateToRelativeImageCoordinate(event_data.getCoordinate()));
				this.mode = GridHandler.Modes.Default;
				break;
			case GridHandler.Modes.AddVerticalGridLine:
				this.getGrid().addVerticalLine(transformation.transformCanvasCoordinateToRelativeImageCoordinate(event_data.getCoordinate()));
				this.mode = GridHandler.Modes.Default;
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
	return GridHandler;
});