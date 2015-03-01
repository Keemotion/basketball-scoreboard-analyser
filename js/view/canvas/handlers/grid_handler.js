define(["../../../model/coordinate"], function(Coordinate){
	var GridHandler = function(messaging_system, grid){
		this.messaging_system = messaging_system;
		this.grid = grid;
		this.mouse_down_coordinate = null;
	};
	GridHandler.prototype.mouseDown = function(event_data, transformation){
		this.mouse_down_coordinate = null;
		console.log("mouse down in grid mode at "+JSON.stringify(event_data.getCoordinate()));
		var closest_coordinate = this.getClosestCoordinate(transformation, event_data.getCoordinate());
		var MARGIN = 30;
		if(Coordinate.getDistance(event_data.getCoordinate(), transformation.transformRelativeImageCoordinateToCanvasCoordinate(closest_coordinate)) < MARGIN){
			this.mouse_down_coordinate = closest_coordinate;
		}
	};
	GridHandler.prototype.mouseMove = function(event_data, transformation){
		console.log("in mouse move");
		if(this.mouse_down_coordinate == null)
			return;
		var transformed_coordinate = transformation.transformCanvasCoordinateToRelativeImageCoordinate(event_data.getCoordinate());
		this.mouse_down_coordinate.setX(transformed_coordinate.getX());
		this.mouse_down_coordinate.setY(transformed_coordinate.getY());
		this.messaging_system.fire(this.messaging_system.events.ImageDisplayChanged, null);
	}
	GridHandler.prototype.mouseUp = function(event_data, transformation){
		console.log("in mouse up");
		if(this.mouse_down_coordinate == null)
			return;
		console.log("should be moved");
		var transformed_coordinate = transformation.transformCanvasCoordinateToRelativeImageCoordinate(event_data.getCoordinate());
		this.mouse_down_coordinate.setX(transformed_coordinate.getX());
		this.mouse_down_coordinate.setY(transformed_coordinate.getY());
		this.messaging_system.fire(this.messaging_system.events.ImageDisplayChanged, null);
		this.mouse_down_coordinate = null;
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