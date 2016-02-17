'use strict';

class candleMask extends MaskBase {
	//------------------------------------------
	setup() {
		super.addLayer();
		this.name = "candleMask"
		this.eyeL = new petal({
			length: 300, 
			radius: 270, 
			offset: [50, 0],
			colorStart: '#ffc541',
			colorEnd: '#4e589e',
			angleRange: 45, 
			angleRangeH: 100, 
			angleOffset: 0, 
			speed: 12,
			isOsc: true, 
		})
		this.eyeR = new petal({
			length: 300, // hadle length
			radius: 270, 
			offset: [-50, 0],
			colorStart: '#ffc541',
			colorEnd: '#4e589e',
			angleRange: 45, // pendulum
			angleRangeH: 100, // for handles
			angleOffset: 180, // rotation
			speed: 12,
			isOsc: true, // auto rotation
		})
		this.head = new petal({
			length: 400,
			radius: 600,
			offset: [0, -120],
			colorStart: '#ffc541',
			colorEnd: '#4e589e',
			angleRange: 45,
			angleRangeH: 100,
			angleOffset: -90,
			speed: 20,
			isOsc: true,
		})
		this.head2 = new petal({
			length: 400,
			radius: 300,
			offset: [0, 100],
			colorStart: '#a96f99',
			colorEnd: '#4e589e',
			angleRange: 90,
			angleRangeH: 500,
			angleOffset: 90,
			speed: 50,
			isOsc: true,
		})
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
		this.eyeL.update(eyeL);
		this.eyeL.angleRange = this.angle*140;
		this.eyeL.angleRangeH = this.angle*1000;

		this.eyeR.update(eyeR);
		this.eyeR.angleRange = this.angle*140;
		this.eyeR.angleRangeH = this.angle*1000;
		
		this.head.update(head);
		this.head.angleRange = this.angle*500;
		this.head.angleRangeH = this.angle*1000;

		this.head2.update(head);
		this.head2.angleRange = this.angle*250;
		this.head2.angleRangeH = this.angle*500;
		// data contains face data, see dataPlayer.js, ie face parts data['faceParts']['eyeL']['position'] as well as face points, etc...
	}
	show() {
		this.showLayer();
	}
	hide() {
		this.hideLayer();
	}
}