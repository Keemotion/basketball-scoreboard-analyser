define(['./base_display', './corner_display', '../../model/coordinate', '../application_states'], function(BaseDisplay, CornerDisplay, Coordinate, ApplicationStates){
	//Display equivalent of Dot
	var DotDisplay = function(parent_component, proxy, messaging_system){
		this.init();
		this.setParent(parent_component);
		this.messaging_system = messaging_system;
		this.setProxy(proxy);
	};
	DotDisplay.prototype = new BaseDisplay();
	//Draws a circle around the coordinate
	DotDisplay.prototype.drawMyself = function(context, transformation, selection_tree, application_state){
		if(!this.getProxy().getCoordinate().isValid()){
			return;
		}
		var c = transformation.transformRelativeImageCoordinateToCanvasCoordinate(this.getProxy().getCoordinate());
		var selected = selection_tree.hasSelectedParent(this.getProxy().getIdentification());
		if(!selected){
			context.strokeStyle = "#FF0000";
			context.beginPath();
			context.lineWidth = 3;
			context.arc(c.x, c.y, this.getMultiSelectedRadius(transformation), 0, 2 * Math.PI);
			context.stroke();
		}
		context.strokeStyle = "#000000";
		context.beginPath();
		context.lineWidth=1;
		context.arc(c.x, c.y, this.getDotRadius(), 0, 2*Math.PI);
		context.fill();
	};
	DotDisplay.prototype.drawMyselfSelected = function(context, transformation, application_state, parent_already_selected, draw_extensions){
		if(!this.getProxy().getCoordinate().isValid()){
			return;
		}
		if(application_state == ApplicationStates.SINGLE_SELECTION){
			this.getParent().drawMyselfSelected(context, transformation, application_state);
		}
		var c = transformation.transformRelativeImageCoordinateToCanvasCoordinate(this.getProxy().getCoordinate());
		context.beginPath();
		context.strokeStyle = "#0000FF";
		context.lineWidth = 3;
		if(application_state == ApplicationStates.MULTI_SELECTION && parent_already_selected){
			context.strokeStyle = "#00FF00";
			context.arc(c.x, c.y, this.getMultiSelectedRadius(transformation), 0, 2*Math.PI);
		}else{
			context.arc(c.x, c.y, this.getRadius(transformation), 0, 2 * Math.PI);
		}
		context.stroke();
		context.beginPath();
		context.lineWidth=1;
		context.arc(c.x, c.y, this.getDotRadius(), 0, 2*Math.PI);
		context.fill();
	};
	DotDisplay.prototype.getRadius = function(transformation){
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
	DotDisplay.prototype.getMultiSelectedRadius = function(transformation){
		return this.getRadius(transformation) / 2;
	};
	DotDisplay.prototype.getDotRadius = function(){
		return 2;
	};
	DotDisplay.prototype.drawChanging = function(context, transformation){
	};
	DotDisplay.prototype.canBeSelected = function(){
		return true;
	};
	DotDisplay.prototype.isInRectangle = function(rectangle){
		var coordinate = this.getProxy().getCoordinate();
		return coordinate.getX() > rectangle.getTopLeft().getX()
			&& coordinate.getX() < rectangle.getBottomRight().getX()
			&& coordinate.getY() > rectangle.getTopLeft().getY()
			&& coordinate.getY() < rectangle.getBottomRight().getY();
	};
	DotDisplay.prototype.getObjectAroundCoordinate = function(canvas_coordinate, transformation, selected_object_identification, selection_tree, application_state){
		if(!this.getProxy().isComplete()){
			return null;
		}
		var radius = this.getRadius(transformation);
		if(!selection_tree.isSelected(this.getProxy().getIdentification())){
			if(selection_tree.hasSelectedParent(this.getProxy().getIdentification()) && application_state == ApplicationStates.SINGLE_SELECTION){
				radius = this.getRadius(transformation);
			}else{
				radius = this.getMultiSelectedRadius(transformation);
			}
		}
		var distance = Coordinate.getDistance(canvas_coordinate, transformation.transformRelativeImageCoordinateToCanvasCoordinate(this.getProxy().getCoordinate()));
		if(distance < radius){
			return this;
		}
		return null;
	};
	return DotDisplay;
});
