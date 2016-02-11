'use strict';
class crowMask extends MaskBase {

	setup() {
		this.name = 'crowMask';
		super.addLayer();
		this.faceParts = {
			'eyeL': new SvgLoader(),
		};
		this.faceParts['eyeL'].setup('eyeL', this.name, 'assets/svg/Crow/eyeL.svg');
	}

	update(data) {
		this.faceParts['eyeL'].setPosition(data['faceParts']['eyeL']['position']);
	}
}