'use strict';

class pebblesMask extends MaskBase {

	//------------------------------------------
	setup() {
		super.addLayer();
		this.name = "pebblesMask";
		// this.head = new loadSvg({
		// 	path: 'assets/svg/CloudFace/head.svg',
		// 	pivot: [0, 0],
		// });
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