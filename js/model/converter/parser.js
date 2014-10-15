define([], function(){
	//loads the data of the original file format to a javascript Object that can be loaded by the State class
	var Parser = function(data){
		this.data_string = data;
	};

	function end_matches(base_str, pattern){
		return base_str.substring(base_str.length - pattern.length) == pattern;
	};
	function subtract(base_str, pattern){
		return base_str.substring(0, base_str.length - pattern.length);
	};

	Parser.prototype.parse = function(){
		var lines = this.data_string.split('\n');
		var root_groups = new Object();

		var result = new Object();
		result.sub_nodes = new Array();

		for(var i = 0; i < lines.length; ++i){
			lines[i] = lines[i].trim();
			if(lines[i].length == 0)
				continue;
			var parts = lines[i].split('=');
			var key = parts[0];
			var value = parts[1];
			switch(key){
				case 'must_be_on':
				case 'luminance_threshold':
				case 'luminance_differential_threshold':
				case 'requested_stability_ms':
				case 'read_function':
				case 'sync_function':
				case 'parse_function':
				case 'dtype':
					var obj = new Object();
					obj.key = key;
					obj.value = value;
					obj.type = "configuration_key";
					result.sub_nodes.push(obj);
					break;
				default:
					var action = "none";
					if(end_matches(key, "_digit")){
						action = "digit";
						key = subtract(key, "_digit");
					}else if(end_matches(key, "_leds")){
						action = "leds";
						key = subtract(key, "_leds");
					}else if(end_matches(key, "_led")){
						action = "led";
						key = subtract(key, "_led");
					}else if(end_matches(key, "_parse_function")){
						action = "parse_function";
						key = subtract(key, "_parse_function");
					}else if(end_matches(key, "_read_function")){
						action = "read_function";
						key = subtract(key, "_read_function");
					}else if(end_matches(key, "_sync_function")){
						action = "sync_function";
						key = subtract(key, "_sync_function");
					}else if(end_matches(key, "_first_digit_restricted")){
						action = "first_digit_restricted";
						key = subtract(key, "_first_digit_restricted");
					}else if(end_matches(key, "_must_be_on")){
						action = "must_be_on";
						key = subtract(key, "_must_be_on");
					}else if(end_matches(key, "_dtype")){
						action = "dtype";
						key = subtract(key, "_dtype");
					}else if(end_matches(key, "_luminance_threshold")){
						action = "luminance_threshold";
						key = subtract(key, "_luminance_threshold");
					}
					value_parts = value.split(',');
					if(!(key in root_groups)){
						root_groups[key] = new Object();
						root_groups[key].name = key;
						root_groups[key].sub_nodes = new Array();
						root_groups[key].configuration_keys = new Object();
						root_groups[key].type = "group";
						result.sub_nodes.push(root_groups[key]);
					}
					switch(action){
						case 'none':
							break;
						case 'leds':
						case 'led':
							root_groups[key].group_type = "dot";
							for(var j = 0; j < Math.floor(value_parts.length / 2); ++j){
								var x = value_parts[2 * j];
								var y = value_parts[2 * j + 1];
								var d = new Object();
								d.coordinate = new Object();
								d.coordinate.x = x;
								d.coordinate.y = y;
								d.type = "dot";
								root_groups[key].sub_nodes.push(d);
							}
							if(value_parts.length % 2 == 1){
								root_groups[key].extra_led_value = value_parts[value_parts.length - 1];
							}
							break;
						case 'digit':
							root_groups[key].group_type = "digit";
							var dig = new Object();
							dig.corners = new Array();
							dig.type = "digit";
							for(var j = 0; j < Math.floor(value_parts.length / 2); ++j){
								var d = new Object();
								d.coordinate = new Object();
								d.coordinate.x = value_parts[j * 2];
								d.coordinate.y = value_parts[j * 2 + 1];
								dig.corners.push(d);
							}
							if(value_parts.length % 2 == 1){
								dig.extra_value = value_parts[value_parts.length - 1];
							}
							root_groups[key].sub_nodes.push(dig);
							break;
						default:
							root_groups[key].configuration_keys[action] = value_parts[0];
							break;
					}
			}
		}
		return result;
	};
	return Parser;
});
