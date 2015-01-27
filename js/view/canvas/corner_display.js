define(["./base_display", "../../model/coordinate", "require", "../view"], function(BaseDisplay, Coordinate){
	//Represents the properties to be displayed of a Corner object
	var CornerDisplay = function(parent_component, proxy, messaging_system){
		this.init();
		this.setParent(parent_component);
		this.messaging_system = messaging_system;
		this.setProxy(proxy);
	};
	CornerDisplay.prototype = new BaseDisplay();
	//Draws a circle around the Corner coordinate
	CornerDisplay.prototype.drawMyself = function(context, transformation, selection_tree, application_state){
		/*if(!this.getProxy().getCoordinate().isValid())
			return;
		var c = transformation.transformRelativeImageCoordinateToCanvasCoordinate(this.getProxy().getCoordinate());
		context.beginPath();
		context.strokeStyle = "#0000FF";
		context.lineWidth = 3;
		context.arc(c.x, c.y, this.getRadius(transformation), 0, 2 * Math.PI);
		context.stroke();*/
	};
	CornerDisplay.prototype.drawMyselfSelected = function(context, transformation, single_selected, parent_already_selected, draw_extensions){
		if(!this.getProxy().getCoordinate().isValid())
			return;
		if(!single_selected)
			return;
		var c = transformation.transformRelativeImageCoordinateToCanvasCoordinate(this.getProxy().getCoordinate());
		context.beginPath();
		context.strokeStyle = "#0000FF";
		context.lineWidth = 3;
		context.arc(c.x, c.y, this.getRadius(transformation), 0, 2 * Math.PI);
		context.stroke();
	};
	//Draws itself and its parent (meant to be called when the corner is being dragged around the canvas)
	CornerDisplay.prototype.drawChanging = function(context, transformation){
		this.getParent().draw(context, transformation);
	};
	CornerDisplay.prototype.canBeSelected = function(){
		//TODO:only if parent is selected!
		return true;
	};
	CornerDisplay.prototype.getRadius = function(transformation){
		var siblings = this.getParent().getProxy().getSubNodes();
		var best = 99999999999999;
		var single = true;
		for(var i = 0; i < siblings.length; ++i){
			if(i == this.getProxy().getId())
				continue;
			if(!siblings[i].isComplete()){
				continue;
			}
			single = false;
			var tmp_distance = Coordinate.getDistance(transformation.transformRelativeImageCoordinateToCanvasCoordinate(this.getProxy().getCoordinate()),
				transformation.transformRelativeImageCoordinateToCanvasCoordinate(siblings[i].getCoordinate()));
			best = Math.min(best, tmp_distance);
		}
		if(single)
			best = 50;
		return best/3;
	};
	CornerDisplay.prototype.getObjectAroundCoordinate = function(canvas_coordinate, transformation, selected_object_identification, selection_tree, application_state){
		if(!this.getProxy().isComplete()){
			return null;
		}
		var distance = Coordinate.getDistance(canvas_coordinate, transformation.transformRelativeImageCoordinateToCanvasCoordinate(this.getProxy().getCoordinate()));
		if(distance < this.getRadius(transformation)){
			return this;
		}
		return null;
	};
	CornerDisplay.prototype.isInRectangle = function(rectangle){
		var coordinate = this.getProxy().getCoordinate();
		var result = coordinate.getX() > rectangle.getTopLeft().getX()
			&& coordinate.getX() < rectangle.getBottomRight().getX()
			&& coordinate.getY() > rectangle.getTopLeft().getY()
			&& coordinate.getY() < rectangle.getBottomRight().getY();
		return result;
	};
	return CornerDisplay;
});
