define([], function(){
    var HighlightButton = function(data_proxy, messaging_system){
        var element = $('<button>').text('highlight');
        return element;
    };
    var AddDigitButton = function(data_proxy, messaging_system){
        var element = $('<button>').text('add digit');
        return element;
    };
    var LabelObjectDetailsView = function(target_view, data_proxy, messaging_system){
        this.target_view = target_view;
        this.data_proxy = data_proxy;
        this.messaging_system = messaging_system;
        this.element = $('<div>')
            .attr({
                'class':'div_label_details'
            });
        this.title_element = $('<span>')
            .attr({
                'class':'span_details_title'
            })
            .text('Label details');
        this.highlight_button = new HighlightButton(this.data_proxy, this.messaging_system);
        this.add_digit_button = new AddDigitButton(this.data_proxy, this.messaging_system);
        this.controls_element = $('<div>')
            .attr({
                'class':'span_details_controls'
            })
            .append(this.highlight_button)
            .append(this.add_digit_button);
        this.content_element = $('<div>').text(this.data_proxy.getTitle());
        this.element.append(this.title_element)
            .append(this.controls_element)
            .append(this.content_element);
        this.target_view.append(this.element);
        this.loadContent();
    };
    LabelObjectDetailsView.prototype.loadContent = function(){
        var subnodes = this.data_proxy.getSubNodes();
        this.content_element.empty();
        for(var i = 0; i < subnodes.length; ++i){
            var el = new DigitDetailsContentView(this.content_element, subnodes[i], this.messaging_system);
            this.content_element.content_elements.push(el);
        }
    };

    return LabelObjectDetailsView;
});
