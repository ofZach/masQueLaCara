'use strict';


function getRand(min, max) {
	return Math.random() * (max - min) + min;
}

class bounceMask extends MaskBase {

	setup() {
		this.name = 'blobMask';
		super.addLayer();


	}

	update(data) {

		// update physics
		physicsManager.update();



		//this.staticCircles['eyeL'].position.x = data['faceParts']['eyeL']['position'].x;
		//this.staticCircles['eyeL'].position.y = data['faceParts']['eyeL']['position'].x;

		//console.log(data);

		var tempPt = new paper.Point(data['boundingCircle'].x, data['boundingCircle'].y);

		var eyePt = data['faceParts']['eyeL']['position'];
		var eyePt2 = data['faceParts']['eyeR']['position'];

		var eyeVel = data['faceParts']['eyeL']['velocity'].length * 5;
		var eyeVel2 = data['faceParts']['eyeL']['velocity'].length * 5;
		var newPt = eyePt.add(eyePt2).divide(2.0);

		//console.log(tempPt);
		for (var i = 0; i < this.physObjs.length; i++) {
			var objPt = this.physObjs[i].position;
			var dist = newPt.getDistance(objPt);
			var diff = newPt.subtract(objPt);
			diff = diff.normalize();
			diff = diff.multiply(0.4);

			Body.applyForce(this.physObjs[i], this.physObjs[i].position, {
				x: diff.x,
				y: diff.y
			});


			// eye: 
			dist = eyePt.getDistance(objPt);
			diff = eyePt.subtract(objPt);
			if (diff.length < (80 + eyeVel)) {
				diff = diff.normalize();
				diff = diff.multiply(3.0);

				Body.applyForce(this.physObjs[i], this.physObjs[i].position, {
					x: -diff.x,
					y: -diff.y
				});
			}

			dist = eyePt2.getDistance(objPt);
			diff = eyePt2.subtract(objPt);
			if (diff.length < (80 + eyeVel2)) {
				diff = diff.normalize();
				diff = diff.multiply(3.0);

				Body.applyForce(this.physObjs[i], this.physObjs[i].position, {
					x: -diff.x,
					y: -diff.y
				});
			}



		}


		for (var i = 0; i < this.physObjs.length; i++) {
			var item = this.physicsLayer.children[i];
			var b = this.physObjs[i];
			item.position.x = b.position.x;
			item.position.y = b.position.y;
		}

	}

	show() {
		this.showLayer();

		this.physicsLayer = new paper.Layer();
		this.physObjs = [];
		for (var i = 0; i < 100; i++) {
			var rad = getRand(20, 30);
			var x = getRand(200, 500);
			var y = getRand(200, 500);
			var path = new paper.Path.Circle(new paper.Point(x, y), rad * 0.9);
			this.physicsLayer.children[i].fillColor = 'white';
			//this.physicsLayer.children[i].strokeWidth = 1;
			//this.physicsLayer.children[i].strokeColor = 'red';

			//this.physicsLayer.children[i].dashArray = [10, 10];
			this.physicsLayer.children[i].opacity = 1.0;



			var circs = physicsManager.addCircle(x, y, rad, false);
			this.physObjs.push(circs);
		}

		//this.staticCircles = {};
		//this.staticCircles['eyeL'] = physicsManager.addCircle(400, 400, 100, true);
	}

	hide() {
		this.hideLayer();

		this.physicsLayer.removeChildren();
		this.physicsLayer.remove();
		physicsManager.removeAllBodies();
		this.physObjs = [];
	}
}