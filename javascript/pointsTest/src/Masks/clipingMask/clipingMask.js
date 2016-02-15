'use strict';
'use strict';
class rotator{
	constructor(d){
		this.energy = d.energy;
		this.scaleFactor = d.scaleFactor;
		this.angleEnergy = 0; // vel
		this.rotation = 0;
		this.angleLastFrame = 0;
		this.counter = 0;
		
		this.path1 = new paper.Path.RegularPolygon({
			center: [0, 0],
			sides: 3,
			strokeWidth: d.stroke,
			radius: d.radius-50,
			strokeColor:{
					   gradient: {
					       stops: [d.startColor, d.endColor]
					   },
					   origin: [-d.radius, 0],
					   destination:  [d.radius, 0],
			},

		});
		this.path2 = new paper.Path.RegularPolygon({
			center: [0, 0],
			sides: 3,
			strokeWidth: d.stroke,
			radius: d.radius,
			strokeColor:{
					   gradient: {
					       stops: [d.startColor, d.endColor]
					   },
					   origin: [-d.radius, 0],
					   destination:  [d.radius, 0],
			},

		});
		this.path1.visible = false;
		this.path2.visible = false;
		this.path1.strokeColor.gradient.stops[0].color.alpha = 0.2;
		this.path1.strokeColor.gradient.stops[1].color.alpha = 0.9;
		// this.path1.position = [100, 0];
		// this.result = this.path1.subtract(this.path2);
		this.group = new paper.Group();
		this.group.pivot = [0, 0];
		
		this.group.transformContent = false;
		console.log("this.path.children = " + this.path);
	}
	update(data, name){
		var d = data['faceParts'][name];
		if(this.result) this.result.remove();
		this.path2.rotation = this.rotation;
		this.path2.pivot = [0, 0];
		// this.path2.segments[0].handleIn.angle = this.rotation;
		// this.path2.segments[0].handleOut.angle = this.rotation+180;
		this.result = this.path1.unite(this.path2);
		this.group.addChild(this.result);
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
		this.rotation += this.angleEnergy;
		// this.group.rotation = this.rotation;
		this.group.position = d.position;
	}
};
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

		this.head = new rotator({
			radius: 400,
				stroke: 40,
				energy: 0.999,
				scaleFactor: 0.7,
				startColor: '#3a963e',
				endColor: '#ea4a73',
				shape: 'circle',
		});


		this.counter = 0;
	}
	update(d) {
		//console.log(this.guiSettings['speed']);
		this.head.update(d, 'head');

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