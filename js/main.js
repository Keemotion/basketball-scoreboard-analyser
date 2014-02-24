define(["jquery-1.10.2.min", "controller/application"], 
	function(jq, Controller){
       	this.c = new Controller($('body'));
        //this.c.loadImage("./testdata/scoreboard-images/chalon.png");
        this.c.loadImage('./testdata/print_sbds_20131102T214959.236.png');
    }
);

