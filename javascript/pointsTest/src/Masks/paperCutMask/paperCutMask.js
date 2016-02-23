'use strict';

class paperCutMask extends MaskBase {

	//------------------------------------------
	setup() {
		super.addLayer();
		this.name = "paperCutMask";
		this.head = new loadSvg({
			path: 'assets/svg/CloudFace/head.svg',
			pivot: [0, 0],
		});
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