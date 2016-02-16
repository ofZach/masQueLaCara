'use strict';

// I am a circle with hole in it (see setCircle())
class innerCircle {
	constructor(d) {

		this.path = new paper.Path.Circle({
			center: [0, 0],
			radius: d.radius,
			strokeWidth: d.stroke,
			strokeColor: '#ffffff'
			// strokeColor:{
			// 	   gradient: {
			// 	       stops: [d.startColor, d.endColor]
			// 	   },
			// 	   origin: [-d.radius, 0],
			// 	   destination:  [d.radius, 0],
			// }
		});

		//this.radius =

		//this.path.fullySelected = true;
	}

	setCircle(innerRadius, outerRadius) {
		this.path.strokeWidth = (outerRadius - innerRadius);
		var targetScale = innerRadius + (outerRadius - innerRadius) / 2.0;
		var curScale = this.path.segments[0].point.getDistance(this.path.position);
		this.path.scale(targetScale / curScale);
		// var diff = this.path.segments[0].point.subtract(this.path.position);
		// console.log(diff.length);
		// var targetScale = (outerRadius - innerRadius) / 2.0;
		// for (var i = 0; i < this.path.segments.length; i++) {
		// 	this.path.segments[i].point = this.path.segments[i].point.subtract(this.path.position).normalize(targetScale);
		// 	this.path.segments[i].point.add(this.path.position);
		// }
		//console.log(targetScale);
	}


};

class circleFaceMask extends MaskBase {

	//------------------------------------------
	setup() {

		super.addLayer();

		this.name = "circleFaceMask"

		this.leftEye = new innerCircle({
			radius: 100,
			stroke: 50,
		});

		this.rightEye = new innerCircle({
			radius: 100,
			stroke: 50,
		});

		this.noseA = new innerCircle({
			radius: 100,
			stroke: 50,
		});

		this.noseB = new innerCircle({
			radius: 100,
			stroke: 50,
		});

		this.cheekA = new innerCircle({
			radius: 100,
			stroke: 50,
		});
		this.cheekB = new innerCircle({
			radius: 100,
			stroke: 50,
		});

		this.mouth = new innerCircle({
			radius: 100,
			stroke: 50,
		});



		this.counter = 0;
	}

	//------------------------------------------
	update(data) {

		this.counter++;

		this.leftEye.setCircle(0, 30);
		this.leftEye.path.position = data['faceParts']['eyeL']['position']

		this.rightEye.setCircle(0, 30);
		this.rightEye.path.position = data['faceParts']['eyeR']['position']

		this.noseA.setCircle(0, 5);
		this.noseB.setCircle(0, 5);
		this.noseA.path.position = data['points'][32].multiply(0.5).add(data['faceParts']['head']['position'].multiply(0.5));
		this.noseB.path.position = data['points'][34].multiply(0.5).add(data['faceParts']['head']['position'].multiply(0.5));

		this.cheekA.setCircle(0, 50);
		this.cheekB.setCircle(0, 50);
		this.cheekA.path.position = data['faceParts']['cheekL']['position']
		this.cheekB.path.position = data['faceParts']['cheekR']['position']

		this.mouth.setCircle(10, 30);
		this.mouth.path.position = data['faceParts']['mouth']['position']


	}

	show() {
		this.showLayer();
	}

	hide() {
		this.hideLayer();
	}
}