'use strict';
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
class triangle {
	constructor(d){
		this.result;
		this.offset = d.offset;
		this.rotator1 = new rotator({
			energy: 0.999,
			scaleFactor: 0.7,
			offset: d.offset,
		});
		this.rotator2 = new rotator({
			energy: 0.99,
			scaleFactor: 1.2,
			offset: d.offset,
		});
		this.path1 = new paper.Path.Circle({
				center: [0, 0],
				radius: d.radius+40,
				strokeWidth: d.stroke,
				strokeColor:{
					   gradient: {
					       stops: [d.startColor, d.endColor]
					   },
					   origin: [-d.radius, 0],
					   destination:  [d.radius, 0],
				}
		});
		this.path2 = new paper.Path.Circle({
				center: [0, 0],
				radius: d.radius,
				strokeWidth: d.stroke,
				strokeColor:{
					   gradient: {
					       stops: [d.startColor, d.endColor]
					   },
					   origin: [-d.radius, 0],
					   destination:  [d.radius, 0],
				}
		});
		// this.path2 = new paper.Path.Circle({
		// 		center: [100, 0],
		// 		radius: d.radius-100,
		// 		strokeWidth: d.stroke,
		// 		strokeColor:{
		// 			   gradient: {
		// 			       stops: [d.startColor, d.endColor]
		// 			   },
		// 			   origin: [-d.radius, 0],
		// 			   destination:  [d.radius, 0],
		// 		}
		// });
		this.path1.visible = false;
		this.path2.visible = false;
		this.path1.strokeColor.gradient.stops[0].color.alpha = 0.2;
		this.path1.strokeColor.gradient.stops[1].color.alpha = 0.9;
		// this.path1.position = [100, 0];
		// this.result = this.path1.subtract(this.path2);
		this.group = new paper.Group();
		this.group.pivot = [0, 0];
		this.group.transformContent = false;
		this.counter = 0;
	}
	update(data, name){
		var d = data['faceParts'][name];
		if(this.result) this.result.remove();
		this.rotator1.update(data, name);
		this.rotator2.update(data, name);
		// this.path2.rotation = this.rotator1.rotation;
		// this.path1.rotation = 1;
		this.path1.position = data['faceParts']['eyeL']['position'];
		this.path2.position = data['faceParts']['eyeR']['position'];
		this.path2.position.x += Math.sin(this.counter/100.0) * 300;
		// this.path2.scaling = Math.cos(this.counter/20)*0.5+0.5+1;
		// this.path2.pivot = [0, 0];
		// this.path2.segments[0].handleIn.angle = this.rotation;
		// this.path2.segments[0].handleOut.angle = this.rotation+180;
		this.result = this.path1.unite(this.path2);
		// this.result.rotation = Math.cos(this.counter/20)*120;
		this.group.addChild(this.result);
		// this.group.position = d.position;
		// this.group.rotation = this.offset;
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

		this.head = new triangle({
			radius: 100,
				stroke: 40,
				energy: 0.999,
				scaleFactor: 0.7,
				offset: 0,
				startColor: '#3a963e',
				endColor: '#ea4a73',
				shape: 'circle',
		});

		this.head2 = new triangle({
			radius: 100,
				stroke: 40,
				energy: 0.99,
				offset: 100,
				scaleFactor: 0.9,
				startColor: '#3a963e',
				endColor: '#ea4a73',
				shape: 'circle',
		});


		this.counter = 0;
	}
	update(d) {
		//console.log(this.guiSettings['speed']);
		// this.head.update(d, 'head');
		this.head2.update(d, 'head');

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