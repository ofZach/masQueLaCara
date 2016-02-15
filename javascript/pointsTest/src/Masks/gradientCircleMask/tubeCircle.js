'use strict';
class shapeCircle {
	constructor(d) {
		this.path = new paper.Path.Circle({
			center: [0, 0],
			radius: d.radius,
			strokeWidth: d.stroke,
			strokeColor: {
				gradient: {
					stops: [d.startColor, d.endColor]
				},
				origin: [-d.radius, 0],
				destination: [d.radius, 0],
			}
		});
		this.path.strokeColor.gradient.stops[0].color.alpha = 0.2;
		this.path.strokeColor.gradient.stops[1].color.alpha = 0.9;
	}
};
class shapeType {
	constructor(d) {
		this.shapeType;
		if (d.shape == 'circle') {
			this.shapeType = new shapeCircle(d);
		} else if (d.shape == 'halfCircle') {
			this.shapeType = new shapeCircle(d);
			this.shapeType.path.removeSegment(0);
			this.shapeType.path.closed = false;
		}
	}
};
class energyCircle {
	constructor(d) {
		this.energy = d.energy;
		this.scaleFactor = d.scaleFactor;
		this.angleEnergy = 0; // vel
		this.rotation = 0;
		this.angleLastFrame = 0;
		this.counter = 0;
		var shape = new shapeType(d);
		this.group = new paper.Group(shape.shapeType.path);
		this.group.pivot = [0, 0];
		this.group.transformContent = false;
	}
	update(data, name) {
		this.counter++;
		// fade out the prev energy: 
		this.angleEnergy = this.angleEnergy * this.energy;
		// grab the current data
		var leftEyeAngleThisFrame = data['faceParts'][name]['angle'] * (180 / Math.PI);
		// subtract the prev from curr to get "velocty"
		var leftEyeDiff = leftEyeAngleThisFrame - this.angleLastFrame;
		// angles wrap over so check use the shortest distance:
		if (leftEyeDiff < -180) leftEyeDiff += 360;
		if (leftEyeDiff > 180) leftEyeDiff -= 360;
		// increase the energy by the difference
		this.angleEnergy += leftEyeDiff * this.scaleFactor;
		// store the last frame
		this.angleLastFrame = leftEyeAngleThisFrame;
		// rotate the eye
		this.rotation += this.angleEnergy;
		this.group.rotation = this.rotation;
	}
};
class tubeCircle {
	constructor(d) {
		this.counter = 0;
		this.randomNum = 100 * Math.random();
		this.group = new paper.Group();
		this.group.transformContent = false;
		this.circles = [];
		for (var i = 0; i < d.count; i++) {
			var circle = new energyCircle({
				radius: d.radius * i + d.innerRadius,
				stroke: d.radius,
				energy: this.random(0.999999, 0.9999999),
				scaleFactor: this.random(0.7, 1.4),
				startColor: '#9900ff',
				endColor: '#ea4a73',
				shape: 'circle',
			});
			this.circles.push(circle);
			this.group.addChild(circle.group);
		}
		this.group.pivot = [0, 0];
	}
	random(min, max) {
		return Math.random() * (max - min) + min;
	}
	smoothValue(valueOld, valueNew, smooth) {
		return valueOld * smooth + (1 - smooth) * valueNew;
	}
	update(data, name) {
		var d = data['faceParts'][name];
		for (var i = 0; i < this.circles.length; i++) {
			this.circles[i].update(data, name);
		}
		this.group.position = d.position;
	}
}