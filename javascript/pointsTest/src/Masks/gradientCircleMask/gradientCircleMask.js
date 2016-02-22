'use strict';
class gradientCircleMask extends MaskBase {
	setup() {

		super.addLayer();
		this.name = 'gradientCircleMask';

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

		this.head = new tubeCircle({
			innerRadius: 200,
			radius: 40,
			count: 1,
			startColor:  '#9900ff',
			endColor:  '#ea4a73',
		});
		this.head2 = new tubeCircle({
			innerRadius: 265,
			radius: 90,
			count: 1,
			startColor:  '#9900ff',
			endColor:  '#ea4a73',
		});

		this.eyeL = new tubeCircle({
			innerRadius: 30,
			radius: 10,
			count: 2,
			startColor:  '#9900ff',
			endColor:  '#ea4a73',
		});
		this.eyeL2 = new tubeCircle({
			innerRadius: 100,
			radius: 100,
			count: 1,
			startColor:  '#9900ff',
			endColor:  '#ea4a73',
		});
		this.eyeR = new tubeCircle({
			innerRadius: 20,
			radius: 29,
			count: 3,
			startColor:  '#9900ff',
			endColor:  '#ea4a73',
		});
		this.eyeR2 = new tubeCircle({
			innerRadius: 20,
			radius: 100,
			count: 1,
			startColor:  '#9900ff',
			endColor:  '#ea4a73',
		});



		this.counter = 0;
	}
	update(d) {
		//console.log(this.guiSettings['speed']);
		this.eyeL.update(d, 'eyeL');
		this.eyeL2.update(d, 'mouth');
		this.eyeR.update(d, 'eyeR');
		this.eyeR2.update(d, 'mouth');
		this.head.update(d, 'head');
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