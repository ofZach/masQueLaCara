'use strict';


class demoMask extends MaskBase {

	//------------------------------------------
	setup() {

		super.addLayer();

		var eyeCirc = new paper.Path.Circle({
			center: [80, 50],
			radius: 100,
			strokeWidth: 100,
			strokeColor: 'pink'
		});
		eyeCirc.dashArray = [3, 3];
		eyeCirc.opacity = 0.3;
		this.circ = new paper.Group(eyeCirc);
		this.circ.transformContent = false;

		this.name = "demoMask"

		this.osc = new oscillator();
		this.osc.setup(60, false); // 60 fps query... sine wave
		this.osc.setFrequency(0.3);
		this.osc.setVolume(1);
		this.counter = 0;

	}

	//------------------------------------------
	update(data) {

		//console.log(data);

		//----------------- noise: 
		// this.counter++;
		// var ns = noise.simplex2(0.0, this.counter / 100.0);
		// var xOffset = ns * 100.0;

		var v = this.osc.getSample();
		var xOffset = v * 40.0 + 40;
		this.osc.setFrequency(0.2 + data['faceParts']['eyeL']['velocity'].length * 2.3);

		this.circ.position.x = data['faceParts']['eyeL']['position'].x;
		this.circ.position.y = data['faceParts']['eyeL']['position'].y;
		this.circ.position.rotation = data['faceParts']['eyeL']['angle'] * (180 / Math.PI);



		this.circ.children[0].strokeWidth = 10 + xOffset; //0.9 * this.circ.children[0].strokeWidth +
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