define([], function(){
	var GridModeChangedEvent = function(grid_mode){
		this.grid_mode = grid_mode;
	};
	GridModeChangedEvent.prototype.getGridMode = function(){
		return this.grid_mode;
	};
	return GridModeChangedEvent;
});