define(["./corner_details_content_view"],function(CornerDetailsContentView){
	var DigitDetailsContentView = function(target_view, data_proxy, messaging_system){
		this.messaging_system = messaging_system;
		this.target_view = target_view;
		this.content_elements = new Array();
		this.data_proxy = data_proxy;
		this.content_element= $('<div>')
			.append($('<span>').text('test'));
		this.title_span = $('<span>')
			.text('');
		this.target_view
			.append(this.content_element);
		this.loadContent();
	};
	DigitDetailsContentView.prototype.loadContent = function(){
		var subnodes = this.data_proxy.getSubNodes();
		this.content_elements.length = 0;
		this.content_element.empty();
		this.title_span.text(this.data_proxy.getTitle());
		this.content_element.append(this.title_span);
		for(var i = 0; i < 4; ++i){
			var el = new CornerDetailsContentView(this.content_element, subnodes[i], this.messaging_system);
			this.content_elements.push(el);
		}
	};
	DigitDetailsContentView.prototype.collectFormData = function(){
		var d = new Object();
		d.id = this.data_proxy.getId();
		d.name = this.data_proxy.getTitle();
		d.corners = new Array();
		for(var i = 0; i < this.content_elements.length; ++i){
			d.corners.push(this.content_elements[i].collectFormData());
		}
		return d;
	};
	return DigitDetailsContentView;
});
