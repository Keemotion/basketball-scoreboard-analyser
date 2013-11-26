define(["../../model/coordinate"], function(Coordinate){
	var CornerDetailsContentView = function(target_view, data_proxy, messaging_system){
		this.target_view = target_view;
		this.data_proxy = data_proxy;
		this.messaging_system = messaging_system;
		this.x_text = $('<input>')
			.val('x');
		this.y_text = $('<input>')
			.val('y');
		this.x_label = $('<label>').text('X');
		this.y_label = $('<label>').text('Y');
		this.content_element = $('<div>')
			.append(this.x_label)
			.append(this.x_text)
			.append(this.y_label)
			.append(this.y_text);
		this.target_view.append(this.content_element);
		this.loadContent();
	};
	CornerDetailsContentView.prototype.loadContent = function(){
		this.x_text.val(this.data_proxy.getX());
		this.y_text.val(this.data_proxy.getY());
	};
	CornerDetailsContentView.prototype.collectFormData = function(){
		var d = new Object();
		d.id = this.data_proxy.getId();
		d.name = this.data_proxy.getTitle();
		d.coordinate = new Coordinate(this.x_text.val(), this.y_text.val());
		return d;
	};
	return CornerDetailsContentView;
});
