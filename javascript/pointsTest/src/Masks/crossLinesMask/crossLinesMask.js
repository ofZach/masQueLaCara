'use strict';
class switchLine2{
	constructor(d){
		this.width = d.length;
		this.speed = d.speed;
		this.swatch = [
			'#3a963e',
			'#a96f99',
			'#4e589e',
			'#ffc541',
			'#f3662f',
		]
		this.line2 = new paper.Path.Line({
			from: [0, 0],
			to: [this.width, 0],
			strokeColor: this.swatch[calc.randomInt(0, 4)],
			strokeWidth: d.strokeWidth,
			pivot: [0, 0],
			strokeCap: 'round',
			shadowColor: new Color(0, 0, 0, 0.5),
			shadowBlur: 40,
			shadowOffset: new Point(0, 20),
		});

		this.line1 = new paper.Path.Line({
			from: [0, 0],
			to: [this.width, 0],
			strokeColor: this.swatch[calc.randomInt(0, 4)],
			strokeWidth: d.strokeWidth,
			pivot: [0, 0],
			strokeCap: 'round',
			// shadowColor: new Color(0, 0, 0, 0.8),
			// shadowBlur: 40,
			// shadowOffset: new Point(0, 20),
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
			this.line1.strokeColor.brightness = calc.random(0.7,2);
			this.line1.position.x = -this.width;
			this.isMove = false;
		}
	}
}

class crossLinesMask extends MaskBase {
	//------------------------------------------
	setup() {
		super.addLayer();
		this.name = "crossLinesMask";
		this.lines = [];
		
		this.eyeLGroup = new paper.Group();
		this.eyeLGroup.transformContent = false;
		this.strokeWidth = 40;
		for (var i = 0; i < 6; i++) {
			var line = new switchLine2({
				length: 700,
				strokeWidth: this.strokeWidth,
				speed: calc.random(10, 30),
				
			});
			
			this.lines.push(line);
			this.eyeLGroup.addChild(line.g);
		}

		this.clipPath = new paper.Path.Circle({
			center: [0,0],
			radius: 250,
		})

		this.eyeLine = new paper.Path.Line({
			from: [0,0],
			to: [200, 0],
			strokeColor: '#f7ff6f',
			strokeWidth: 50,
			strokeCap: 'round',
		});
		this.clipContent = new paper.Group({
			children:[ this.eyeLGroup, this.eyeLine],
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

		this.clipPath.position = head.position.add([0, -100]);
		
		// this.eyeLine.segments[0].point = eyeL.position;
		// this.eyeLine.segments[1].point = eyeR.position;

		this.eyeBallL.position = eyeL.position;
		this.eyeBallR.position = eyeR.position;

		var counterL = 0;
		var counterR = 0;

		for (var i = 0; i < this.lines.length; i++) {
			if(head.velocity.length>calc.random(3.1, 6.8)){
				this.lines[i].isMove = true;
			}
			this.lines[i].update();
			if(i%2==0){
				this.lines[i].g.pivot = [500, counterL*this.strokeWidth-this.strokeWidth];
				this.lines[i].g.position = eyeL.position;
				this.lines[i].g.rotation = 45;
				counterL++;
			}else{
				this.lines[i].g.pivot = [500, counterR*this.strokeWidth-this.strokeWidth];
				this.lines[i].g.position = eyeR.position;
				this.lines[i].g.rotation = 135;
				counterR++;
			}
		}
	}

	show() {
		this.showLayer();
	}

	hide() {
		this.hideLayer();
	}
}