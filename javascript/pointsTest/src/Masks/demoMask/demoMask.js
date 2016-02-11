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

	}

	//------------------------------------------
	update(data) {

		//console.log(data);


		this.circ.position.x = data['faceParts']['eyeL']['position'].x;
		this.circ.position.y = data['faceParts']['eyeL']['position'].y;
		this.circ.position.rotation = data['faceParts']['eyeL']['angle'] * (180 / Math.PI);

		this.circ.children[0].strokeWidth = 0.9 * this.circ.children[0].strokeWidth +
			0.1 * (data['faceParts']['eyeL']['velocity'].length * 5 + 20);
		//this.circ.children[0].dashArray = [10, 10 * data['faceParts']['eyeL']['scale']];
	}
}