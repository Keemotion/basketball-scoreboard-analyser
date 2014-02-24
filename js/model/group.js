define(['data_base_class'], function(DataBaseClass){
	var Group = function(name, sub_nodes, parent){
		this.setParent(parent);
		this.setName(name);
		this.setSubNodes(sub_nodes);
	};
	Group.prototype = new DataBaseClass('group');
	
	return Group;
});