'use strict';

class intersectMask extends MaskBase {

	//------------------------------------------
	setup() {
		super.addLayer();
		this.name = "intersectMask";
	}

	//------------------------------------------
	update(data) {
		// data contains face data, see dataPlayer.js, ie face parts data['faceParts']['eyeL']['position'] as well as face points, etc...
	}

	show() {
		this.showLayer();
	}

	hide() {
		this.hideLayer();
	}
}