'use strict';
class tubeCircle{
	constructor(d){
		this.counter = 0;
		this.randomNum = 100 * Math.random();
		this.group = new paper.Group();
		this.group.transformContent = false;
		this.circles = [];
		for (var i = 0; i < d.count; i++) {
			var shapeType = 'polygon'
			if(i%2 == 0) shapeType = 'circle';
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
		this.groupOffset = [0, 0];
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
		this.group.position = d.position.add(this.groupOffset);
	}
}