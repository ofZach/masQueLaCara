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

		this.eyeL = new tubeCircle({
			innerRadius: 20,
			radius: 29,
			count: 3,
		});
		this.eyeL2 = new tubeCircle({
			innerRadius: 100,
			radius: 100,
			count: 1,
		});
		this.eyeR = new tubeCircle({
			innerRadius: 20,
			radius: 29,
			count: 3,
		});
		this.eyeR2 = new tubeCircle({
			innerRadius: 20,
			radius: 100,
			count: 1,
		});

		this.counter = 0;
	}
	update(d) {
		//console.log(this.guiSettings['speed']);
		this.eyeL.update(d, 'eyeL');
		this.eyeL2.update(d, 'mouth');
		this.eyeR.update(d, 'eyeR');
		this.eyeR2.update(d, 'mouth');
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