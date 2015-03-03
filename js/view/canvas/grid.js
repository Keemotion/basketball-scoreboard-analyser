define(["../../model/coordinate", "../../helpers/geometry", "../../messaging_system/event_listener"], function(Coordinate, Geometry, EventListener){
	var Grid = function(messaging_system){
		this.messaging_system = messaging_system;
		this.setTopRight(new Coordinate(1.0, 1.0));
		this.setBottomRight(new Coordinate(1.0, -1.0));
		this.setBottomLeft(new Coordinate(-1.0, -1.0));
		this.setTopLeft(new Coordinate(-1.0, 1.));
		this.horizontal_lines = [];
		this.vertical_lines = [];
		this.enabled = true;
		this.toggle_grid_event_listener = new EventListener(this, this.toggleGrid);
		this.messaging_system.addEventListener(this.messaging_system.events.ToggleGrid, this.toggle_grid_event_listener);
		this.show_corner_area = false;
		this.corner_click_margin = 10;
		this.equal_spacing_listener = new EventListener(this, this.applyEqualSpacing);
		this.messaging_system.addEventListener(this.messaging_system.events.EqualSpacingGridLines, this.equal_spacing_listener);
		this.selected_line = null;
		this.nearby_line = null;
		this.selectLine(Grid.LineDirections.None, 0);
		this.setNearbyLine(Grid.LineDirections.None, 0);
		this.highlight_selected_line = false;
		this.highlight_nearby_line = false;
	};
	Grid.LineDirections = {Horizontal : "Horizontal", Vertical : "Vertical", None : "None"};
	Grid.prototype.selectLine = function(direction, index){
		this.selected_line = {direction : direction, index : index};
		this.messaging_system.fire(this.messaging_system.events.ImageDisplayChanged, null);
	};
	Grid.prototype.isLineSelected = function(line){
		return line.direction != Grid.LineDirections.None && line.direction == this.selected_line.direction && line.index == this.selected_line.index;
	};
	Grid.prototype.setNearbyLine = function(direction, index){
		this.nearby_line = {direction : direction, index : index};
		this.messaging_system.fire(this.messaging_system.events.ImageDisplayChanged, null);
	};
	Grid.prototype.setNearbyLineHighlighting = function(enable){
		this.highlight_nearby_line = enable;
	};
	Grid.prototype.deleteSelectedLine = function(){
		var index = this.selected_line.index;
		switch(this.selected_line.direction){
			case Grid.LineDirections.Horizontal:
				if(index < this.horizontal_lines.length){
					this.horizontal_lines[index] = this.horizontal_lines[this.horizontal_lines.length - 1];
					this.horizontal_lines.length--;
				}
				break;
			case Grid.LineDirections.Vertical:
				if(index < this.vertical_lines.length){
					this.vertical_lines[index] = this.vertical_lines[this.vertical_lines.length - 1];
					this.vertical_lines.length--;
				}
				break;
		}
		this.selectLine(Grid.LineDirections.None, 0);
	};
	Grid.prototype.applyEqualSpacing = function(signal, data){
		function apply(arr){
			var am = arr.length;
			for(var i = 0; i < am; ++i){
				arr[i] = (i + 1) / (am + 1);
			}
		};
		apply(this.horizontal_lines);
		apply(this.vertical_lines);
		this.messaging_system.fire(this.messaging_system.events.ImageDisplayChanged, null);
	};
	Grid.prototype.toggleGrid = function(){
		this.enabled = !this.enabled;
		if(this.enabled){
			this.messaging_system.fire(this.messaging_system.events.GridEnabled, null);
		}else{
			this.messaging_system.fire(this.messaging_system.events.GridDisabled, null);
		}
		this.messaging_system.fire(this.messaging_system.events.ImageDisplayChanged, null);
	};
	Grid.prototype.reset = function(transformation){
		this.setBottomRight(transformation.transformAbsoluteImageCoordinateToRelativeImageCoordinate(new Coordinate(transformation.getImageWidth(), transformation.getImageHeight())));
		this.setTopRight(transformation.transformAbsoluteImageCoordinateToRelativeImageCoordinate(new Coordinate(transformation.getImageWidth(), 0)));
		this.setBottomLeft(transformation.transformAbsoluteImageCoordinateToRelativeImageCoordinate(new Coordinate(0, transformation.getImageHeight())));
		this.setTopLeft(transformation.transformAbsoluteImageCoordinateToRelativeImageCoordinate(new Coordinate(0, 0)));
		this.messaging_system.fire(this.messaging_system.events.ImageDisplayChanged, null);
	};
	Grid.prototype.clear = function(transformation){
		this.horizontal_lines = [];
		this.vertical_lines = [];
		this.reset(transformation);
	};
	Grid.prototype.draw = function(context, transformation, mode){
		if(!this.enabled)
			return;
		var topright = transformation.transformRelativeImageCoordinateToCanvasCoordinate(this.getTopRight());
		var bottomright = transformation.transformRelativeImageCoordinateToCanvasCoordinate(this.getBottomRight());
		var bottomleft = transformation.transformRelativeImageCoordinateToCanvasCoordinate(this.getBottomLeft());
		var topleft = transformation.transformRelativeImageCoordinateToCanvasCoordinate(this.getTopLeft());

		context.strokeStyle = "brown";
		context.lineWidth = 1;
		context.beginPath();
		context.moveTo(topright.getX(), topright.getY());
		context.lineTo(bottomright.getX(), bottomright.getY());
		context.lineTo(bottomleft.getX(), bottomleft.getY());
		context.lineTo(topleft.getX(), topleft.getY());
		context.lineTo(topright.getX(), topright.getY());
		context.stroke();
		this.drawLines(context, transformation, this.horizontal_lines, this.getTopLeft(), this.getBottomLeft(), this.getTopRight(), this.getBottomRight());
		this.drawLines(context, transformation, this.vertical_lines, this.getTopRight(), this.getTopLeft(), this.getBottomRight(), this.getBottomLeft());

		if(this.highlight_selected_line && this.selected_line.direction != Grid.LineDirections.None){
			var tmp_style = context.strokeStyle;
			var tmp_width = context.lineWidth;
			context.beginPath();
			context.strokeStyle = "red";
			context.lineWidth = 3;
			if(this.selected_line.direction == Grid.LineDirections.Horizontal){
				this.drawLine(context, transformation, this.horizontal_lines[this.selected_line.index], this.getTopLeft(), this.getBottomLeft(), this.getTopRight(), this.getBottomRight());
			}else if(this.selected_line.direction == Grid.LineDirections.Vertical){
				this.drawLine(context, transformation, this.vertical_lines[this.selected_line.index], this.getTopRight(), this.getTopLeft(), this.getBottomRight(), this.getBottomLeft());
			}
			context.stroke();
			context.strokeStyle = tmp_style;
			context.lineWidth = tmp_width;
		}
		if(this.highlight_nearby_line && this.nearby_line.direction != Grid.LineDirections.None
			&& (this.nearby_line.direction != this.selected_line.direction || this.nearby_line.index != this.selected_line.index)){
			var tmp_style = context.strokeStyle;
			var tmp_width = context.lineWidth;
			context.beginPath();
			context.strokeStyle = "yellow";
			context.lineWidth = 2;
			if(this.nearby_line.direction == Grid.LineDirections.Horizontal){
				this.drawLine(context, transformation, this.horizontal_lines[this.nearby_line.index], this.getTopLeft(), this.getBottomLeft(), this.getTopRight(), this.getBottomRight());
			}else if(this.nearby_line.direction == Grid.LineDirections.Vertical){
				this.drawLine(context, transformation, this.vertical_lines[this.nearby_line.index], this.getTopRight(), this.getTopLeft(), this.getBottomRight(), this.getBottomLeft());
			}
			context.stroke();
			context.strokeStyle = tmp_style;
			context.lineWidth = tmp_width;
		}
		if(this.show_corner_area){
			context.beginPath();
			context.arc(topright.getX(), topright.getY(), this.corner_click_margin, 0, 2 * Math.PI);
			context.stroke();
			context.beginPath();
			context.arc(topleft.getX(), topleft.getY(), this.corner_click_margin, 0, 2 * Math.PI);
			context.stroke();
			context.beginPath();
			context.arc(bottomright.getX(), bottomright.getY(), this.corner_click_margin, 0, 2 * Math.PI);
			context.stroke();
			context.beginPath();
			context.arc(bottomleft.getX(), bottomleft.getY(), this.corner_click_margin, 0, 2 * Math.PI);
			context.stroke();
		}
	};
	Grid.prototype.drawLine = function(context, transformation, parameter, line1_point1, line1_point2, line2_point1, line2_point2){
		var point1 = line1_point1.add(line1_point2.subtract(line1_point1).scalarMultiply(parameter));
		var point2 = line2_point1.add(line2_point2.subtract(line2_point1).scalarMultiply(parameter));
		var transformed_point1 = transformation.transformRelativeImageCoordinateToCanvasCoordinate(point1);
		var transformed_point2 = transformation.transformRelativeImageCoordinateToCanvasCoordinate(point2);
		context.moveTo(transformed_point1.getX(), transformed_point1.getY());
		context.lineTo(transformed_point2.getX(), transformed_point2.getY());
	};
	Grid.prototype.drawLines = function(context, transformation, lines, line1_point1, line1_point2, line2_point1, line2_point2){
		for(var i = 0; i < lines.length; ++i){
			context.beginPath();
			this.drawLine(context, transformation, lines[i], line1_point1, line1_point2, line2_point1, line2_point2);
			context.stroke();
		}
	};
	Grid.getLineIntersection = function(line_point1, line_point2, parameter){
		return line_point1.add(line_point2.subtract(line_point1).scalarMultiply(parameter));
	};
	Grid.prototype.getInterpolationFactor = function(coordinate, line1_point1, line1_point2, line2_point1, line2_point2){
		var left = 0.0;
		var right = 1.0;
		var EPS = .00001;
		var steps = 1000;
		while(left + EPS < right){
			steps -= 1;
			if(steps <= 0)
				return .5;
			var middle = (left + right) / 2;
			var line1_middle = Grid.getLineIntersection(line1_point1, line1_point2, middle);
			var line2_middle = Grid.getLineIntersection(line2_point1, line2_point2, middle);
			var cp = Geometry.crossProduct(coordinate.subtract(line1_middle), line2_middle.subtract(line1_middle));
			if(cp > 0){
				left = middle;
			}else{
				right = middle;
			}
		}
		return (left + right) / 2.0;
	};
	//returns whether coordinate is outside the grid box
	Grid.prototype.isOutsideBox = function(coordinate){
		var points = [this.getTopLeft(), this.getTopRight(), this.getBottomRight(), this.getBottomLeft()];
		return !Geometry.insidePolygon(points, coordinate.getX(), coordinate.getY());
	};
	Grid.prototype.getClosestLineArray = function(direction, transformation, coordinate, lines, line1_point1, line1_point2, line2_point1, line2_point2){
		var none = Grid.LineDirections.None;
		var closest_line = {direction : none, index : 0, distance : 0};
		for(var i = 0; i < lines.length; ++i){
			var line1_middle = Grid.getLineIntersection(line1_point1, line1_point2, lines[i]);
			var line2_middle = Grid.getLineIntersection(line2_point1, line2_point2, lines[i]);
			var dist = Geometry.distanceToLine(coordinate, transformation.transformRelativeImageCoordinateToCanvasCoordinate(line1_middle), transformation.transformRelativeImageCoordinateToCanvasCoordinate(line2_middle));
			if(closest_line.direction == none || dist < closest_line.distance){
				closest_line.direction = direction;
				closest_line.distance = dist;
				closest_line.index = i;
			}
		}
		return closest_line;
	};
	Grid.prototype.getClosestLine = function(transformation, coordinate){
		var closest_horizontal_line = this.getClosestLineArray(Grid.LineDirections.Horizontal, transformation, coordinate, this.horizontal_lines, this.getTopLeft(), this.getBottomLeft(), this.getTopRight(), this.getBottomRight());
		var closest_vertical_line = this.getClosestLineArray(Grid.LineDirections.Vertical, transformation, coordinate, this.vertical_lines, this.getTopRight(), this.getTopLeft(), this.getBottomRight(), this.getBottomLeft());
		if(closest_horizontal_line.direction == Grid.LineDirections.None){
			return closest_vertical_line;
		}
		if(closest_vertical_line.direction == Grid.LineDirections.None){
			return closest_horizontal_line;
		}
		if(closest_horizontal_line.distance < closest_vertical_line.distance){
			return closest_horizontal_line;
		}else{
			return closest_vertical_line;
		}
	};
	Grid.prototype.updateLine = function(line, coordinate){
		if(this.isOutsideBox(coordinate))
			return;
		if(line.direction == Grid.LineDirections.Horizontal){
			this.horizontal_lines[line.index] = this.getInterpolationFactor(coordinate, this.getTopLeft(), this.getBottomLeft(), this.getTopRight(), this.getBottomRight());
		}else if(line.direction == Grid.LineDirections.Vertical){
			this.vertical_lines[line.index] = this.getInterpolationFactor(coordinate, this.getTopRight(), this.getTopLeft(), this.getBottomRight(), this.getBottomLeft());
		}
		this.messaging_system.fire(this.messaging_system.events.ImageDisplayChanged, null);
	};
	Grid.prototype.addHorizontalLine = function(coordinate){
		if(this.isOutsideBox(coordinate))
			return;
		this.horizontal_lines.push(this.getInterpolationFactor(coordinate, this.getTopLeft(), this.getBottomLeft(), this.getTopRight(), this.getBottomRight()));
		this.messaging_system.fire(this.messaging_system.events.ImageDisplayChanged, null);
	};
	Grid.prototype.addVerticalLine = function(coordinate){
		if(this.isOutsideBox(coordinate))
			return;
		this.vertical_lines.push(this.getInterpolationFactor(coordinate, this.getTopRight(), this.getTopLeft(), this.getBottomRight(), this.getBottomLeft()));
		this.messaging_system.fire(this.messaging_system.events.ImageDisplayChanged, null);
	};
	Grid.prototype.setCornerArea = function(draw){
		this.show_corner_area = draw;
	};
	Grid.prototype.setSelectedLineHighlighting = function(show){
		this.highlight_selected_line = show;
	};
	Grid.prototype.setCornerClickMargin = function(margin){
		this.corner_click_margin = margin;
	};
	Grid.prototype.setTopRight = function(coordinate){
		this.top_right = coordinate;
	};
	Grid.prototype.setBottomRight = function(coordinate){
		this.bottom_right = coordinate;
	};
	Grid.prototype.setTopLeft = function(coordinate){
		this.top_left = coordinate;
	};
	Grid.prototype.setBottomLeft = function(coordinate){
		this.bottom_left = coordinate;
	};
	Grid.prototype.getBottomLeft = function(){
		return this.bottom_left;
	};
	Grid.prototype.getTopLeft = function(){
		return this.top_left;
	};
	Grid.prototype.getBottomRight = function(){
		return this.bottom_right;
	};
	Grid.prototype.getTopRight = function(){
		return this.top_right;
	};

	return Grid;
})
;