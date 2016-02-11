'use strict';
class MaskManager {
	setup() {
		this.masks = [
			new demoMask(),
			new crowMask(),
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