define([], function(){
	var Exporter = function(data){
		this.data = data;
	};
	function concat_group_name(base_group_name, suffix){
		if(base_group_name.length > 0)
			base_group_name += "_";
		return base_group_name + suffix;	
	};
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
				}
				for(var i = 0; i < obj.sub_nodes.length; ++i){
					if(dot_group && i > 0){
						result += ",";
					}
					result += getExportString(obj.sub_nodes[i], concat_group_name(current_group_name, obj.name), special);
				}
				if(dot_group){
					result += "\n";
				}
				break;
			case 'digit':
				result += current_group_name+"_digit=";
				for(var i = 0; i < obj.sub_nodes.length; ++i){
					if(i != 0)
						result += ",";
					result += obj.sub_nodes[i].corners.coordinate.x+","+obj.sub_nodes[i].corners.coordinate.y;	
				}
				return result;
			case 'dot':
				if(special == "inline"){
					result += obj.coordinate.x+","+obj.coordinate.y;
				}else{
					result += current_group_name+"_led=";
					result += obj.coordinate.x+","+obj.coordinate.y;
				}
				return result;
		}
	};
	Exporter.prototype.export = function(){
		var result = "";
		//TODO: set this.configuration_keys
		for(var i = 0; i < this.data.sub_nodes.length; ++i){
			var subnode = this.data.sub_nodes[i];
			result += this.getExportString(subnode, "");
		}
		return result;
	};
	return Exporter;
});
