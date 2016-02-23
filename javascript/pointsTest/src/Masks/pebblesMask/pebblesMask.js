'use strict';

class pebblesMask extends MaskBase {

	//------------------------------------------
	setup() {
		super.addLayer();
		this.name = "pebblesMask";
		this.eyeL = new loadSvgPivot({
			path: 'assets/svg/PebblesMask/rootEyeL.svg',
			pivot: [0, 0],
			energy: 20,
			speed: 5,
			fadeForce: 1,
		});
		this.eyeR = new loadSvgPivot({
			path: 'assets/svg/PebblesMask/rootEyeR.svg',
			pivot: [0, 0],
			energy: 20,
			speed: 7,
			fadeForce: 1,
		});
		this.velocity = 0;
	}

	//------------------------------------------
	update(data) {
		var head = data['faceParts']['head'];
		var nose = data['faceParts']['nose'];
		var eyeL = data['faceParts']['eyeL'];
		var eyeR = data['faceParts']['eyeR'];
		var earR = data['faceParts']['earR'];
		var earL = data['faceParts']['earL'];
		var mouth = data['faceParts']['mouth'];
		var cheekL = data['faceParts']['cheekL'];
		var cheekR = data['faceParts']['cheekR'];
		var browL = data['faceParts']['browL'];
		var browR = data['faceParts']['browR'];
		var lipUpper = data['faceParts']['lipUpper'];
		var lipLower = data['faceParts']['lipLower'];

		this.velocity = calc.smooth(this.velocity, head.velocity.length, 0.99);

		this.eyeL.update();
		this.eyeL.group.position = eyeL.position.add([30, 0]);
		this.eyeL.energy = this.velocity*10;

		this.eyeR.update();
		this.eyeR.group.position = eyeR.position.add([-30, 0]);
		this.eyeR.energy = this.velocity*7;
	}

	show() {
		this.showLayer();
	}

	hide() {
		this.hideLayer();
	}
}