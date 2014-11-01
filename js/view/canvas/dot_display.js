define(['./base_display', './corner_display', '../../model/coordinate'], function(BaseDisplay, CornerDisplay, Coordinate){
	//Display equivalent of Dot
	var DotDisplay = function(parent_component, proxy, messaging_system){
		this.init();
		this.setParent(parent_component);
		this.messaging_system = messaging_system;
		this.setProxy(proxy);
	};
	DotDisplay.prototype = new BaseDisplay();
	//Draws a circle around the coordinate
	DotDisplay.prototype.drawMyself = function(context, transformation){
		if(!this.getProxy().getCoordinate().isValid()){
			return;
		}
		var c = transformation.transformRelativeImageCoordinateToCanvasCoordinate(this.getProxy().getCoordinate());
		context.beginPath();
		context.strokeStyle = "#FF0000";
		context.lineWidth = 3;
		context.arc(c.x, c.y, 5, 0, 2 * Math.PI);
		context.stroke();
	};
	DotDisplay.prototype.drawMyselfSelected = function(context, transformation){
		if(!this.getProxy().getCoordinate().isValid()){
			return;
		}
		var c = transformation.transformRelativeImageCoordinateToCanvasCoordinate(this.getProxy().getCoordinate());
		context.beginPath();
		context.strokeStyle = "#880000";
		context.lineWidth = 3;
		context.arc(c.x, c.y, this.getRadius(), 0, 2 * Math.PI);
		context.stroke();
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
	return DotDisplay;
});
