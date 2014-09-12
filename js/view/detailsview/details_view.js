define(["../../messaging_system/event_listener",
	"./group_detailsview",
	"./dot_details_content_view",
	"./digit_details_content_view",
	"./corner_details_content_view",
	"./configuration_key_details_view",
	"./configuration_details_overview"],
	function(
		EventListener,
		GroupDetailsView,
		DotDetailsContentView,
		DigitDetailsContentView,
		CornerDetailsContentView,
		ConfigurationKeyDetailsView,
		ConfigurationDetailsOverview){
	var HierarchyView = function(dom_element, messaging_system){
		this.element = dom_element;
		this.messaging_system = messaging_system;
		this.groupChangedEventListener = new EventListener(this, this.groupChanged);
		this.messaging_system.addEventListener(this.messaging_system.events.GroupChanged, this.groupChangedEventListener);
	};
	HierarchyView.prototype.setProxy = function(proxy){
		this.data_proxy = proxy;
		this.update();
	};
	HierarchyView.prototype.groupChanged = function(signal, data){
		this.update();
	};
	HierarchyView.prototype.getProxy = function(){
		return this.data_proxy;
	};
	HierarchyView.prototype.cleanUp = function(){
		this.messaging_system.removeEventListener(this.messaging_system.events.GroupChanged, this.groupChangedEventListener);
	}
	HierarchyView.prototype.update = function(){
		this.element.empty();
		if(this.getProxy()){
			var identification = this.getProxy().getIdentification();
			var text = "";
			for(var i = 0; i < identification.length; ++i){
				if(i == 0)
					continue;
				if(i > 1){
					text += " &gt; ";
				}
				//console.log(JSON.stringify(identification));
				//text += identification[i].type+" #"+identification[i].id;
				text += identification[i].title;
			}
			this.element.html(text);
		}
	};
	var DetailsView = function(view, dom_element, messaging_system){
		this.view = view;
		this.messaging_system = messaging_system;
		this.element = dom_element;
		this.element.empty();
		this.content_element = $('<div>');
		this.configuration_overview_element = $('<div>');
		this.configuration_details_overview = null;
		this.hierarchy_element = $('<div>');
		this.hierarchy_view = new HierarchyView(this.hierarchy_element, this.messaging_system);
		this.element.append(this.hierarchy_element);
		this.element.append($('<br>'));
		this.element.append(this.configuration_overview_element);
		this.element.append(this.content_element);
		this.details_view_element = null;
		this.messaging_system.addEventListener(this.messaging_system.events.SelectionChanged, new EventListener(this, this.selectionChanged));
	};
	DetailsView.prototype.selectionChanged = function(signal, data){
		var tree = data.getTree();
		var selected_proxies = tree.getSelectedFlat();
		this.clearView();
		if(selected_proxies.length == 1){
			var selected_proxy = selected_proxies[0];
			if(!data.getTemporary()){
				this.configuration_details_overview = new ConfigurationDetailsOverview(selected_proxy, this.configuration_overview_element);
			}
			this.hierarchy_view.setProxy(selected_proxy);
			switch(selected_proxy.getType()){
				case "group":
					this.details_view_element = new GroupDetailsView(this.content_element, selected_proxy, this.messaging_system);
					break;
				case "dot":
					this.details_view_element = new DotDetailsContentView(this.content_element, selected_proxy, this.messaging_system);
					break;
				case "digit":
					this.details_view_element = new DigitDetailsContentView(this.content_element, selected_proxy, this.messaging_system);
					break;
				case "corner":
					this.details_view_element = new CornerDetailsContentView(this.content_element, selected_proxy, this.messaging_system);
					break;
				case "configuration_key":
					this.details_view_element = new ConfigurationKeyDetailsView(this.content_element, selected_proxy, this.messaging_system);
					break;
			}
		}else if(selected_proxies.length == 0){
			this.content_element.text("nothing selected");
		}else{
			this.content_element.text("multiple elements selected");
		}
	};
	DetailsView.prototype.clearView = function(){
		if(this.details_view_element){
			this.details_view_element.cleanUp();
			this.details_view_element = null;
		}
		if(this.configuration_details_overview){
			this.configuration_details_overview.cleanUp();
			this.configuration_details_overview = null;
		}
		this.content_element.empty();
		this.configuration_overview_element.empty();
	};
	return DetailsView;
});
