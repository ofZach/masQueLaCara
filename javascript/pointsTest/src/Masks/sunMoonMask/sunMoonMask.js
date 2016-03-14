'use strict';


class sunMoonMask extends MaskBase {

	//------------------------------------------
	setup() {
		super.addLayer();
		this.name = "sunMoonMask"
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
