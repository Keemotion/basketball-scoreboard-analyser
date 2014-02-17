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
		context.lineWidth = 2;
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
		var sampling_points = new Array();
		sampling_points.push(Coordinate.getMiddle([coordinates[0], coordinates[1]]));
		sampling_points.push(Coordinate.getMiddle([coordinates[1], right_middle]));
		sampling_points.push(Coordinate.getMiddle([right_middle, coordinates[2]]));
		sampling_points.push(Coordinate.getMiddle([coordinates[2], coordinates[3]]));
		sampling_points.push(Coordinate.getMiddle([coordinates[3], left_middle]));
		sampling_points.push(Coordinate.getMiddle([left_middle, coordinates[0]]));
		sampling_points.push(Coordinate.getMiddle([right_middle, left_middle]));
		
		sampling_points.push(Coordinate.getMiddle([coordinates[0], coordinates[1], left_middle, right_middle]));
		sampling_points.push(Coordinate.getMiddle([coordinates[2], coordinates[3], left_middle, right_middle]));
		
		//only draw if no circles intersect
		var sampling_point_radius = 5;
		var intersecting = false;
		for(var i = 0; i < sampling_points.length && !intersecting; ++i){
			for(var j = 0; j < i; ++j){
				if(Coordinate.getSquareDistance(sampling_points[i], sampling_points[j]) <= 2*sampling_point_radius){
					intersecting = true;
					break;
				}
			}
		}
		if(!intersecting){
			for(var i = 0; i < sampling_points.length; ++i){
				context.beginPath();
				context.arc(sampling_points[i].getX(), sampling_points[i].getY(), sampling_point_radius, 0, 2*Math.PI);
				context.lineWidth = 3;
				context.strokeStyle = "#00ff00";
				context.stroke();
			}
		}
		//sampling points:
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
