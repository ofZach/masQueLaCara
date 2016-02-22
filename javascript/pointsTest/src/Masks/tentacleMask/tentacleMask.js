'use strict';

class tentacleMask extends MaskBase {
	//------------------------------------------
	setup() {
		super.addLayer();

		this.snakes = [];
		for (var i = 0; i < 100; i++) {
			this.snakes.push(
				new snake({
					count: calc.random(3, 30),
					color: '#3a963e',
					width: calc.random(2, 15),
					radius: calc.random(70, 150),
					speed: calc.random(-2.3, 2.3),
					attractedTo: Math.round(calc.random(0, 10000)) % 3
				})
			);

			if (this.snakes[i].attractedTo === 3) {
				this.snakes[i].radius = 250;
				this.snakes[i].speed = calc.random(-0.5, 0.5);
			}

			if (this.snakes[i].attractedTo === 2) {
				this.snakes[i].scaley = 0.4;
				//this.snakes[i].speed = calc.random(-0.5, 0.5);
			} else {
				this.snakes[i].scaley = 1.0;
			}
		}
		// this.snakes = [
		// 	new snake({
		// 		count: 12,
		// 		color: '#3a963e',
		// 		width: 5,
		// 		attractedTo: 0
		// 	}),
		// 	new snake({
		// 		count: 5,
		// 		color: '#4e589e',
		// 		width: 50,
		// 		attractedTo: 0
		// 	}),
		// 	new snake({
		// 		count: 50,
		// 		color: '#ffc541',
		// 		width: 5,
		// 		attractedTo: 0
		// 	}),
		// ];
		this.name = "tentacleMask"
		this.points = [];
		this.velocity = [];

		this.path = new paper.Path.Circle({
			center: [0, 0],
			radius: 50,
			strokeWidth: 1,
			strokeColor: '#999'

		});

		this.path2 = new paper.Path.Circle({
			center: [0, 0],
			radius: 20,
			strokeWidth: 100,
			strokeColor: '#fff'

		});
		this.path2.visible = false;
		this.path.visible = false;
		this.attractIndex = -1;
		this.frameNum = 0;
		this.lastFrameChange = 0;

	}

	//------------------------------------------
	update(data) {
		this.frameNum++;
		this.points = [];
		this.velocity = [];
		var head = data['faceParts']['head'];
		var eyeL = data['faceParts']['eyeL'];
		var eyeR = data['faceParts']['eyeR'];
		var mouth = data['faceParts']['mouth'];

		var pts = [];
		pts.push(eyeL);
		pts.push(eyeR);
		pts.push(mouth);
		pts.push(head);

		for (var i = 0; i < this.snakes.length; i++) {
			//console.log(pts[this.snakes[i].attractedTo]);
			this.snakes[i].update({
				position: pts[this.snakes[i].attractedTo].position,
				offset: 300
			})
		}

		// this.snakes[0].update({
		// 	position: this.path2.position,
		// 	offset: 300,
		// });
		// this.snakes[1].update({
		// 	position: eyeR.position,
		// 	offset: 100,
		// });
		// this.snakes[2].update({
		// 	position: eyeL.position,
		// 	offset: 200,
		// });
		this.points.push(data['faceParts']['eyeL']['position']);
		this.points.push(data['faceParts']['eyeR']['position']);
		this.points.push(data['faceParts']['nose']['position']);
		this.points.push(data['faceParts']['mouth']['position']);

		this.velocity.push(data['faceParts']['eyeL']['velocity']);
		this.velocity.push(data['faceParts']['eyeR']['velocity']);
		this.velocity.push(data['faceParts']['nose']['velocity']);
		this.velocity.push(data['faceParts']['mouth']['velocity']);

		var biggestIndex = -1;
		var biggestAmount = 0;
		var total = 0;
		for (var i = 0; i < this.velocity.length; i++) {
			total += this.velocity[i].length;
		}

		for (var i = 0; i < this.velocity.length; i++) {
			var pct = this.velocity[i].length / total;
			if (pct > biggestAmount) {
				biggestAmount = pct;
				biggestIndex = i;
			}
		}

		if (biggestIndex != -1) {
			if (biggestAmount > 0.46 && ((this.frameNum - this.lastFrameChange) > 15)) {
				//console.log(biggestIndex + " " + biggestAmount)
				this.attractIndex = biggestIndex;
				this.lastFrameChange = this.frameNum;
			}
		}



		if (this.attractIndex !== -1) {
			this.path.position = this.path.position.multiply(0.0).add(this.points[this.attractIndex].multiply(1.0));
		} else {
			this.path.position = this.path.position.multiply(0.0).add(data['faceParts']['head']['position'].multiply(1.0));
		}

		this.path2.position = this.path2.position.multiply(0.93).add(this.path.position.multiply(0.07));
		//var total = eyeLVel + eyeRVel + noseVel + mouthVel;



		// data contains face data, see dataPlayer.js, ie face parts data['faceParts']['eyeL']['position'] as well as face points, etc...
	}

	show() {
		this.showLayer();
	}

	hide() {
		this.hideLayer();
	}
}