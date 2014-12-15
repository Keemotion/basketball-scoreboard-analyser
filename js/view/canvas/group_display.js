define(["./base_display",
	"./digit_display",
	"./dot_display",
	"../../messaging_system/event_listener",
	"../application_states"], function(BaseDisplay, DigitDisplay, DotDisplay, EventListener, ApplicationStates){
	//Display Equivalent of Group
	var GroupDisplay = function(parent_component, proxy, messaging_system){
		this.init();
		this.setParent(parent_component);
		this.messaging_system = messaging_system;
		this.setProxy(proxy);
		this.loadSubComponents();
		this.messaging_system.addEventListener(this.messaging_system.events.GroupChanged, new EventListener(this, this.groupChanged));
	};
	GroupDisplay.prototype = new BaseDisplay();
	GroupDisplay.prototype.groupChanged = function(signal, data){
		if(this.getProxy().isPossiblyAboutThis(data.getTargetIdentification())){
			this.loadSubComponents();
		}
	};
	GroupDisplay.prototype.drawMyself = function(context, transformation, selection_tree, application_state){
		if(this.getProxy().getGroupType() == "dot"){
			if(this.sub_components.length  <= 1){
				return;
			}
			context.beginPath();
			context.strokeStyle = "#c00000";
			context.lineWidth = 2;
			var previous_coordinate = transformation.transformRelativeImageCoordinateToCanvasCoordinate(this.sub_components[0].getProxy().getCoordinate());
			context.moveTo(previous_coordinate.getX(), previous_coordinate.getY());
			for(var i = 1; i < this.sub_components.length; ++i){
				var current_coordinate = transformation.transformRelativeImageCoordinateToCanvasCoordinate(this.sub_components[i].getProxy().getCoordinate());
				context.lineTo(current_coordinate.getX(), current_coordinate.getY());
				previous_coordinate = current_coordinate;
			}
			context.stroke();
		}
	};
	GroupDisplay.prototype.drawMyselfSelected = function(context, transformation, application_state, parent_already_selected){
		this.drawMyself(context, transformation);
	};

	GroupDisplay.prototype.loadSubComponents = function(){
		var sub_proxies = this.getProxy().getSubNodes();
		this.sub_components.length = 0;
		for(var i = 0; i < sub_proxies.length; ++i){
			if(sub_proxies[i].getType() == "digit"){
				this.sub_components.push(new DigitDisplay(this, sub_proxies[i], this.messaging_system));
			}else if(sub_proxies[i].getType() == "dot"){
				this.sub_components.push(new DotDisplay(this, sub_proxies[i], this.messaging_system));
			}else if(sub_proxies[i].getType() == "group"){
				this.sub_components.push(new GroupDisplay(this, sub_proxies[i], this.messaging_system));
			}
		}
	};
	/*GroupDisplay.prototype.getObjectAroundCoordinate = function(canvas_coordinate, transformation, selected_object_identification, selection_tree, application_state){
		console.log("group display get object around coordinate");
		if(this.getProxy().getGroupType() == "dot" && selected_object_identification != null && this.getProxy().isPossiblyAboutThis(selected_object_identification)){
			console.log("in dot group");
			//BaseDisplay.prototype.getObjectAroundCoordinate.call(this, canvas_coordinate, transformation, selected_object_identification, selection_tree, application_state);
			var points = Array();
			var single_selected = application_state == ApplicationStates.SINGLE_SELECTION && selection_tree.isSelected(this.getProxy().getIdentification());
			for(var i = 0; i < this.sub_components.length; ++i){
				//only if this digit is selected (and only this digit)
				var res = this.sub_components[i].getObjectAroundCoordinate(canvas_coordinate, transformation, selected_object_identification, selection_tree, application_state);
				if(res != null){

					//if(selected_object_identification != null && this.getProxy().isPossiblyAboutThis(selected_object_identification)){
					if(single_selected){
						//console.log("identification = "+JSON.stringify(selected_object_identification));
						//if(selected_object_identification != null && this.sub_components[i].getProxy().isPossiblyAboutThis(selected_object_identification)){

				//		if(res != null)
							return res;
					}else{
						return this;
					}
				}
			}
			return null;
		}else{
			return BaseDisplay.prototype.getObjectAroundCoordinate.call(this, canvas_coordinate, transformation, selected_object_identification, selection_tree, application_state);
		}
	};*/
	return GroupDisplay;
});
