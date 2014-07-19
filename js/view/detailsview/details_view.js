define(["../../messaging_system/event_listener",
	"./group_detailsview",
	"./dot_details_content_view",
	"./digit_details_content_view",
	"./corner_details_content_view",
	"./configuration_key_details_view"],
	function(
		EventListener,
		GroupDetailsView,
		DotDetailsContentView,
		DigitDetailsContentView,
		CornerDetailsContentView,
		ConfigurationKeyDetailsView){
	var DetailsView = function(view, dom_element, messaging_system){
		this.view = view;
		this.messaging_system = messaging_system;
		this.element = dom_element;
		this.details_view_element = null;
		this.messaging_system.addEventListener(this.messaging_system.events.SelectionChanged, new EventListener(this, this.selectionChanged));
	};
	DetailsView.prototype.selectionChanged = function(signal, data){
		var tree = data.getTree();
		var selected_proxies = tree.getSelectedFlat();
		this.clearView();
		if(selected_proxies.length == 1){
			var selected_proxy = selected_proxies[0];
			switch(selected_proxy.getType()){
				case "group":
					this.details_view_element = new GroupDetailsView(this.element, selected_proxy, this.messaging_system);
					break;
				case "dot":
					this.details_view_element = new DotDetailsContentView(this.element, selected_proxy, this.messaging_system);
					break;
				case "digit":
					this.details_view_element = new DigitDetailsContentView(this.element, selected_proxy, this.messaging_system);
					break;
				case "corner":
					this.details_view_element = new CornerDetailsContentView(this.element, selected_proxy, this.messaging_system);
					break;
				case "configuration_key":
					this.details_view_element = new ConfigurationKeyDetailsView(this.element, selected_proxy, this.messaging_system);
					break;
			}
		}else if(selected_proxies.length == 0){
			this.element.text("nothing selected");
		}else{
			this.element.text("multiple elements selected");
		}
	};
	DetailsView.prototype.clearView = function(){
		if(this.details_view_element){
			this.details_view_element.cleanUp();
			this.details_view_element = null;
		}
		this.element.empty();
	};
	return DetailsView;
});
