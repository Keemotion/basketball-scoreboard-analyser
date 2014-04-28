define(["./base_display", "../../model/coordinate"], function(BaseDisplay, Coordinate){
	//Represents the properties to be displayed of a Corner object
	var CornerDisplay = function(parent_component, proxy, messaging_system){
		this.init();
		this.setParent(parent_component);
		this.messaging_system = messaging_system;
		this.setProxy(proxy);
	};
	CornerDisplay.prototype = new BaseDisplay();
	//Draws a circle around the Corner coordinate
	CornerDisplay.prototype.drawMyself = function(context, transformation){
		if(!this.getProxy().getCoordinate().isValid())
			return;
		var c = transformation.transformRelativeImageCoordinateToCanvasCoordinate(this.getProxy().getCoordinate());
		context.beginPath();
		context.strokeStyle = "#0000FF";
		context.lineWidth = 3;
		context.arc(c.x, c.y, 5, 0, 2*Math.PI);
		context.stroke();
	};
	//Returns whether the given canvas coordinate is within 5 pixels of the Corner Coordinate
	CornerDisplay.prototype.isAtCanvasCoordinate = function(coordinate, transformation, current){
		var distance =Coordinate.getSquareDistance(coordinate, transformation.transformRelativeImageCoordinateToCanvasCoordinate(this.getProxy().getCoordinate())); 
		if(distance <= current.maximal_sq_distance){
			current.maximal_sq_distance = distance;
			console.log("at canvas coordinate!");
			return true;
		}
		return false;
	};
	//Draws itself and its parent (meant to be called when the corner is being dragged around the canvas)
	CornerDisplay.prototype.drawChanging = function(context, transformation){
		this.getParent().draw(context, transformation);
	};
	return CornerDisplay;
});
