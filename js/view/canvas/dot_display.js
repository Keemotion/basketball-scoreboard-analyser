define(['./base_display', './corner_display', '../../model/coordinate'], function(BaseDisplay, CornerDisplay, Coordinate){
	var DotDisplay = function(parent_component, proxy, messaging_system){
		this.init();
		this.setParent(parent_component);
		this.messaging_system = messaging_system;
		this.setProxy(proxy);
	};
	//BaseDisplay.applyMethods(DotDisplay.prototype);
	DotDisplay.prototype = new BaseDisplay();
	DotDisplay.prototype.drawMyself = function(context, transformation){
		/*if(!this.getProxy().getSimulating()){
			return;
		}*/
		
		var c = transformation.transformImageCoordinateToCanvasCoordinate(this.getProxy().getCoordinate());
		context.beginPath();
		context.strokeStyle = "#FF0000";
		context.lineWidth = 3;
		context.arc(c.x, c.y, 5, 0, 2*Math.PI);
		context.stroke();
		//sampling points:
		//console.log("TODO: digitdisplay has overridden this drawMyself method, but still needs some proper implementation");
	};
	return DotDisplay;
});
