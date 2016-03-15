'use strict';
class pyrateMask extends MaskBase{
	setup(){
		this.name = 'pyrateMask';
		super.addLayer();
		this.head = new blob(
			{ path:'assets/svg/pyrateMask/head.svg',
			  pivot:[0, 320],
			  speed:70
			});
		this.eyeL = new blob(
			{ path:'assets/svg/pyrateMask/eyeL.svg',
			  pivot:[100, 10],
			  speed:180
			});
		this.eyeR = new blob(
			{ path:'assets/svg/pyrateMask/eyeR.svg',
			  pivot:[-100, 30],
			  speed:200
			});
		this.nose = new blob(
			{ path:'assets/svg/pyrateMask/nose.svg',
			  pivot:[40, 100],
			  speed:70
			});
		this.mouth = new blob(
			{ path:'assets/svg/pyrateMask/mouth.svg',
			  pivot:[0,200],
			  speed:170
			});
		this.mouth = new blob(
			{ path:'assets/svg/pyrateMask/mouth.svg',
			  pivot:[0,200],
			  speed:120
			});
		this.mouth2 = new blob(
			{ path:'assets/svg/pyrateMask/mouth.svg',
			  pivot:[0,120],
			  speed:70
			});
		this.mouth3 = new blob(
			{ path:'assets/svg/pyrateMask/mouth.svg',
			  pivot:[0,40],
			  speed:160
			});
	}
	update(d){
		this.head.update(d, 'head');
		// this.eyeL.update(d, 'eyeL');
		this.eyeR.update(d, 'eyeR');
		this.nose.update(d, 'nose');
		this.mouth.update(d, 'mouth');
		this.mouth2.update(d, 'mouth');
		this.mouth3.update(d, 'mouth');
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