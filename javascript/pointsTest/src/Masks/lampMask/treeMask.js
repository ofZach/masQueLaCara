'use strict';
class treeMask extends MaskBase {
	//------------------------------------------
	setup() {
		super.addLayer();
		this.name = "treeMask";
		this.velocity = 0;
		this.angle = 0;
		this.circle = new paper.Path.Circle({
			center: [0,0],
			radius: 20,
			fillColor: 'magenta',
			transformContent: false,
		});
		this.line1 = new paper.Path.Line({
			from: [0, 0],
			to: [0,0],
			strokeColor: 'white',
			strokeWidth: 1,
		});
		this.line1Pos0 = new paper.Point(0, 0);
		this.line1Pos1 = new paper.Point(0, 0);
		this.line2Pos0 = new paper.Point(0, 0);
		this.line2Pos1 = new paper.Point(0, 0);
		this.line3Pos0 = new paper.Point(0, 0);
		this.line3Pos1 = new paper.Point(0, 0);
		this.line2 = this.line1.clone();
		this.line3 = this.line1.clone();

		this.mouth = new lampSVG({
			path: 'assets/svg/lampMask/rootTreeMouth.svg',
			pivot: [0, 0],
			energy: 20,
			speed: 5,
			fadeForce: 19,
		});
		this.eyeL = new lampSVG({
			path: 'assets/svg/lampMask/rootTreeEyeL.svg',
			pivot: [0, 0],
			energy: 20,
			speed: 5,
			fadeForce: 19,
		});
		this.eyeR = new lampSVG({
			path: 'assets/svg/lampMask/rootTreeEyeR.svg',
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

		this.mouth.update();
		this.mouth.group.position = mouth.position;
		this.mouth.energy = this.velocity/2;

		this.eyeL.update();
		this.eyeL.group.position = eyeL.position;
		this.eyeL.energy = this.velocity/2;

		this.eyeR.update();
		this.eyeR.group.position = eyeR.position;
		this.eyeR.energy = this.velocity/2;

		if(this.mouth.group.children[0] != undefined){
			var pos = this.mouth.group
			.children['rootTreeMouth']
			.children['nose']
			.children['noseCir'];
			this.line1Pos0 = pos.localToGlobal();

			var pos = this.mouth.group
			.children['rootTreeMouth']
			.children['chin']
			.children['chinL']
			.children['circle']
			;
			this.line2Pos0 = pos.localToGlobal();

			// doesn't work -----------------------
			var pos = this.mouth.group
			.children['rootTreeMouth']
			.children['Layer_35']
			.children[0]
			;
			// console.log("pos = " + pos);
			// ------------------------------------
			this.line2Pos1 = pos.localToGlobal();
		}

		if(this.eyeL.group.children[0] != undefined){
			var pos = this.eyeL.group
			.children['rootTreeEyeL']
			.children['browRoot']
			.children['browR']
			.children['browRCir']
			;
			this.line1Pos1 = pos.localToGlobal();
			
			// doesn't work -----------------------
			var pos = this.eyeL.group
			.children['rootTreeEyeL']
			.children['browRoot']
			.children['browL']
			.children['browDown']
			.children['browDownSmall']
			.children['cirBottom']
			;
			// this.line2Pos1 = pos.localToGlobal();
			// ------------------------------------
		}

		if(this.eyeR.group.children[0] != undefined){
			var pos = this.eyeR.group
			.children['rootTreeEyeR']
			.children['Layer_45']
			.children['Layer_46']
			.children['square']
			;
			this.line3Pos1 = pos.localToGlobal();
		}
		this.line1.segments[0].point = this.line1Pos0;
		this.line1.segments[1].point = this.line1Pos1;

		this.line3.segments[0].point = this.line1Pos0;
		this.line3.segments[1].point = this.line3Pos1;

		this.line2.segments[0].point = this.line2Pos0;
		this.line2.segments[1].point = data['points'][2];

	}

	show() {
		this.showLayer();
	}

	hide() {
		this.hideLayer();
	}
}