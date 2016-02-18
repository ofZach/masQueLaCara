'use strict';

class candleMask extends MaskBase {
	//------------------------------------------
	setup() {
		super.addLayer();
		this.name = "candleMask"
		this.shapes = [];
		for (var i = 0; i < 5; i++) {
			var shape = new petal({
				length: 100*i, 
				radius: 100*i, 
				offset: [i*20, 0],
				colorStart: '#ffc541',
				colorEnd: '#4e589e',
				angleRange: 45, 
				angleRangeH: 100, 
				angleOffset: i*20, 
				speed: i*4+2,
				isOsc: true, 
			})
			this.shapes.push(shape);
		}

		this.angle = 0;
	}
	smooth(valueOld, valueNew, smooth) {
		return valueOld * smooth + (1 - smooth) * valueNew;
	}
	//------------------------------------------
	update(data) {
		var head = data['faceParts']['head'];
		var nose = data['faceParts']['nose'];
		var eyeL = data['faceParts']['eyeL'];
		var eyeR = data['faceParts']['eyeR'];
		var mouth = data['faceParts']['mouth'];
		var cheekL = data['faceParts']['cheekL'];
		this.angle = this.smooth(this.angle, head.angle, 0.95);
		for (var i = 0; i < this.shapes.length; i++) {
			this.shapes[i].update(head);
			this.shapes[i].angleRange = this.angle*50*i;
			this.shapes[i].angleRangeH = this.angle*1000;
		}
		// data contains face data, see dataPlayer.js, ie face parts data['faceParts']['eyeL']['position'] as well as face points, etc...
	}
	show() {
		this.showLayer();
	}
	hide() {
		this.hideLayer();
	}
}