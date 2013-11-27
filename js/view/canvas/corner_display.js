define(["./base_display"], function(BaseDisplay){
	var CornerDisplay = function(parent_component, proxy, messaging_system){
		this.init();
		this.setParent(parent_component);
		this.messaging_system = messaging_system;
		this.setProxy(proxy);
	};
	BaseDisplay.applyMethods(CornerDisplay.prototype);
	CornerDisplay.prototype.drawMyself = function(context, transformation){
		var c = transformation.transformImageCoordinateToCanvasCoordinate(this.getProxy().getCoordinate());
		context.beginPath();
		context.strokeStyle = "#0000FF";
		context.lineWidth = 3;
		context.arc(c.x, c.y, 5, 0, 2*Math.PI);
		context.stroke();
	};
	return CornerDisplay;
});
