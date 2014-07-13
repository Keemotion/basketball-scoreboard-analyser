define(["../../messaging_system/event_listener"],
	function(EventListener){
	var DetailsView = function(view, dom_element, messaging_system){
		this.view = view;
		this.messaging_system = messaging_system;
		this.element = dom_element;
		this.messaging_system.addEventListener(this.messaging_system.events.SelectionChanged, new EventListener(this, this.selectionChanged));
	};
	DetailsView.prototype.selectionChanged = function(signal, data){
		var tree = data.getTree();
		var selected_proxies = tree.getSelectedFlat();
		console.log("selected #"+selected_proxies.length);
		if(selected_proxies.length == 1){
			var selected_proxy = selected_proxies[0];
			switch(selected_proxy.getType()){
				case "group":
					this.element.text("group");
					break;
				case "dot":
					this.element.text("dot");
					break;
				case "digit":
					this.element.text("digit");
					break;
				case "corner":
					this.element.text("corner");
					break;
			}
		}else if(selected_proxies.length == 0){
			this.element.text("nothing selected");
		}else{
			this.element.text("multiple elements selected");
		}
	};
	return DetailsView;
});
