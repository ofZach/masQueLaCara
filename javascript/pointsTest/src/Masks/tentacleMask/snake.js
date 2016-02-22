'use strict';

class snake {
	constructor(d) {
		this.pointsAmount = d.count;
		this.length = 5;
		this.scaley = d.scaley;

		this.chainPath = new paper.Path({
			strokeColor: {
				gradient: {
					stops: ['white', 'red']
				},
				//origin and destination defines the direction of your gradient. In this case its vertical i.e bottom(blue/cooler) to up(red/warmer) refering to link you sent.
				origin: [0, calc.random(400, 700)], //gradient will start applying from y=200 towards y=0. Adjust this value to get your desired result
				destination: [0, 0]
			},
			strokeWidth: d.width,
			strokeCap: 'round'
		});
		// this.chainPath.fullySelected = true;
		var start = new paper.Point(500, 500);
		for (var i = 0; i < this.pointsAmount; i++) {
			this.chainPath.add(new paper.Point(i * this.length, 0));
		}
		this.position = new paper.Point(0, 0);

		this.attractedTo = d.attractedTo;
		this.radius = d.radius;
		this.speed = d.speed;
		this.counter = 0;
	}
	update(d) {

		this.counter++;
		this.chainPath.firstSegment.point = d.position;

		this.chainPath.firstSegment.point.x += this.radius * Math.cos((this.counter / 30.0) * this.speed);
		this.chainPath.firstSegment.point.y += this.scaley * this.radius * Math.sin((this.counter / 30.0) * this.speed);


		this.position = d.position;
		for (var i = 0; i < this.pointsAmount - 1; i++) {
			var segment = this.chainPath.segments[i];
			var nextSegment = segment.next;
			var vector = segment.point.subtract(nextSegment.point);
			vector.length = this.length;
			nextSegment.point = segment.point.subtract(vector);
		}
		this.chainPath.smooth({
			type: 'continuous'
		});
	}
}