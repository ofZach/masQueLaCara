'use strict';
class stripes2{
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
				transformContent: false,
			});
			this.group.addChild(line);
		}
		this.group.pivot = [0, this.group.bounds.height/2];
		this.counter = 0;
	}
	update(d){
		for (var i = 0; i < this.group.children.length; i++) {
			var p = this.group.children[i];
			p.position.x = Math.cos(this.counter/this.speed+i*this.freq)*this.range;
			p.rotation = Math.atan((this.counter)/this.speed+this.freq)*this.range*i*0.5;
			// p.scale.y = Math.cos(this.counter/this.speed+i*this.freq)*this.range;
			// console.log("p.rotation = " + p.rotation);
		}
		this.counter++;
	}
}

class stripeyMask2 extends MaskBase {
	//------------------------------------------
	setup() {
		super.addLayer();
		this.name = "stripeyMask2";
		this.eyeL = new stripes2({
			length: 100,
			distance: 5,
			count: 20,
			speed: 20,
			freq: 3,
			range: 100,
		});
		this.eyeR = new stripes2({
			length: 100,
			distance: 5,
			count: 20,
			speed: 20,
			freq: 7,
			range: 100,
		});
		this.browL = new stripes2({
			length: 20,
			distance: 7,
			count: 20,
			speed: 20,
			freq: 3,
			range: 100,
		});
		this.browR = new stripes2({
			length: 20,
			distance: 7,
			count: 20,
			speed: 20,
			freq: 2,
			range: 100,
		});
		this.mouth = new stripes2({
			length: 20,
			distance: 4,
			count: 30,
			speed: 20,
			freq: 4,
			range: 100,
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
		this.angle = this.smooth(this.angle, head.angle, 0.9);
		this.velocity = this.smooth(this.velocity, head.velocity.length, 0.9);

		this.eyeL.update();
		this.eyeL.group.position = eyeL.position;
		this.eyeL.group.rotation = this.deg(this.angle);
		this.eyeL.range = this.angle*200;
		
		this.eyeR.update();
		this.eyeR.group.position = eyeR.position;
		this.eyeR.group.rotation = this.deg(this.angle)+90;
		this.eyeR.range = this.angle*100;

		this.browL.update();
		this.browL.group.position = browL.position.add([0, -20]);
		this.browL.group.rotation = this.deg(this.angle)+90;
		this.browL.range = this.angle*200;

		this.browR.update();
		this.browR.group.position = browR.position.add([0, -20]);
		this.browR.group.rotation = this.deg(this.angle)+90;
		this.browR.range = this.angle*150;

		this.mouth.update();
		this.mouth.group.position = mouth.position.add([0, -20]);
		this.mouth.group.rotation = this.deg(this.angle)+90;
		this.mouth.range = this.angle*300;
	}

	show() {
		this.showLayer();
	}

	hide() {
		this.hideLayer();
	}
}