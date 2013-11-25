define(['./canvas/canvas', './stateview/loadstatecomponent'], function(MyCanvas, LoadStateComponent){
    var View = function(target_view, messaging_system){
    	this.messaging_system = messaging_system;
		this.element = target_view;
        this.element.html('');
        var canvas_div = $('<div>');
        var canvas_container_div = $('<div>').attr({
        		class: 'div_horizontal',
        		id: 'div_image'
        		})
        	.append(canvas_div);
        var current_state_div = $('<div>').attr({
        		class:'div_state',
        		id: 'div_current_state'
        		}).text('to fill current state div');
      	var load_state_div = $('<div>').attr({
  				class:'div_state',
  				id:'div_load_state'
      			});
        var state_container_div = $('<div>').attr({
		    	class: 'div_horizontal',
		    	id: 'div_state_container'
		    	})
        	.append(current_state_div)
        	.append(load_state_div);
        var left_container_div = $('<div>').attr({
        		class: 'div_vertical',
        		id:'div_main_container'
        		})
        	.append(canvas_container_div)
        	.append(state_container_div);
        var toolbox_tree_div = $('<div>').attr({
        		id:'div_toolbox_objects_tree',
        		}).text('fill toolbox tree');
        var toolbox_details_div = $('<div>').attr({
        		id:'div_toolbox_objects_details'
        		}).text('fill toolbox details');
        var right_container_div = $('<div>').attr({
        		class:'div_vertical',
        		id:'div_toolbox'
        		})
        	.append(toolbox_tree_div)
        	.append($('<hr>'))
        	.append(toolbox_details_div);
        this.element.append(left_container_div)
        	.append(right_container_div);
        
        this.canvas = new MyCanvas(canvas_div, messaging_system);
        this.loadStateComponent = new LoadStateComponent(load_state_div, messaging_system);
    };
    return View;
});

