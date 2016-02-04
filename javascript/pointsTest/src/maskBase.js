function MaskBase() {
	
};

MaskBase.prototype.addLayer = function() {
	this.layer = new paper.Layer();
};
MaskBase.prototype.show = function() {
	this.layer.visible = true;
};
MaskBase.prototype.hide = function() {
	this.layer.visible = false;
};