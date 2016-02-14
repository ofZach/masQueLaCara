'use strict';
class pyrateMask extends MaskBase{
	setup(){
		this.name = 'pyrateMask';
		super.addLayer();
		this.head = new blob(
			{ path:'assets/svg/pyrateMask/head.svg',
			  pivot:[0, 350],
			});
		this.eyeL = new blob(
			{ path:'assets/svg/pyrateMask/eyeL.svg',
			  pivot:[30, 30],
			});
		this.eyeR = new blob(
			{ path:'assets/svg/pyrateMask/eyeR.svg',
			  pivot:[-30, 30],
			});
		this.nose = new blob(
			{ path:'assets/svg/pyrateMask/nose.svg',
			  pivot:[40, 370],
			});
		this.mouth = new blob(
			{ path:'assets/svg/pyrateMask/mouth.svg',
			  pivot:[0, 0],
			});
	}
	update(d){
		this.head.update(d, 'head');
		this.eyeL.update(d, 'eyeL');
		this.eyeR.update(d, 'eyeR');
		this.nose.update(d, 'nose');
		this.mouth.update(d, 'mouth');
		// this.cheekL.update(d, 'cheekL');
		// this.cheekR.update(d, 'cheekR');
	}
	show(){
		this.showLayer();
	}
	hide(){
		this.hideLayer();
	}

}