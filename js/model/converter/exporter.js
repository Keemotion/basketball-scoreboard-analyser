define([], function(){
	//Exports to the original format"
	var Exporter = function(data){
		this.data = data;
	};

	function concat_group_name(base_group_name, suffix){
		if(base_group_name.length > 0)
			base_group_name += "_";
		return base_group_name + suffix;
	};
	//generates the export string of obj (this method is called recursively)
	Exporter.prototype.getExportString = function(obj, current_group_name, special){
		var result = "";
		switch(obj.type){
			case 'group':
				var dot_group = true;
				for(var i = 0; i < obj.sub_nodes.length; ++i){
					if(obj.sub_nodes[i].type != "dot"){
						dot_group = false;
						break;
					}
				}
				var special = null;
				if(dot_group){
					special = "inline";
					result += concat_group_name(current_group_name, obj.name) + "_leds=";
				}
				for(var i = 0; i < obj.sub_nodes.length; ++i){
					if(dot_group && i > 0){
						result += ",";
					}
					result += this.getExportString(obj.sub_nodes[i], concat_group_name(current_group_name, obj.name), special);
				}
				if(dot_group){
					result += ",0.023333333\n";
				}
				break;
			case 'digit':
				result += current_group_name + "_digit=";
				for(var i = 0; i < obj.sub_nodes.length; ++i){
					if(i != 0)
						result += ",";
					result += obj.sub_nodes[i].coordinate.x + "," + obj.sub_nodes[i].coordinate.y;
				}
				if(obj.extra_value){
					result += "," + obj.extra_value;
				}
				result += "\n";
				break;
			case 'dot':
				if(special == "inline"){
					result += obj.coordinate.x + "," + obj.coordinate.y;
					return result;
				}else{
					console.log("dot = " + JSON.stringify(obj));
					result += current_group_name + "_led=";
					result += obj.coordinate.x + "," + obj.coordinate.y;
					if(obj.extra_value){
						result += "," + obj.extra_value;
					}
					result += "\n";
				}
				break;
			case 'configuration_key':
				result += obj.key + "=" + obj.value + "\n";
				break;
		}
		if(obj.configuration_keys){
			for(var key in obj.configuration_keys){
				if(obj.configuration_keys.hasOwnProperty(key) && obj.configuration_keys[key] != null){
					result += concat_group_name(current_group_name, obj.name) + "_" + key + "=" + obj.configuration_keys[key] + "\n";
				}
			}
		}
		return result;
	};
	//returns the exportstring of the root node
	Exporter.prototype.export = function(){
		var result = "";
		//TODO: set this.configuration_keys
		for(var i = 0; i < this.data.sub_nodes.length; ++i){
			var subnode = this.data.sub_nodes[i];
			result += this.getExportString(subnode, "");
		}
		console.log("result = " + result);
		return result;
	};
	return Exporter;
});
