'use strict';
class MaskBase {
	setup() {
		this.name = "";
	}
	addLayer() {
		this.layer = new paper.Layer();
		this.layer.visible = false;
	}
	showLayer() {
		this.layer.visible = true;
	}
	hideLayer() {
		this.layer.visible = false;
	}
}