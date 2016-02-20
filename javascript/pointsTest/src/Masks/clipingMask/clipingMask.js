'use strict';
class rotator{
	constructor(d){
		this.energy = d.energy;
		this.scaleFactor = d.scaleFactor;
		this.angleEnergy = 0; // vel
		this.rotation = 0;
		this.offset = d.offset;
		this.angleLastFrame = 0;
		this.counter = 0;
	}
	update(data, name){
		var d = data['faceParts'][name];
		this.counter++;
		// fade out the prev energy: 
		this.angleEnergy = this.angleEnergy * this.energy;
		// grab the current data
		var leftEyeAngleThisFrame = d['angle'] * (180 / Math.PI);
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
		this.rotation += this.angleEnergy ;
		// this.group.rotation = this.rotation;
	}
};
class circles {
	constructor(d){
		this.result;
		this.offset = d.offset;
		this.rotator1 = new rotator({
			energy: d.energy,
			scaleFactor: 0.7,
			offset: d.offset,
		});
		this.outerCircle = new paper.Path.Circle({
				center: [0, 0],
				radius: d.radius,
				fillColor: d.outerColor,
		});
		this.innerCircle = new paper.Path.Circle({
				center: [0, 0],
				radius: d.radiusInner,
				fillColor: d.innerColor,
		});
		this.group = new paper.Group();
		this.group.transformContent = false;
		this.group.addChild(this.outerCircle);
		this.group.addChild(this.innerCircle);
		this.rand = [];
		// create small cirecles
		this.smallCirclesCount = 5;
		for (var i = 0; i < this.smallCirclesCount; i++) {
			var smallCircle = new paper.Path.Circle({
					center: [calc.random(-d.radius*0.2, d.radius), calc.random(-d.radius*0.2, d.radius)],
					radius: calc.random(d.radius*0.03, d.radius*0.05),
					fillColor: 'black',
			});
			this.rand.push(Math.random());
			smallCircle.pivot = [calc.random(d.radius*0.01, d.radius*0.04), calc.random(d.radius*0.01, d.radius*0.04)] ;
			this.group.addChild(smallCircle);
		}
		this.group.pivot = d.pivot;
		this.counter = 0;
	}
	update(data, name){
		var d = data['faceParts'][name];
		this.rotator1.update(data, name);
		this.group.position = d.position;
		// rotate small circles
		for (var i = 2; i < this.smallCirclesCount+2; i++) {
			this.group.children[i].rotation = this.rotator1.rotation*this.rand[i-2];
		}
		this.counter++;
	}
}
class clipingMask extends MaskBase {
	setup() {
		super.addLayer();
		this.name = 'clipingMask';
		//---------------------------------------------------- gui
		this.guiSettings = {
			message: 'dat.gui',
			speed: 0.8,
			displayOutline: false
		};
		this.gui = new dat.GUI({
			//autoPlace: false
		});
		this.gui.add(this.guiSettings, 'message');
		this.gui.add(this.guiSettings, 'speed', -5, 5);
		this.gui.add(this.guiSettings, 'displayOutline');
		this.gui.domElement.id = this.name + '_gui';
		document.getElementById(this.gui.domElement.id).style.visibility = "hidden";
		//---------------------------------------------------- 
		//this.gui.add(this.guiInfo, 'explode');
		//this.gui.toggleHide();

		this.clippingPath = new paper.Path.RegularPolygon({
			center: [0, 0],
			radius: 250,
			sides: 3,
			fillColor: 'white',
		});

		this.line = new paper.Path({
			strokeWidth: 1,
			strokeColor: 'white',
		});
		this.line.add([0, 0]);
		this.line.add([500, 0]);
		this.line2 = this.line.clone();
		this.clippingPath.rotation = 60;
		this.eyeL = new circles({
			radiusInner: 130,
			radius: 160,
			innerColor: '#a96f99',
			outerColor: '#ffff00',
			pivot: [100, 0],
			energy: 0.999,
			scaleFactor: 0.7,
			offset: 0,
		});
		this.eyeR = new circles({
			radiusInner: 120,
			radius: 200,
			innerColor: '#fbe3b8',
			outerColor: '#a96f99',
			pivot: [-100, 100],
			energy: 0.999,
			scaleFactor: 0.7,
			offset: 0,
		});
		this.cheekR = new circles({
			radiusInner: 10,
			radius: 100,
			innerColor: '#fbe3b8',
			outerColor: '#fbe3b8',
			pivot: [-40, 0],
			energy: 0.99,
			scaleFactor: 0.7,
			offset: 0,
		});
		this.groupContent = new paper.Group(this.eyeL.group, this.eyeR.group, this.cheekR.group);
		this.groupContent.transformContent = false;
		this.groupContent.pivot = [0,0];
		this.groupMask = new paper.Group( this.clippingPath, this.groupContent);
		this.groupMask.transformContent = false;
		this.groupMask.clipped = true;
		this.circle = new paper.Path.Circle({
				center: [0, 0],
				radius: 50,
				fillColor: '#a96f99',
		});
		this.circle2 = new paper.Path.Circle({
				center: [0, 0],
				radius: 20,
				fillColor: '#a96f99',
		});
		this.circle.pivot = [-40, 0];
		this.counter = 0;
	}
	update(data) {
		var head = data['faceParts']['head'];
		var nose = data['faceParts']['nose'];
		var eyeL = data['faceParts']['eyeL'];
		var eyeR = data['faceParts']['eyeR'];
		var mouth = data['faceParts']['mouth'];
		var cheekL = data['faceParts']['cheekL'];
		var cheekR = data['faceParts']['cheekR'];
		this.clippingPath.position = head.position;
		this.eyeL.update(data, 'eyeL');
		this.eyeR.update(data, 'eyeR');
		this.cheekR.update(data, 'cheekR');
		this.line.position = head.position.add([-head.angle*500, 0]);
		this.line2.position = head.position.add([head.angle*500, -194]);
		this.circle.position = cheekR.position;
		this.circle2.position = cheekL.position;
	}
	show() {
		document.getElementById(this.gui.domElement.id).style.visibility = "visible";
		this.showLayer();
	}
	hide() {
		document.getElementById(this.gui.domElement.id).style.visibility = "hidden";
		this.hideLayer();
	}
}