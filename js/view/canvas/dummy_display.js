define([
	"./base_display"
], function(BaseDisplay){
	var DummyDisplay = function(proxy){
		this.init();
		this.setProxy(proxy);
	};
	DummyDisplay.prototype = new BaseDisplay();
	//DummyDisplay.prototype.draw = function(){};
	return DummyDisplay;
});
