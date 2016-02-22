'use strict';
class jellyBean {
	constructor(d) {
		this.group = new paper.Group();
		this.seed = calc.random(100, 3000);
		this.speed = d.speed;
		this.scale = d.scale;
		this.noiseRange = d.noiseRange;
		this.group.transformContent = false;
		this.shape = new paper.Path.Circle({
			center: [0, 0],
			radius: d.radius,
			fillColor: d.color,
		});
		this.shape.scaling = this.scale;
		this.shape.flatten(d.step);
		this.points = [];
		for (var i = 0; i < this.shape.segments.length; i++) {
			var point = new paper.Point(this.shape.segments[i].point.x, this.shape.segments[i].point.y)
			this.points.push(point);
		}
		// this.shape.fullySelected = true;
		this.group.addChild(this.shape);
		this.group.blendMode = d.mode;
		this.group.pivot = [d.offset[0], d.offset[1]];
		this.left;
		this.right;
		this.top;
		this.bottom;
		this.randNum = [0.1, 0.4, 0.9, 0.3];
		this.counter = 0;
	}
	smooth(valueOld, valueNew, smooth) {
		return valueOld.multiply(smooth).add(valueNew.multiply(1 - smooth));
	}
	update(data) {
		for (var i = 0; i < this.shape.segments.length; i++) {
			var nsY = noise.simplex2(0.0, (this.counter + this.seed * i) / this.speed);
			var nsX = noise.simplex2(0.0, (this.counter + (this.seed + 10000) * i) / this.speed);
			var x = nsX * this.noiseRange * this.scale[0];
			var y = nsY * this.noiseRange * this.scale[1];
			var pos = [x, y];
			this.shape.segments[i].point = this.points[i].add(pos);
		}

		this.shape.smooth({
			type: 'continuous'
		});
		this.group.position = data.position;
		// this.shape.scaling = this.scale;
		this.counter++;
	}
}

class jellyBeanMask extends MaskBase {
	//------------------------------------------
	setup() {
		super.addLayer();
		this.name = "jellyBeanMask"
		this.rand = calc.random(0, 1);
		this.head = new jellyBean({
			radius: 300,
			speed: 180,
			color: '#a96f99',
			scale: [1, 0.6],
			step: 100,
			offset: [0, 200],
			noiseRange: 10,
			mode: 'normal',
		});
		this.head2 = new jellyBean({
			radius: 100,
			speed: 80,
			color: '#ffc541',
			scale: [1, 0.6],
			step: 50,
			offset: [-200, 300],
			noiseRange: 20,
			mode: 'multiply',
		});
		this.eyeL = new jellyBean({
			radius: 50,
			speed: 80,
			color: 'black',
			scale: [0.13, 0.2],
			step: 10,
			offset: [0, 0],
			noiseRange: 2,
			mode: 'normal',
		});
		this.eyeR = new jellyBean({
			radius: 40,
			speed: 80,
			color: 'black',
			scale: [0.3, 0.2],
			step: 10,
			offset: [100, 0],
			noiseRange: 3,
			mode: 'normal',
		});

		this.angle = 0;
	}
	smooth(valueOld, valueNew, smooth) {
		return valueOld * smooth + (1 - smooth) * valueNew;
	}
	//------------------------------------------
	update(data) {
		var head = data['faceParts']['head'];
		var nose = data['faceParts']['nose'];
		var eyeL = data['faceParts']['eyeL'];
		var eyeR = data['faceParts']['eyeR'];
		var mouth = data['faceParts']['mouth'];
		var cheekL = data['faceParts']['cheekL'];
		this.angle = this.smooth(this.angle, head.angle, 0.95);
		this.head.update(head);
		this.head.noiseRange = this.angle * 300 + 30;
		this.head2.update(head);
		this.head2.noiseRange = this.angle * 100 + 20;
		this.eyeL.update(eyeL);
		this.eyeR.update(eyeR);
		// data contains face data, see dataPlayer.js, ie face parts data['faceParts']['eyeL']['position'] as well as face points, etc...
	}

	show() {
		this.showLayer();
	}

	hide() {
		this.hideLayer();
	}
}