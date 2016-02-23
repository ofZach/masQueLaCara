'use strict';

class divideMask extends MaskBase {

	//------------------------------------------
	setup() {
		super.addLayer();
		this.name = "divideMask";
		var strokeWidth = 2;
		this.brow = new paper.Path({
			strokeWidth: strokeWidth,
			strokeColor: 'white',
		});
		this.brow.add([0, 0]);
		this.brow.add([0, 0]);
		this.brow.add([0, 0]);
		this.nose = new paper.Path({
			strokeWidth: strokeWidth,
			strokeColor: 'white',
		});
		this.nose.add([0, 0]);
		this.nose.add([0, 0]);
		this.nose2 = this.nose.clone();
		this.mouth = this.nose.clone();
		this.eyeLine = this.nose.clone();
		this.circle = new paper.Path.Circle({
			center: [0, 0],
			radius: 7,
			fillColor: 'white',
		});
		this.circleBig = new paper.Path.Circle({
			center: [0, 0],
			radius: 13,
			fillColor: 'white',
		});
		this.circleBlack = new paper.Path.Circle({
			center: [0, 0],
			radius: 10,
			fillColor: 'black',
		});
		this.circleBig2 = this.circleBig.clone();
		this.circleBig3 = this.circleBig.clone();
		this.circle2 = this.circle.clone();
		this.circle3 = this.circle.clone();
		this.velocity = 0;


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
		var browL = data['faceParts']['browL'];
		var browR = data['faceParts']['browR'];
		var lipUpper = data['faceParts']['lipUpper'];
		var lipLower = data['faceParts']['lipLower'];

		this.velocity = calc.smooth(this.velocity, head.velocity.length, 0.9);

		var brow1 = data['points'][0]; // brow left
		var brow2 = this.getPerpendicularPoint(browL.position, browR.position, 50);
		var brow3 = data['points'][16]; // brow right
		
		var nose1 = this.getPerpendicularPoint(browL.position, browR.position, 100);
		var nose2 = data['points'][8];

		this.brow.segments[0].point = brow1;
		this.brow.segments[1].point = brow2;
		this.brow.segments[2].point = brow3;

		// this.circle.position = this.brow.getPointAt(300);
		
		this.nose.segments[0].point = nose1;
		this.nose.segments[1].point = nose2;

		this.nose2.segments[0].point = data['points'][31];
		this.nose2.segments[1].point = data['points'][35];

		this.mouth.segments[0].point = data['points'][48];
		this.mouth.segments[1].point = data['points'][54];

		this.eyeLine.segments[0].point = eyeL.position;
		this.eyeLine.segments[1].point = eyeR.position;
		this.circleBig.position = eyeL.position;
		this.circleBig2.position = eyeR.position;

		this.circle3.position = this.nose.getIntersections(this.nose2)[0].point;
		this.circleBig3.position = this.nose.getIntersections(this.mouth)[0].point;
		this.circleBlack.position = this.circleBig3.position;
		// data contains face data, see dataPlayer.js, ie face parts data['faceParts']['eyeL']['position'] as well as face points, etc...
	}

	show() {
		this.showLayer();
	}

	hide() {
		this.hideLayer();
	}
}