define([], function(){
		return function MyCanvas (target_view, messaging_system){
			this.canvasElement = $('<canvas>').attr({
        		class:'canvas_image',
        		width:'1024',
        		height:'768'
        		});
			this.containerElement = target_view;
			$(this.containerElement).append(this.canvasElement);
		};
	}
);
