/**
 * Created by fkint on 10/02/15.
 */
define([], function(){
	var LoadCombinedImagesEvent = function(files){
		this.files = files;
	};
	LoadCombinedImagesEvent.prototype.getFiles = function(){
		return this.files;
	};
	return LoadCombinedImagesEvent;
});