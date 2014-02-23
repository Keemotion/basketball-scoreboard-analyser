define(['./base_display', './corner_display', '../../model/coordinate'], function(BaseDisplay, CornerDisplay, Coordinate){
	var DotDisplay = function(parent_component, proxy, messaging_system){
		this.init();
		this.setParent(parent_component);
		this.messaging_system = messaging_system;
		this.setProxy(proxy);
	};
	DotDisplay.prototype = new BaseDisplay();
	DotDisplay.prototype.drawMyself = function(context, transformation){
		if(!this.getProxy().getCoordinate().isValid()){
			return;
		}
		var c = transformation.transformImageCoordinateToCanvasCoordinate(this.getProxy().getCoordinate());
		context.beginPath();
		context.strokeStyle = "#FF0000";
		context.lineWidth = 3;
		context.arc(c.x, c.y, 5, 0, 2*Math.PI);
		context.stroke();
	};
	return DotDisplay;
});
