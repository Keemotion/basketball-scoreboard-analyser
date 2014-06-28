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
		console.log("normal draw dot: "+JSON.stringify(this.getProxy().getIdentification()));
		var c = transformation.transformRelativeImageCoordinateToCanvasCoordinate(this.getProxy().getCoordinate());
		context.beginPath();
		context.strokeStyle = "#FF0000";
		context.lineWidth = 3;
		context.arc(c.x, c.y, 5, 0, 2*Math.PI);
		context.stroke();
	};
	DotDisplay.prototype.drawMyselfSelected = function(context, transformation){
		if(!this.getProxy().getCoordinate().isValid()){
			return;
		}
		console.log("selected draw dot: "+JSON.stringify(this.getProxy().getIdentification()));
		var c = transformation.transformRelativeImageCoordinateToCanvasCoordinate(this.getProxy().getCoordinate());
		context.beginPath();
		context.strokeStyle = "#880000";
		context.lineWidth=  3;
		context.arc(c.x, c.y, 5, 0, 2*Math.PI);
		context.stroke();
	};
	//Returns whether the given coordinate is within 5 canvas pixels from the dot coordinate
	DotDisplay.prototype.isAtCanvasCoordinate = function(coordinate, transformation, current){
		var distance =Coordinate.getSquareDistance(coordinate, transformation.transformRelativeImageCoordinateToCanvasCoordinate(this.getProxy().getCoordinate()));
		if(distance <= current.maximal_sq_distance){
			current.maximal_sq_distance = distance;
			return true;
		}
		return false;
	};
	DotDisplay.prototype.drawChanging = function(context, transformation){
		//this.getParent().drawChanging(context, transformation);
	};
	DotDisplay.prototype.isInRectangle = function(transformation, start_coordinate, end_coordinate) {
		var canvas_coordinate = transformation.transformRelativeImageCoordinateToCanvasCoordinate(this.getProxy().getCoordinate());
		var margin = 5;
		return canvas_coordinate.getX() > start_coordinate.getX() - margin && canvas_coordinate.getX() < end_coordinate.getX() + margin && canvas_coordinate.getY() > start_coordinate.getY() - margin && canvas_coordinate.getY() < end_coordinate.getY() - margin;
//		return true;
	};
	DotDisplay.prototype.canBeSelected = function(){
		return true;
	};
	
	DotDisplay.prototype.getObjectAroundCanvasCoordinate = function(coordinate){
		if(Coordinate.getSquareDistance(coordinate, this.getProxy().getCoordinate()) <= 0.001){
			return this.getParent();
		}
	};
	return DotDisplay;
});
