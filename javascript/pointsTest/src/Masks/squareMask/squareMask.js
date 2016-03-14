'use strict';


class squareMask extends MaskBase {

	//------------------------------------------
	setup() {
		super.addLayer();
		var rectWidth = 50;
		// vertical 
		this.eye = new paper.Path.Rectangle({
			from:[0, 0], 
			to:[rectWidth, 200],
			fillColor: '#4523ff',
		});
		// horisontal
		this.brow = new paper.Path.Rectangle({
			from:[0, 0], 
			to:[130, rectWidth],
			fillColor: '#ff0062',
		});
		
		var eyeR = this.eye.clone();
		eyeR.fillColor = '#fb2cff';
		
		var nose = this.eye.clone();
		nose.fillColor = '#00bfff';
		
		var browR = this.brow.clone();
		browR.fillColor = '#ffff62';

		var mouth = this.eye.clone();
		mouth.fillColor = '#ffff62';
		
		this.eyeLGroup = new paper.Group({
			children: [this.eye],
			transformContent: false,
			pivot: [this.eye.bounds.width/2, 0],
			blendMode: 'multiply',
		});
		this.eyeRGroup = new paper.Group({
			children: [eyeR],
			transformContent: false,
			pivot: [this.eye.bounds.width/2, 0],
			blendMode: 'multiply',
		});
		this.noseGroup = new paper.Group({
			children: [nose],
			transformContent: false,
			pivot: [this.eye.bounds.width/2, 0],
			blendMode: 'multiply',
		});
		this.browLGroup = new paper.Group({
			children: [this.brow],
			transformContent: false,
			pivot: [this.brow.bounds.width/2, this.brow.bounds.height/2],
			blendMode: 'multiply',
		});
		this.browRGroup = new paper.Group({
			children: [browR],
			transformContent: false,
			pivot: [browR.bounds.width/2, browR.bounds.height/2],
			blendMode: 'multiply',
		});
		this.mouthGroup = new paper.Group({
			children: [mouth],
			transformContent: false,
			pivot: [mouth.bounds.width/2, mouth.bounds.height/2],
			blendMode: 'multiply',
		});
		this.name = "squareMask"
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
		
		this.noseGroup.position = nose.position.add([0, -200]);
		this.noseGroup.scaling.y = this.velocity*0.06 +1.2;
		this.noseGroup.scaling.x = this.angle+1.5;
		
		this.browLGroup.position = browL.position;
		this.browLGroup.scaling.y = this.velocity*0.2 +0.5;

		this.browRGroup.position = browR.position;
		this.browRGroup.scaling.y = this.velocity*0.2 +0.7;

		var mouthPath = this.mouthGroup.children[0];
		mouthPath.segments[0].point = lipLower.position.add([100, 0]);
		mouthPath.segments[1].point = lipLower.position.add([-100, 0]);
		mouthPath.segments[2].point = lipUpper.position.add([-100, 0]);
		mouthPath.segments[3].point = lipUpper.position.add([100, 0]);
	}

	show() {
		this.showLayer();
	}

	hide() {
		this.hideLayer();
	}
}