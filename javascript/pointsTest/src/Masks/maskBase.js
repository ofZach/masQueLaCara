'use strict';
class MaskBase {
	setup() {
		this.name = "";
	}
	addLayer() {
		this.layer = new paper.Layer();
		this.layer.visible = false;
	}
	show() {
		this.layer.visible = true;
	}
	hide() {
		this.layer.visible = false;
	}
}