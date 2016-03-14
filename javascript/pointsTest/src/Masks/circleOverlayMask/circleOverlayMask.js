'use strict';

class circleOverlayMask extends MaskBase {

	//------------------------------------------
	setup() {
		super.addLayer();
		this.name = "circleOverlayMask";


		this.circles = [];
		this.circlesPieces = [];

		for (var i = 0; i < 3; i++) {
			var path = new paper.Path.Circle(new paper.Point(300, 300), 120 - i * 10);
			path.strokeColor = 'white';
			path.visible = true;
			this.circles.push(path);
			this.circlesPieces.push(path);
		}

		this.counter = 0;


	}

	//------------------------------------------
	update(data) {

		this.counter++;
		for (var i = 0; i < 3; i++) {
			this.circles[i].position.x = 300 + Math.sin(this.counter / 30.0 + i / 3.0) * 100;
		}


		// // sequence of operations
		// var ops = ["subtract", "subtract"];
		// // sequence of operands
		// var operands = [this.circles[1], this.circles[2]];
		// this.circlesPieces[0] = this.circles[0];
		// var result;
		// for (var i = 0; i < ops.length; i++) {
		// 	result = this.circlesPieces[0][ops[i]](operands[i + 1]);
		// 	if (i) this.circlesPieces[0].remove();
		// 	this.circlesPieces[0] = result;
		// }

		// this.circlesPieces[0].position.y = 400;

		//this.circlesPieces[0].remove();
		//this.circlesPieces[0] = this.circles[0];

		// var path = new paper.Path();
		// path = this.circles[0].clone();
		// path.visible = false;
		// for (var i = 1; i < 10; i++) {
		// 	path = path.subtract(this.circles[i]);
		// 	path.visible = false;
		// }
		// this.circlesPieces[0] = path.clone();
		// this.circlesPieces[0].visible = true;
		// this.circlesPieces[0].position.y = 400;
		// console.log(this.circlesPieces[0]);

		// data contains face data, see dataPlayer.js, ie face parts data['faceParts']['eyeL']['position'] as well as face points, etc...
	}

	show() {
		this.showLayer();
	}

	hide() {
		this.hideLayer();
	}
}