'use strict';


class squareMask3 extends MaskBase {

	//------------------------------------------
	setup() {
		super.addLayer();
		this.name = "squareMask3";
		this.rectWidth = 50;
		// vertical
		this.eye = new paper.Path.Rectangle({
			from:[0, 0], 
			to:[this.rectWidth, 200],
			fillColor: 'white',
		});
		// horisontal
		this.brow = new paper.Path.Rectangle({
			from:[0, 0], 
			to:[400, this.rectWidth],
			fillColor: 'white',
		});
		
		var eyeR = this.eye.clone();
		eyeR.fillColor = 'white';
		
		var nose = this.eye.clone();
		nose.fillColor = 'white';

		var earL = this.eye.clone();
		earL.fillColor = 'white';

		var earR = this.eye.clone();
		earR.fillColor = 'white';
		
		var browUp = this.brow.clone();
		browUp.fillColor = 'white';

		var mouth = this.eye.clone();
		mouth.fillColor = 'white';
		
		var mouth2 = this.eye.clone();
		mouth2.fillColor = 'white';
		
		this.eyeLGroup = new paper.Group({
			children: [this.eye],
			transformContent: false,
			pivot: [this.eye.bounds.width/2, 0],
		});
		this.eyeRGroup = new paper.Group({
			children: [eyeR],
			transformContent: false,
			pivot: [this.eye.bounds.width/2, 0],
		});
		this.noseGroup = new paper.Group({
			children: [nose],
			transformContent: false,
			pivot: [this.eye.bounds.width/2, 0],
		});
		this.browDownGroup = new paper.Group({
			children: [this.brow],
			transformContent: false,
			pivot: [this.brow.bounds.width/2, 0],
		});
		this.browUpGroup = new paper.Group({
			children: [browUp],
			transformContent: false,
			pivot: [browUp.bounds.width/2, browUp.bounds.height],
		});
		this.mouthGroup = new paper.Group({
			children: [mouth],
			transformContent: false,
			pivot: [mouth.bounds.width/2, mouth.bounds.height/2],
		});
		this.mouthGroup2 = new paper.Group({
			children: [mouth2],
			transformContent: false,
			pivot: [mouth2.bounds.width/2, mouth2.bounds.height/2],
		});
		this.earRGroup = new paper.Group({
			children: [earR],
			transformContent: false,
			pivot: [earR.bounds.width/2, earR.bounds.height/2],
		});
		this.earLGroup = new paper.Group({
			children: [earL],
			transformContent: false,
			pivot: [earL.bounds.width/2, earL.bounds.height/2],
		});
		this.angle = 0;
		this.velocity = 0;
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
		var earR = data['faceParts']['earR'];
		var earL = data['faceParts']['earL'];
		var mouth = data['faceParts']['mouth'];
		var cheekL = data['faceParts']['cheekL'];
		var browL = data['faceParts']['browL'];
		var browR = data['faceParts']['browR'];
		var lipUpper = data['faceParts']['lipUpper'];
		var lipLower = data['faceParts']['lipLower'];
		
		this.angle = this.smooth(this.angle, head.angle, 0.9);
		this.velocity = this.smooth(this.velocity, head.velocity.length, 0.9);
		
		this.eyeLGroup.scaling.y = -this.angle+0.2;
		this.eyeLGroup.position = eyeL.position;
		
		this.eyeRGroup.position = eyeR.position;
		this.eyeRGroup.scaling.y = this.angle+0.2;

		this.earLGroup.position = earL.position;
		
		this.earRGroup.position = earR.position;
		
		this.noseGroup.position = nose.position.add([0, -200]);
		
		var midBrow = browL.position.getDistance(browR.position)/2;
		this.browDownGroup.position = browL.position.add([midBrow, -50]);
		this.browDownGroup.scaling.y = this.velocity*0.13 +0.8;
		this.browUpGroup.position = browL.position.add([midBrow, -70]);
		this.browUpGroup.scaling.y = this.velocity*0.13 +0.8;

		this.mouthGroup2.position = lipLower.position.add([0, 50]);
		this.mouthGroup2.scaling.y = 0.15;
		
		var mouthPath = this.mouthGroup.children[0];
		mouthPath.segments[0].point = lipLower.position.add([this.rectWidth/2, 0]);
		mouthPath.segments[1].point = lipLower.position.add([-this.rectWidth/2, 0]);
		mouthPath.segments[2].point = lipUpper.position.add([-this.rectWidth/2, 0]);
		mouthPath.segments[3].point = lipUpper.position.add([this.rectWidth/2, 0]);
	}

	show() {
		this.showLayer();
	}

	hide() {
		this.hideLayer();
	}
}