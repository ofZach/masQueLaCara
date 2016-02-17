'use strict';
class snake{
	constructor(d){
		this.pointsAmount = d.count;
		this.length = 35;

		this.chainPath = new paper.Path({
			strokeColor: d.color,
			strokeWidth: d.width,
			strokeCap: 'round'
		});
		// this.chainPath.fullySelected = true;
		var start = new paper.Point(500, 500);
		for (var i = 0; i < this.pointsAmount; i++){
			this.chainPath.add(new paper.Point(i * this.length, 0));
		}
		this.position = new paper.Point(0,0);
	}
	update(d){
		this.chainPath.firstSegment.point = d.position;
		this.position = d.position;
		for (var i = 0; i < this.pointsAmount - 1; i++) {
			var segment = this.chainPath.segments[i];
			var nextSegment = segment.next;
			var vector = segment.point.subtract(nextSegment.point).add(d.position	.divide(d.offset));
			vector.length = this.length;
			nextSegment.point = segment.point.subtract(vector);
		}
		this.chainPath.smooth({ type: 'continuous' });
	}
}
class tentacleMask extends MaskBase {	
	//------------------------------------------
	setup() {
		super.addLayer();
		this.snakes = [
			new snake({
				count: 12,
				color: '#3a963e',
				width: 5,
			}),
			new snake({
				count: 15,
				color: '#4e589e',
				width: 20,
			}),
			new snake({
				count: 50,
				color: '#ffc541',
				width: 20,
			}),
		];
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
		this.snakes[0].update({
			position: this.path2.position,
			offset: 300,
		});
		this.snakes[1].update({
			position: eyeR.position,
			offset: 100,
		});
		this.snakes[2].update({
			position: eyeL.position,
			offset: 200,
		});
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