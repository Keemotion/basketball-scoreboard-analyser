define(["./base_display", "../../model/coordinate"], function(BaseDisplay, Coordinate){
	//Represents the properties to be displayed of a Corner object
	var CornerDisplay = function(parent_component, proxy, messaging_system){
		this.init();
		this.setParent(parent_component);
		this.messagiàng_system = messaging_system;
		this.setProxy(proxy);
	};
	CornerDisplay.prototype = new BaseDisplay();
	//Draws a circle around the Corner coordinate
	CornerDisplay.prototype.drawMyself = function(context, transformation){

	};
	CornerDisplay.prototype.drawMyselfSelected = function(context, transformation){
		if(!this.getProxy().getCoordinate().isValid())
			return;
		var c = transformation.transformRelativeImageCoordinateToCanvasCoordinate(this.getProxy().getCoordinate());
		context.beginPath();
		context.strokeStyle = "#0000FF";
		context.lineWidth = 3;
		context.arc(c.x, c.y, 5, 0, 2 * Math.PI);
		context.stroke();
	};
	//Draws itself and its parent (meant to be called when the corner is being dragged around the canvas)
	CornerDisplay.prototype.drawChanging = function(context, transformation){
		this.getParent().draw(context, transformation);
	};
	CornerDisplay.prototype.canBeSelected = function(){
		return true;
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
