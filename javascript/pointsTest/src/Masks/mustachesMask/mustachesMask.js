'use strict';

class mustachesMask extends MaskBase {

	//------------------------------------------
	setup() {
		super.addLayer();
		this.name = "mustachesMask";
		this.velocity = 0;
		this.angle = 0;

		this.line1 = new paper.Path.Line({
			from: [0, 0],
			to: [0, 0],
			strokeColor: 'white',
			strokeWidth: 1,
		});
		this.eyeL = new lampSVG({
			path: 'assets/svg/mustachesMask/rooteyeL.svg',
			pivot: [0, 0],
			energy: 20,
			speed: 5,
			fadeForce: 19,
		});
		this.eyeR = new lampSVG({
			path: 'assets/svg/mustachesMask/rooteyeR.svg',
			pivot: [0, 0],
			energy: 20,
			speed: 5,
			fadeForce: 19,
		});
		this.brow = new lampSVG({
			path: 'assets/svg/mustachesMask/rootbrow.svg',
			pivot: [0, 0],
			energy: 20,
			speed: 5,
			fadeForce: 19,
		});
		this.nose = new lampSVG({
			path: 'assets/svg/mustachesMask/rootnose.svg',
			pivot: [0, 0],
			energy: 20,
			speed: 5,
			fadeForce: 19,
		});
	}
 	getPerpendicularPoint(start, stop, distance){
	    var M = start.add(stop).divide(2);
	    var p = start.subtract(stop);
	    var n = [-p.y, p.x];
	    var norm_length =  Math.sqrt((n[0] * n[0]) + (n[1] * n[1]));
	    n[0] /= norm_length;
	    n[1] /= norm_length;
	    return [M.x + (distance * n[0]), M.y + (distance * n[1])];
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

		var brow = this.getPerpendicularPoint(browL.position, browR.position, -20);

		this.eyeL.update();
		this.eyeL.group.position = eyeL.position;
		this.eyeL.energy = this.velocity/2;

		this.eyeR.update();
		this.eyeR.group.position = eyeR.position;
		this.eyeR.energy = this.velocity/2;

		this.brow.update();
		this.brow.group.position = brow;
		this.brow.energy = this.velocity/2;

		this.nose.update();
		this.nose.group.position = nose.position;
		this.nose.energy = this.velocity/2;

		this.line1.segments[0].point = nose.position;
		this.line1.segments[1].point = eyeL.position;

		// data contains face data, see dataPlayer.js, ie face parts data['faceParts']['eyeL']['position'] as well as face points, etc...
	}

	show() {
		this.showLayer();
	}

	hide() {
		this.hideLayer();
	}
}