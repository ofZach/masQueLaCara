'use strict';
class switchLine{
	constructor(d){
		this.width = d.length;
		this.speed = d.speed;
		this.swatch = [
			'#c725cc',
			'#cc7890',
			'#992c4c',
			'#f7ff6f',
			'#ccc578',
		]
		this.line2 = new paper.Path.Line({
			from: [0, 0],
			to: [this.width, 0],
			strokeColor: this.swatch[calc.randomInt(0, 4)],
			strokeWidth: d.strokeWidth,
			pivot: [0, 0],
			strokeCap: 'round',
		});

		this.line1 = new paper.Path.Line({
			from: [0, 0],
			to: [this.width, 0],
			strokeColor: this.swatch[calc.randomInt(0, 4)],
			strokeWidth: d.strokeWidth,
			pivot: [0, 0],
			strokeCap: 'round',
		});
		this.line1.position = [-this.width, 0];
		this.g = new paper.Group({
			children:[this.line2,this.line1],
		});
		this.g.transformContent = false;
		this.g.pivot = [0, 0];
		this.g.position = d.position;
		this.isMove = false;
	}
	update(){
		if(this.isMove){
			this.line1.position.x += this.speed;
		}
		if(this.line1.position.x > this.line2.position.x){
			this.line2.strokeColor = this.line1.strokeColor;
			this.line1.strokeColor = this.swatch[calc.randomInt(0, 4)];
			this.line1.strokeColor.brightness = calc.random(0.3,1);
			this.line1.position.x = -this.width;
			this.isMove = false;
		}
	}
}

class circleClipMask extends MaskBase {
	//------------------------------------------
	setup() {
		super.addLayer();
		this.name = "circleClipMask";
		this.lines = [];
		
		this.eyeLGroup = new paper.Group();
		this.eyeLGroup.transformContent = false;

		for (var i = 0; i < 7; i++) {
			var strokeWidth = 50;
			var line = new switchLine({
				length: 700,
				strokeWidth: strokeWidth,
				speed: calc.random(10, 30),
				position: [100, i*strokeWidth+150],
			});
			this.lines.push(line);
			this.eyeLGroup.addChild(line.g);
		}

		this.eyeRGroup = new paper.Group();
		this.eyeRGroup.transformContent = false;
		for (var i = 0; i < 7; i++) {
			var strokeWidth = 50;
			var line = new switchLine({
				length: 700,
				strokeWidth: strokeWidth,
				speed: calc.random(10, 30),
				position: [100, i*strokeWidth-150],
			});
			this.lines.push(line);
			this.eyeRGroup.addChild(line.g);
		}

		this.eyeLGroup.pivot = [this.eyeLGroup.bounds.width/4, this.eyeLGroup.bounds.height/2];
		this.eyeLGroup.rotation = 90;

		this.eyeRGroup.pivot = [this.eyeRGroup.bounds.width/4, this.eyeRGroup.bounds.height/2];
		this.eyeRGroup.rotation = 90;

		this.clipPath = new paper.Path.Circle({
			center: [0,0],
			radius: 300,
		});

		this.eyeLine = new paper.Path.Line({
			from: [0,0],
			to: [200, 0],
			strokeColor: '#f7ff6f',
			strokeWidth: 50,
			strokeCap: 'round',
		});
		this.clipContent = new paper.Group({
			children:[this.eyeRGroup, this.eyeLGroup, this.eyeLine],
		});
		this.clipContent.transformContent = false;

		this.clipGroup = new paper.Group(this.clipPath, this.clipContent);
		this.clipGroup.transformContent = false;

		this.clipGroup.clipped = true;

		this.eyeBallL = new paper.Path.Circle({
			center: [0,0],
			radius: 10,
			fillColor: 'black',
		})
		this.eyeBallR = this.eyeBallL.clone();
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

		this.eyeLGroup.position = eyeL.position;
		this.eyeRGroup.position = eyeR.position;
		this.clipPath.position = head.position;
		
		this.eyeLine.segments[0].point = eyeL.position;
		this.eyeLine.segments[1].point = eyeR.position;

		this.eyeBallL.position = eyeL.position;
		this.eyeBallR.position = eyeR.position;

		for (var i = 0; i < this.lines.length; i++) {
			if(head.velocity.length>calc.random(3.1, 6.8)){
				this.lines[i].isMove = true;
			}
			this.lines[i].update();
		}
	}

	show() {
		this.showLayer();
	}

	hide() {
		this.hideLayer();
	}
}