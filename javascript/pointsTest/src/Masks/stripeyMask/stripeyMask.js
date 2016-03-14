'use strict';
class stripes{
	constructor(d){
		this.length = d.length;
		this.distance = d.distance;
		this.count = d.count;
		this.speed = d.speed;
		this.freq = d.freq;
		this.range = d.range;
		this.group = new paper.Group({
			transformContent: false,
		});
		for (var i = 0; i < this.count; i++) {
			var line = new paper.Path.Line({
				from: [0, d.distance*i], 
				to: [this.length, d.distance*i],
				strokeWidth: 2,
				strokeColor: 'white',
			});
			

			this.group.addChild(line);
		}
		this.counter = 0;
	}
	update(d){
		for (var i = 0; i < this.group.children.length; i++) {
			var p = this.group.children[i];
			p.position.x = Math.cos(this.counter/this.speed+i*this.freq)*this.range;
		}
		this.counter++;
	}
}

class stripeyMask extends MaskBase {

	//------------------------------------------
	setup() {
		super.addLayer();
		this.name = "stripeyMask"
		this.line = new paper.Path.Line({
				from: [0, 0], 
				to: [0, 300],
				strokeWidth: 2,
				strokeColor: 'white',
			});
		this.linesHead = new stripes({
			length: 100,
			distance: 10,
			count: 50,
			speed: 20,
			freq: 3,
			range: 100,
		});
		this.linesEyeL = new stripes({
			length: 100,
			distance: 50,
			count: 3,
			speed: 20,
			freq: 3,
			range: 100,
		});
		this.linesEyeR = new stripes({
			length: 120,
			distance: 10,
			count: 20,
			speed: 20,
			freq: 3,
			range: 100,
		});
		this.linesEarL = new stripes({
			length: 400,
			distance: 10,
			count: 10,
			speed: 20,
			freq: 3,
			range: 10,
		});
		this.linesEarR = new stripes({
			length: 400,
			distance: 20,
			count: 10,
			speed: 20,
			freq: 3,
			range: 10,
		});
		this.linesNose = new stripes({
			length: 400,
			distance: 10,
			count: 50,
			speed: 20,
			freq: 3,
			range: 10,
		});
		this.linesMouth = new stripes({
			length: 100,
			distance: 10,
			count: 3,
			speed: 20,
			freq: 3,
			range: 10,
		});
		this.headGroup = new paper.Group({
			children: [this.linesHead.group],
			transformContent: false,
			pivot: [0, this.linesHead.group.bounds.height/2],
		});
		this.earLGroup = new paper.Group({
			children: [this.linesEarL.group],
			transformContent: false,
			pivot: [0, this.linesEarL.group.bounds.height/2],
		});
		this.earRGroup = new paper.Group({
			children: [this.linesEarR.group],
			transformContent: false,
			pivot: [0, this.linesEarR.group.bounds.height/2],
		});
		this.noseGroup = new paper.Group({
			children: [this.linesNose.group],
			transformContent: false,
			pivot: [0, this.linesNose.group.bounds.height/2],
		});
		this.mouthGroup = new paper.Group({
			children: [this.linesMouth.group],
			transformContent: false,
			pivot: [0, this.linesMouth.group.bounds.height/2],
		});
		this.angle = 0;
		this.velocity = 0;
	}
	smooth(valueOld, valueNew, smooth) {
		return valueOld * smooth + (1 - smooth) * valueNew;
	}
	rad(degrees) {
		return degrees * Math.PI / 180;
	}
	deg(rad){
		return rad * 180 / Math.PI ;
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

		this.angle = this.smooth(this.angle, head.angle, 0.7);
		this.velocity = this.smooth(this.velocity, head.velocity.length, 0.9);

		var angle = this.angle;
		var velocity = this.velocity;
		
		this.headGroup.position = head.position.add([0, -220]);
		this.headGroup.rotation = this.deg(angle)+90;

		this.earLGroup.position = earL.position;
		this.earLGroup.rotation = this.deg(angle)+90;

		this.earRGroup.position = earR.position;
		this.earRGroup.rotation = this.deg(angle)+90;

		this.noseGroup.position = head.position;

		this.mouthGroup.position = mouth.position;
		this.mouthGroup.rotation = this.deg(angle);

		this.linesEyeL.group.position = eyeL.position;
		this.linesEyeL.group.rotation = this.deg(angle);
		this.linesEyeR.group.position = eyeR.position;
		this.linesEyeR.group.rotation = this.deg(angle);

		this.line.position =  nose.position.add([0, -120]);
		this.mouthGroup.rotation = this.deg(angle);

		this.linesHead.update();
		this.linesEarL.update();
		this.linesEarR.update();
		this.linesNose.update();
		this.linesMouth.update();

		this.linesHead.range = angle*200;
		this.linesEarL.range = angle*200;
		this.linesNose.range = angle*500;
		this.linesMouth.range = angle*200;
	}

	show() {
		this.showLayer();
	}

	hide() {
		this.hideLayer();
	}
}