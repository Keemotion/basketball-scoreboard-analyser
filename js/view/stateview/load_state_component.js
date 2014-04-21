define(['../../messaging_system/events/load_state_event'],function(LoadStateEvent){
	//Provides the GUI to import data 
	var LoadStateComponent = function(view_target, messaging_system){
		var self = this;
		this.messaging_system = messaging_system;
		this.containerElement = view_target;
		var text_area = this.textArea = $('<textarea>')
            .attr({
                'class':'txt_state'
            });
        var btn_div = $('<div>')
            .attr({
                'class':'div_state_buttons'
            });
		//loading JSON from the text area
		this.btnApply = $('<button>')
			.text('apply')
			.click(function(){
				var t = text_area.val();
				messaging_system.fire(messaging_system.events.LoadState, new LoadStateEvent(t));
			});
        btn_div.append(this.btnApply);
		//loading PRM from a file
        this.file_btn = $('<input>').attr('type', 'file')
        	.change(function(){self.fileChanged();})
        	.attr('id', 'btnLoadFile');
        this.img_btn = $('<input>').attr('type', 'file')
        	.change(function(){self.imageChanged();})
        	.attr('id', 'btnLoadImage');
        var file_div = $('<div>').append($('<span>').html('File:')).append(this.file_btn).append($('<span>').html('<br>Image: ')).append(this.img_btn);
		this.containerElement/*.append(this.textArea)*/
			/*.append(btn_div)*/
			.append(file_div);
		
		this.reset_view_btn = $('<button>').text('Reset Canvas View').click(function(){
			self.messaging_system.fire(self.messaging_system.events.ResetCanvasView, null);
		});
		this.containerElement.append(this.reset_view_btn);
	};
	LoadStateComponent.prototype.fileChanged = function(evt){
		var self = this;
		var files = $('#btnLoadFile')[0].files;
		var f = files[0];
		var reader = new FileReader();
		reader.onload = function(e){
			self.messaging_system.fire(self.messaging_system.events.LoadStateFile, new LoadStateEvent(e.target.result));
		};
		reader.readAsText(f);
	};
	LoadStateComponent.prototype.imageChanged = function(evt){
		var self = this;
		var files = $('#btnLoadImage')[0].files;
		var f = files[0];
		var reader = new FileReader();
		reader.onload = function(e){
			self.messaging_system.fire(self.messaging_system.events.LoadImage, reader.result);
		};
		reader.readAsDataURL(f);
	};
	return LoadStateComponent;
});
