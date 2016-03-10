'use strict';

class peacockMask extends MaskBase {

	//------------------------------------------
	setup() {
		super.addLayer();
		this.name = "peacockMask";
		this.velocity = 0;
		this.angle = 0;
		this.eyeL = new lampSVG({
			path: 'assets/svg/PeacockMask/rootEyeL.svg',
			pivot: [0, 0],
			energy: 20,
			speed: 5,
			fadeForce: 19,
		});
		this.eyeR = new lampSVG({
			path: 'assets/svg/PeacockMask/rootEyeR.svg',
			pivot: [0, 0],
			energy: 20,
			speed: 5,
			fadeForce: 19,
		});
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
		var chin = data['faceParts']['chin'];

		this.velocity = calc.smooth(this.velocity, head.velocity.length, 0.9);
		this.angle = calc.smooth(this.angle, calc.deg(head.angle), 0.9);
		
		this.eyeL.update();
		this.eyeL.group.position = eyeL.position;
		this.eyeL.energy = this.velocity/2;
		
		this.eyeR.group.position = eyeR.position;
		this.eyeR.energy = this.velocity/2;
		// data contains face data, see dataPlayer.js, ie face parts data['faceParts']['eyeL']['position'] as well as face points, etc...
	}

	show() {
		this.showLayer();
	}

	hide() {
		this.hideLayer();
	}
}