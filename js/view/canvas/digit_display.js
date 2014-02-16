define(['./base_display', './corner_display', '../../model/coordinate'], function(BaseDisplay, CornerDisplay, Coordinate){
	var DigitDisplay = function(parent_component, proxy, messaging_system){
		this.init();
		this.setParent(parent_component);
		this.messaging_system = messaging_system;
		this.setProxy(proxy);
		this.loadSubComponents();
	};
	BaseDisplay.applyMethods(DigitDisplay.prototype);
	DigitDisplay.prototype.drawMyself = function(context, transformation){
		if(!this.getProxy().getSimulating()){
			return;
		}
		var sub_proxies = this.getProxy().getSubNodes();
		if(sub_proxies.length != 4)
			return;
		var coordinates = new Array();
		for(var i = 0; i < sub_proxies.length; ++i){
			if(!sub_proxies[i].getCoordinate().isValid()){
				return;
			}
			coordinates.push(transformation.transformImageCoordinateToCanvasCoordinate(sub_proxies[i].getCoordinate()));
		}
		var left_middle = new Coordinate((coordinates[0].getX()+coordinates[3].getX())/2.0, (coordinates[0].getY()+coordinates[3].getY())/2.0);
		var right_middle = new Coordinate((coordinates[1].getX()+coordinates[2].getX())/2.0, (coordinates[1].getY()+coordinates[2].getY())/2.0);
		context.lineWidth = 5;
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
		//console.log("TODO: digitdisplay has overridden this drawMyself method, but still needs some proper implementation");
	};
	DigitDisplay.prototype.loadSubComponents = function(){
		var sub_proxies = this.getProxy().getSubNodes();
		this.sub_components.length = 0;
		for(var i = 0; i < sub_proxies.length; ++i){
			this.sub_components.push(new CornerDisplay(this, sub_proxies[i], this.messaging_system));
		}
	};
	return DigitDisplay;
});
