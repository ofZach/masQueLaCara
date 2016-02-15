'use strict';


class rotationMask extends MaskBase {

	//------------------------------------------
	setup() {

		this.gui = new dat.GUI({
			autoPlace: false
		});
		//this.gui.domElement.class = 'sceneGui';

		this.leftEyeAngleEnergy = 0; // vel
		this.leftEyeAngleAmount = 0;
		this.leftEyeAngleLastFrame = 0;

		this.name = "rotationMask";

		super.addLayer();

		var from = new paper.Point(20, 20);
		var through = new paper.Point(60, 20);
		var to = new paper.Point(80, 80);
		var path = new paper.Path.Arc(from, through, to);
		path.closed = true;
		path.fillColor = 'white';
		this.shape = new paper.Group(path);
		this.shape.transformContent = false;
		this.counter = 0;
	}

	//------------------------------------------
	update(data) {


		//dat.GUI.toggleHide();
		//console.log(data);

		//----------------- noise: 
		// this.counter++;
		// var ns = noise.simplex2(0.0, this.counter / 100.0);
		// var xOffset = ns * 100.0;

		this.shape.position.x = data['faceParts']['eyeL']['position'].x;
		this.shape.position.y = data['faceParts']['eyeL']['position'].y;
		this.shape.rotation = this.leftEyeAngleAmount;


		// fade out the prev energy: 
		this.leftEyeAngleEnergy = this.leftEyeAngleEnergy * 0.999;

		// grab the current data
		var leftEyeAngleThisFrame = data['faceParts']['eyeL']['angle'] * (180 / Math.PI);

		// subtract the prev from curr to get "velocty"
		var leftEyeDiff = leftEyeAngleThisFrame - this.leftEyeAngleLastFrame;

		// angles wrap over so check use the shortest distance:
		if (leftEyeDiff < -180) leftEyeDiff += 360;
		if (leftEyeDiff > 180) leftEyeDiff -= 360;

		// increase the energy by the difference
		this.leftEyeAngleEnergy += leftEyeDiff * 0.4;

		// store the last frame
		this.leftEyeAngleLastFrame = leftEyeAngleThisFrame;

		// rotate the eye
		this.leftEyeAngleAmount += this.leftEyeAngleEnergy;

		// console.log(this.leftEyeAngleAmount);

		//this.circ.children[0].strokeWidth = 10 + xOffset; //0.9 * this.circ.children[0].strokeWidth +
		//0.1 * (data['faceParts']['eyeL']['velocity'].length * 5 + 20);
		//this.circ.children[0].dashArray = [10, 10 * data['faceParts']['eyeL']['scale']];
	}

	show() {
		this.showLayer();
	}

	hide() {
		this.hideLayer();
	}
}