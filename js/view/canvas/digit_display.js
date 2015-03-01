define(['./base_display', './corner_display', '../../model/coordinate', "../../helpers/geometry"], function(BaseDisplay, CornerDisplay, Coordinate, Geometry){
	var DigitDisplay = function(parent_component, proxy, messaging_system){
		this.init();
		this.setParent(parent_component);
		this.messaging_system = messaging_system;
		this.setProxy(proxy);
		this.loadSubComponents();
	};
	DigitDisplay.prototype = new BaseDisplay();
	DigitDisplay.prototype.drawMyself = function(context, transformation, selection_tree){
		var sub_proxies = this.getProxy().getSubNodes();
		if(sub_proxies.length != 4)
			return;
		var coordinates = new Array();
		for(var i = 0; i < sub_proxies.length; ++i){
			if(!sub_proxies[i].getCoordinate().isValid()){
				return;
			}
			coordinates.push(transformation.transformRelativeImageCoordinateToCanvasCoordinate(sub_proxies[i].getCoordinate()));
		}
		var left_middle = new Coordinate((coordinates[0].getX() + coordinates[3].getX()) / 2.0, (coordinates[0].getY() + coordinates[3].getY()) / 2.0);
		var right_middle = new Coordinate((coordinates[1].getX() + coordinates[2].getX()) / 2.0, (coordinates[1].getY() + coordinates[2].getY()) / 2.0);
		context.lineWidth = 2;
		context.beginPath();
		context.moveTo(left_middle.getX(), left_middle.getY());
		context.lineTo(coordinates[0].getX(), coordinates[0].getY());
		context.lineTo(coordinates[1].getX(), coordinates[1].getY());
		context.lineTo(right_middle.getX(), right_middle.getY());
		context.lineTo(left_middle.getX(), left_middle.getY());
		context.lineTo(coordinates[3].getX(), coordinates[3].getY());
		context.lineTo(coordinates[2].getX(), coordinates[2].getY());
		context.lineTo(right_middle.getX(), right_middle.getY());
		context.strokeStyle = "#00aa00";
		context.stroke();
	};
	DigitDisplay.prototype.drawMyselfSelected = function(context, transformation, single_selected, parent_already_selected, draw_extensions){
		var sub_proxies = this.getProxy().getSubNodes();
		if(sub_proxies.length != 4)
			return;
		var coordinates = new Array();
		for(var i = 0; i < sub_proxies.length; ++i){
			if(!sub_proxies[i].getCoordinate().isValid()){
				return;
			}
			coordinates.push(transformation.transformRelativeImageCoordinateToCanvasCoordinate(sub_proxies[i].getCoordinate()));
		}

		var left_middle = new Coordinate((coordinates[0].getX() + coordinates[3].getX()) / 2.0, (coordinates[0].getY() + coordinates[3].getY()) / 2.0);
		var right_middle = new Coordinate((coordinates[1].getX() + coordinates[2].getX()) / 2.0, (coordinates[1].getY() + coordinates[2].getY()) / 2.0);
		context.lineWidth = 2;
		context.beginPath();
		context.moveTo(left_middle.getX(), left_middle.getY());
		context.lineTo(coordinates[0].getX(), coordinates[0].getY());
		context.lineTo(coordinates[1].getX(), coordinates[1].getY());
		context.lineTo(right_middle.getX(), right_middle.getY());
		context.lineTo(left_middle.getX(), left_middle.getY());
		context.lineTo(coordinates[3].getX(), coordinates[3].getY());
		context.lineTo(coordinates[2].getX(), coordinates[2].getY());
		context.lineTo(right_middle.getX(), right_middle.getY());
		context.strokeStyle = "#00ff00";
		context.stroke();
		//sampling points:
		var sampling_points = new Array();
		sampling_points.push(Coordinate.getMiddle([coordinates[0], coordinates[1]]));
		sampling_points.push(Coordinate.getMiddle([coordinates[1], right_middle]));
		sampling_points.push(Coordinate.getMiddle([right_middle, coordinates[2]]));
		sampling_points.push(Coordinate.getMiddle([coordinates[2], coordinates[3]]));
		sampling_points.push(Coordinate.getMiddle([coordinates[3], left_middle]));
		sampling_points.push(Coordinate.getMiddle([left_middle, coordinates[0]]));
		sampling_points.push(Coordinate.getMiddle([right_middle, left_middle]));

		sampling_points.push(Coordinate.getMiddle([coordinates[0], coordinates[1], left_middle, right_middle]));
		sampling_points.push(Coordinate.getMiddle([coordinates[2], coordinates[3], left_middle, right_middle]));

		//only draw if no circles intersect
		var sampling_point_radius = 5;
		var intersecting = false;
		for(var i = 0; i < sampling_points.length && !intersecting; ++i){
			for(var j = 0; j < i; ++j){
				if(Coordinate.getSquareDistance(sampling_points[i], sampling_points[j]) <= 2 * sampling_point_radius){
					intersecting = true;
					break;
				}
			}
		}
		if(!intersecting){
			for(var i = 0; i < sampling_points.length; ++i){
				context.beginPath();
				context.arc(sampling_points[i].getX(), sampling_points[i].getY(), sampling_point_radius, 0, 2 * Math.PI);
				context.lineWidth = 3;
				context.strokeStyle = "#00ff00";
				context.stroke();
			}
		}
		if(draw_extensions){

			context.beginPath();
			var draw_line = function(point1, point2){
				var y0 = -point2.getX() * (point1.getY() - point2.getY()) / (point1.getX() - point2.getX()) + point2.getY();
				var x_f = transformation.getCanvasWidth();
				var y_f = (x_f - point2.getX()) * (point1.getY() - point2.getY()) / (point1.getX() - point2.getX()) + point2.getY();

				context.moveTo(0, y0);
				context.lineTo(x_f, y_f);

			}
			draw_line(coordinates[0], coordinates[1]);
			draw_line(coordinates[2], coordinates[3]);
			context.lineWidth = 1;
			context.strokeStyle = "#FFFF66";
			context.stroke();
		}
		for(var i = 0; i < this.sub_components.length; ++i){
			this.sub_components[i].drawMyselfSelected(context, transformation);
		}
	};
	DigitDisplay.prototype.loadSubComponents = function(){
		var sub_proxies = this.getProxy().getSubNodes();
		this.sub_components.length = 0;
		for(var i = 0; i < sub_proxies.length; ++i){
			this.sub_components.push(new CornerDisplay(this, sub_proxies[i], this.messaging_system));
		}
	};

	DigitDisplay.prototype.getObjectAroundCoordinate = function(canvas_coordinate, transformation, selected_object_identification, selection_tree, application_state){
		var points = Array();
		for(var i = 0; i < this.sub_components.length; ++i){
			//only if this digit is selected (and only this digit)
			if(selected_object_identification != null && this.getProxy().isPossiblyAboutThis(selected_object_identification)){
				var res = this.sub_components[i].getObjectAroundCoordinate(canvas_coordinate, transformation, selected_object_identification, selection_tree, application_state);
				if(res != null)
					return res;
			}
			points.push(transformation.transformRelativeImageCoordinateToCanvasCoordinate(this.sub_components[i].getProxy().getCoordinate()));
		}
		var c2 = canvas_coordinate;
		var cx = c2.getX();
		var cy = c2.getY();
		if(Geometry.insidePolygon(points, cx, cy)){
			return this;
		}
		return null;
	};
	DigitDisplay.prototype.isInRectangle = function(rectangle){
		var coordinates = [];
		for(var i = 0; i < this.sub_components.length; ++i){
			coordinates.push(this.sub_components[i].getProxy().getCoordinate());
		}
		var polygon = [rectangle.getTopLeft(), rectangle.getTopRight(), rectangle.getBottomRight(), rectangle.getBottomLeft()];
		var center = Coordinate.getMiddle(coordinates);
		return Geometry.insidePolygon(polygon, center.getX(), center.getY());
	}
	DigitDisplay.prototype.canBeSelected = function(){
		return true;
	};
	return DigitDisplay;
});
