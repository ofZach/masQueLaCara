'use strict';
class gradientCircleMask extends MaskBase{
	setup(){
		super.addLayer();
		this.name = 'gradientCircleMask';
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
	update(d){
		this.eyeL.update(d, 'eyeL');
		this.eyeL2.update(d, 'mouth');
		this.eyeR.update(d, 'eyeR');
		this.eyeR2.update(d, 'mouth');
	}
	show(){
		this.showLayer();
	}
	hide(){
		this.hideLayer();
	}
}
