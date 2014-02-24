define([], function(){
	var Parser = function(data){
		this.data_string = data;
	};
	Parser.prototype.parse = function(){
		var lines = this.data_string.split('\n');
		var luminance_treshold = 0;
		var luminance_differential_treshold = 0;
		var read_function = 0;
		var sync_function = 0;
		var requested_stability_ms = 0;
		
		var label_objects = new Object();
		
		for(var i = 0; i < lines.length; ++i){
			lines[i] = lines[i].trim();
			if(lines[i].length==0)
				continue;
			var parts = lines[i].split('=');
			var key = parts[0];
			var value=parts[1];
			//console.log("key = "+key);
			switch(key){
				case 'luminance_threshold':
					luminance_treshold = value;
					break;
				case 'luminance_differential_threshold':
					luminance_differential_treshold = value;
					break;
				case 'read_function':
					read_function = value;
					break;
				case 'sync_function':
					sync_function = value;
					break;
				case 'requested_stability_ms':
					requested_stability_ms = value;
					break;
				default:
					var key_parts = key.split('_');
					value_parts = value.split(',');
					var label_object_to_add = null;
					if(!(key in label_objects)){
						//console.log("making label object with key name "+key);
						label_objects[key] = new Object();
						label_objects[key].name = key;
						label_objects[key].sub_nodes = new Array();
					}
					switch(key_parts[key_parts.length-1]){
						case 'leds':
							for(var j = 0; j < value_parts.length/2; ++j){
								var x = value_parts[2*j];
								var y = value_parts[2*j+1];
								var d = new Object();
								d.coordinate = new Object();
								d.coordinate.x = x;
								d.coordinate.y = y;
								d.type = "dot";
								label_objects[key].sub_nodes.push(d);
							}
							break;
						case 'digit':
							var dig = new Object();
							dig.corners = new Array();
							dig.type = "digit";
							for(var j = 0; j < value_parts.length/2; ++j){
								var d = new Object();
								d.coordinate = new Object();
								d.coordinate.x = value_parts[j*2];
								d.coordinate.y = value_parts[j*2+1];
								dig.corners.push(d);
							}
							if(value_parts.length%2==1){
								dig.extra_value = value_parts[value_parts.length-1];
							}
							label_objects[key].sub_nodes.push(dig);
							break;
						default:
							to_add = null;
					}
			}
		}
		var result = new Object();
		result.sub_nodes = new Array();
		for(var name in label_objects){
			if(label_objects.hasOwnProperty(name)){
				result.sub_nodes.push(label_objects[name]);
			}
		}
		return result;
	};
	return Parser;
});