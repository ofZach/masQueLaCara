'use strict';
class MaskManager {
	setup() {
		this.masks = [
			new emptyMask(),
			/*new attractFacePointMask(),
			new demoMask(),*/
			new crowMask(),
			new bounceMask(),
			new gradientMask(),
			new flowerMask(),
			new blobGradientMask(),
			new pyrateMask(),
			new lineDisplaceMask(),
			new circleOverlayMask(),
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
			new squareMask2(),
			new squareMask3(),
			new squareMask4(),
			new squareMask5(),
			new stripeyMask(),
			new stripeyMask2(),
			new circleClipMask(),
			new cthulhuMask(),
			new blobGradientMask2(),
			new paperCutMask(),
			new cloudMask(),
			new pebblesMask(),
			new divideMask(),
			// new cloudFacePivot(),
			// new intersectMask(),
			new forestMask(),
			new blockMask(),
			new arcMask(),
			new arcMask2(),
			new arcMask3(),
			new wormMask(),
			new lampMask(),
			new treeMask(),
			new peacockMask(),
			new mustachesMask(),
			new crossLinesMask(),
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