// var maskBase = {
// 	show: function(){
// 		this.layer.visible = true;
// 		console.log("visible " + this.layer.visible);
// 	},
// 	hide: function(){
// 		this.layer.visible = false;
// 	    console.log("visible " + this.layer.visible);

// 	}
// };
function MaskBase() {
	
};
// MaskBase.prototype.visible = true;
MaskBase.prototype.addLayer = function() {
	this.layer = new paper.Layer();
};
MaskBase.prototype.show = function() {
	this.layer.visible = true;
};
MaskBase.prototype.hide = function() {
	this.layer.visible = false;
};