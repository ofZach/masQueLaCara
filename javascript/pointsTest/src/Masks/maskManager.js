'use strict';
class MaskManager {
	setup() {
		this.masks = [
			new emptyMask(),
			new attractFacePointMask(),
			new demoMask(),
			new crowMask(),
			new bounceMask(),
			new gradientMask(),
			new flowerMask(),
			new blobGradientMask(),
			new pyrateMask(),
			new lineDisplaceMask(),
			/*new rotationMask(),  demo for showing how rotation energy might work to move shapes */
			new gradientCircleMask(),
			new clipingMask(),
			new circleFaceMask(),
			new flowerMask(),
			new tentacleMask(),
			new flowerShapeMask(),
			new candleMask(),
			new jellyBeanMask(),
			new squareMask(),
		];
		this.curMaskNum = 0;
		for (var i = 0; i < this.masks.length; i++) {
			this.masks[i].setup();
		}
		this.names = [];
		for (var i = 0; i < this.masks.length; i++) {
			this.names.push(this.masks[i].name);
		}

		this.masks[0].show();
		//console.log(this.names);
	}

	update(data) {
		this.masks[this.curMaskNum].update(data);
	}

	setMaskByName(name) {

		this.hideMask();
		var index = this.names.indexOf(name);

		if (index >= 0) {
			this.curMaskNum = index;
		}
		this.showMask();
	};

	// guis will come back..
	// returnGuiJson() {
	// 	return this.masks[this.curMaskNum].returnGuiJson();
	// }

	hideMask() {
		this.masks[this.curMaskNum].hide();
	}

	showMask(settings) {
		this.masks[this.curMaskNum].show();
	}

};