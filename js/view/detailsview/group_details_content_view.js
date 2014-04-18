define([],function(){
	//Gives a short overview of the group. This view is used when the group is shown as a subgroup of another group.
	// (inside the GroupDetailsView)
	var GroupDetailsContentView = function(target_view, data_proxy, messaging_system){
		this.messaging_system = messaging_system;
		this.target_view = target_view;
		this.data_proxy = data_proxy;
		this.content_element = $('<div>');
		this.target_view.append(this.content_element);
		this.loadContent();
	};
	GroupDetailsContentView.prototype.loadContent = function(){
		this.content_element.empty();
		this.content_element.text('group details: '+this.data_proxy.getTitle());
	};
	GroupDetailsContentView.prototype.cleanUp = function(){
		
	};
	return GroupDetailsContentView;
});
