define(["controller/application"], 
	function(Controller){
	   	this.c = new Controller($('body'));
		//this.c.loadImage("./testdata/scoreboard-images/chalon.png");
		//TODO: load image from GUI
		this.c.loadImage('./testdata/print_sbds_20131102T214959.236.png');
	}
);

