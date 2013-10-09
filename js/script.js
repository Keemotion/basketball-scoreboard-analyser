alert("test");
/**
 *
 * objects = array of {name, digit_amount, digits = array of 4 coordinates {x,y} }
 *
 */
var objects = new Array();

function loadObjects(){
    objects = new Array();    
    addObject("team1_naam1", 3);
}
function addObject(label_name, digit_amount){
    var o = new Object();
    o.name = label_name;
    o.digit_amount = digit_amount;
    o.digits = new Array(digit_amount);
    for(var i = 0; i < digit_amount; ++i){
        o.digits[i].coordinates = new Array(4);
        for(var j = 0; j < 4; ++j){
            o.digits[i].coordinates[j] = new Array(2);
		   	o.digits[i][0]=null;
			o.digits[i][1]=null;
        }
    }
    objects.push(o);
}


loadObjects();
