define(["../../model/coordinate", "../../helpers/geometry"], function(Coordinate, Geometry){
	var Grid = function(messaging_system){
		this.messaging_system = messaging_system;
		this.setTopRight(new Coordinate(1.0, 1.0));
		this.setBottomRight(new Coordinate(1.0, -1.0));
		this.setBottomLeft(new Coordinate(-1.0, -1.0));
		this.setTopLeft(new Coordinate(-1.0, 1.));
		this.horizontal_lines = [];
		this.vertical_lines = [];
	};
	Grid.prototype.draw = function(context, transformation){
		var topright = transformation.transformRelativeImageCoordinateToCanvasCoordinate(this.getTopRight());
		var bottomright = transformation.transformRelativeImageCoordinateToCanvasCoordinate(this.getBottomRight());
		var bottomleft = transformation.transformRelativeImageCoordinateToCanvasCoordinate(this.getBottomLeft());
		var topleft = transformation.transformRelativeImageCoordinateToCanvasCoordinate(this.getTopLeft());

		context.beginPath();
		context.moveTo(topright.getX(), topright.getY());
		context.lineTo(bottomright.getX(), bottomright.getY());
		context.lineTo(bottomleft.getX(), bottomleft.getY());
		context.lineTo(topleft.getX(), topleft.getY());
		context.lineTo(topright.getX(), topright.getY());
		context.stroke();
		this.drawLines(context, transformation, this.horizontal_lines, this.getTopLeft(), this.getBottomLeft(), this.getTopRight(), this.getBottomRight());
		this.drawLines(context, transformation, this.vertical_lines, this.getTopRight(), this.getTopLeft(), this.getBottomRight(), this.getBottomLeft());
	};
	Grid.prototype.drawLines = function(context, transformation, lines, line1_point1, line1_point2, line2_point1, line2_point2){
		for(var i = 0; i < lines.length; ++i){
			var point1 = line1_point1.add(line1_point2.subtract(line1_point1).scalarMultiply(lines[i]));
			var point2 = line2_point1.add(line2_point2.subtract(line2_point1).scalarMultiply(lines[i]));
			var transformed_point1 = transformation.transformRelativeImageCoordinateToCanvasCoordinate(point1);
			var transformed_point2 = transformation.transformRelativeImageCoordinateToCanvasCoordinate(point2);
			context.beginPath();
			context.moveTo(transformed_point1.getX(), transformed_point1.getY());
			context.lineTo(transformed_point2.getX(), transformed_point2.getY());
			context.stroke();
		}
	};
	Grid.prototype.getInterpolationFactor = function(coordinate, line1_point1, line1_point2, line2_point1, line2_point2){
		console.log("interpolation factor: ");
		console.log(JSON.stringify(line1_point1));
		console.log(JSON.stringify(line2_point1));
		console.log(JSON.stringify(line1_point2));
		console.log(JSON.stringify(line2_point2));

		var left = 0.0;
		var right = 1.0;
		var EPS = .00001;
		while(left + EPS < right){
			var middle = (left+right)/2;
			var line1_middle = line1_point1.add(line1_point2.subtract(line1_point1).scalarMultiply(middle));
			var line2_middle = line2_point1.add(line2_point2.subtract(line2_point1).scalarMultiply(middle));
			console.log("line1_middle = "+JSON.stringify(line1_middle));
			console.log("line2_middle = "+JSON.stringify(line2_middle));
			console.log(JSON.stringify(coordinate.subtract(line1_middle))+ " x " + JSON.stringify(line2_middle.subtract(line1_middle)));
			var cp = Geometry.crossProduct(coordinate.subtract(line1_middle), line2_middle.subtract(line1_middle));
			console.log("cp = "+cp);
			if(cp > 0){
				left = middle;
			}else{
				right = middle;
			}
		}
		console.log("interpolation factor = "+(left+right)/2.0);
		return (left+right)/2.0;
	};
	//returns whether coordinate is outside the grid box
	Grid.prototype.isOutsideBox = function(coordinate){
		//TODO: implement
		//use Geometry.isInsidePolygon()
		return false;
	};
	Grid.prototype.addHorizontalLine = function(coordinate){
		if(this.isOutsideBox(coordinate))
			return;
		this.horizontal_lines.push(this.getInterpolationFactor(coordinate, this.getTopLeft(), this.getBottomLeft(), this.getTopRight(), this.getBottomRight()));
		this.messaging_system.fire(this.messaging_system.events.DisplayObjectsChanged, null);
	};
	Grid.prototype.addVerticalLine = function(coordinate){
		if(this.isOutsideBox(coordinate))
			return;
		this.vertical_lines.push(this.getInterpolationFactor(coordinate, this.getTopRight(), this.getTopLeft(), this.getBottomRight(), this.getBottomLeft()));
		this.messaging_system.fire(this.messaging_system.events.DisplayObjectsChanged, null);
	}
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
});