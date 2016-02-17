'use strict';
class flowerMask extends MaskBase {
	setup() {
		super.addLayer();
		this.name = 'flowerMask';
		this.shapes = [];
		this.group = new paper.Group();
		this.group.transformContent = false;
		for (var i = 0; i < 4; i++) {
			var shape = new flowerSvgLoader({
				path: 'assets/svg/FlowerMask/flower.svg',
				offset: [0, i*50+200],
			});
			this.group.addChild(shape.group);
			this.shapes.push(shape);
		}
		this.eyeL = new flowerSvgLoader({
			path: 'assets/svg/FlowerMask/flower.svg',
			offset: [0, 0],
		});
		this.eyeL2 = new flowerSvgLoader({
			path: 'assets/svg/FlowerMask/flower.svg',
			offset: [10, 0],
		});

		this.group.pivot = [this.group.bounds.width / 2, 300];
		this.counter = 0;
		this.velocity = 0;
	}
	smoothValue(valueOld, valueNew, smooth) {
		return valueOld * smooth + (1 - smooth) * valueNew;
	}
	update(data) {
		var head = data['faceParts']['head'];
		var nose = data['faceParts']['nose'];
		var eyeL = data['faceParts']['eyeL'];
		var eyeR = data['faceParts']['eyeR'];
		var mouth = data['faceParts']['mouth'];
		var cheekL = data['faceParts']['cheekL'];
		this.velocity = this.smoothValue(this.velocity, head['velocity'].length, 0.95);
		for (var i = 0; i < this.shapes.length; i++) {
			this.shapes[i].update({
				rootPos: head.position,
				animate: Math.cos(this.counter/20+i*0.5+0.7)*0.5+0.5,
				rotation: head.angle*i*3,
				pivot: [i*100, i*100],
			});
			var offsetAmount =  this.velocity*20 +3;
			this.shapes[i].group.pivot = [70,i*offsetAmount+200];
			//this.shapes[i].group.scaling = [0,i*offsetAmount];
		}
		this.eyeL.group.scaling = 1.3;
		this.eyeL2.group.scaling = 1.3;
		this.eyeL.update({
			rootPos: eyeL.position,
			animate: Math.cos(this.counter/30+0.7)*0.5+0.5,
			rotation: eyeL.angle*2+this.velocity/4.,
			pivot: [0, 0],
		});
		this.eyeL2.update({
			rootPos: eyeR.position,
			animate: (Math.cos(this.counter/15+0.9)*0.5+0.5)*0.5+0.5,
			rotation: eyeR.angle*2-this.velocity/3.+0.2,
			pivot: [0, 0],
		});
		this.counter++;
	}
	show() {
		this.showLayer();
		// this.head.show();
	}
	hide() {
		this.hideLayer();
		// this.head.hide();
	}

}