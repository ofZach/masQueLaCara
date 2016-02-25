'use strict';
class arc2 {
	constructor(d){
		this.name = calc.randomInt(0, 20);
		this.clipPos = d.pos;
		this.offset = d.offset;
		this.clip = new paper.Group({transformContent: false, pivot: [0, 0]});
		this.move = false;
		this.location = {};
		this.prevLocation = {x: 0, y: 0};
		this.curPos = { x: 0, y: 0};
		this.color = {r: 1.0, g: 1.0, b: 1.0};
		var self = this;
		this.tween = new TWEEN.Tween(this.curPos).onComplete(function(){
			self.move = false;
		});
		this.tweenColor = new TWEEN.Tween(this.color).onComplete(function(){
		});
		this.tween.easing(TWEEN.Easing.Quadratic.Out);
		this.tweenColor.easing(TWEEN.Easing.Quadratic.InOut);
		this.circle = new paper.Path.Circle({
			center: [d.radius,d.radius],
			radius: d.radius-1.5,
			strokeColor: 'white',
			strokeWidth: 3,
		});
		this.rect = new paper.Path.Rectangle({
        	from:[0,0],
        	to: [d.radius, d.radius],
        	fillColor: 'white',
        });	
        // this.group.addChild(d.circle);
        // this.group.pivot = [this.group.bounds.width/2, this.group.bounds.height/2];
        var width = d.radius*2;
        var height = d.radius*2;

        this.location.tl = { x: 0, y: 0,};
        this.location.tr = { x: width/2, y: 0,};
        this.location.bl = { x: 0, y: height/2,};
        this.location.br = { x: width/2, y: height/2,};
        this.location.empty = { x: width, y: 0,};
        // this.group.position = this.location[d.location];
        // this.prevLocation = this.location[d.location];
        this.clip.addChild(this.rect);
        this.clip.addChild(this.circle);
        this.clip.clipped = true;
	}
	moveTo(d){
		if(!this.move){

			self = this;
			
			this.tween
			.to( this.location[d.destination], d.duration )
			.start();

			this.tweenColor
			.to( d.color, d.duration )
			.start();
		}
		this.move = true;
	}
	update(){
		if(this.move){
			var c = this.color;
			this.circle.strokeColor = new Color(c.r, c.g, c.b, 1);
			this.circle.position = [this.curPos.x, this.curPos.y];
		}
	}
}

class arcGrid2 {
	constructor(d){
		this.shapes = [];
		this.combinations = d.combination;
		this.maxComb = this.combinations.length;
		var radius = d.radius;
		var width = radius;
		var height = radius;
		var offset = [350, 100];
		this.colors = [
			{r: 116/255, g:91/255, b: 153/255},
			{r: 207/255, g:177/255, b: 124/255},
			{r: 231/255, g:1/255, b: 69/255},
			{r: 0/255, g:156/255, b: 147/255}
		];
		this.group = new paper.Group({
			transformContent: false,
			fullySelected: true,
		});
		this.pos = [];
		for (var i = 0; i < d.column; i++) {
			for (var k = 0; k < d.row ; k++) {
				var shape = new arc2({
					radius: radius,
					location: this.combinations[calc.randomInt(0, this.maxComb)][calc.randomInt(0, 5)],
					destination: this.combinations[calc.randomInt(0, this.maxComb)][calc.randomInt(0, 5)],
				});
				var x = width*i;
				var y = height*k;
				shape.clip.position = [x, y];
				this.shapes.push(shape);
				this.group.addChild(shape.clip);
			}
		}
		this.group.pivot = [this.group.bounds.width/2-radius/2, this.group.bounds.height/2-radius/2];
		this.counter = 0;
		this.move();
	}
	update(){
		TWEEN.update();
		for (var i = 0; i < this.shapes.length; i++) {
			this.shapes[i].update();
		}
	}
	move(){
		var combIndex = calc.randomInt(0, this.maxComb);
		for (var i = 0; i < this.shapes.length; i++) {
			this.shapes[i].moveTo({
				destination: this.combinations[combIndex][i],
				duration: calc.randomInt(100, 500),
				color: this.colors[calc.randomInt(0, 4)],
			});
		}
		this.counter++;
	}
}
class arcMask2 extends MaskBase {
	//------------------------------------------
	setup() {
		super.addLayer();
		this.name = "arcMask2";
		this.eyeL = new arcGrid2({
			row: 2,
			column: 2,
			radius: 50,
			combination: [
				['br', 'tr', 'bl', 'tl'],
				['tl', 'bl', 'tr', 'br'],
				['empty', 'tr', 'empty', 'tl'],
			],
		});
		this.eyeR = new arcGrid2({
			row: 2,
			column: 2,
			radius: 50,
			combination: [
				['br', 'tr', 'bl', 'tl'],
				['tl', 'bl', 'tr', 'br'],
				['empty', 'tr', 'empty', 'tl'],
			],
		});
		this.nose = new arcGrid2({
			row: 3,
			column: 2,
			radius: 30,
			combination: [
				['tl', 'bl', 'tr', 'tr', 'br', 'tl'],
				['bl', 'br', 'tr', 'br', 'bl', 'tl'],
				['empty', 'tr', 'empty', 'tl'],
			],
		});
		this.mouth = new arcGrid2({
			row: 1,
			column: 2,
			radius: 50,
			combination: [
				['br', 'bl',],
				['tr', 'tl',],
				['empty', 'tr'],
			],
		});
		this.browL = new arcGrid2({
			row: 1,
			column: 1,
			radius: 50,
			combination: [
				['br'],
				['bl'],
				['tl'],
				['tr'],
			],
		});
		this.browR = new arcGrid2({
			row: 1,
			column: 1,
			radius: 50,
			combination: [
				['br'],
				['bl'],
				['tl'],
				['tr'],
			],
		});
		this.earL = new arcGrid2({
			row: 6,
			column: 1,
			radius: 50,
			combination: [
				['bl', 'tl', 'bl', 'tl', 'bl', 'tl',],
				['bl', 'tl', 'empty', 'empty', 'bl', 'tl',],
				['br', 'tr', 'br', 'tr', 'br', 'tr'],
				['bl', 'tr', 'br', 'tl', 'bl', 'tr'],
			],
		});
		this.earR = new arcGrid2({
			row: 6,
			column: 1,
			radius: 50,
			combination: [
				['br', 'tr', 'br', 'tr', 'br', 'tr'],
				['bl', 'tl', 'empty', 'empty', 'bl', 'tl',],
				['bl', 'tl', 'bl', 'tl', 'bl', 'tl',],
				['bl', 'tr', 'br', 'tl', 'bl', 'tr'],
			],
		});
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
		var cheekR = data['faceParts']['cheekR'];
		var browL = data['faceParts']['browL'];
		var browR = data['faceParts']['browR'];
		var lipUpper = data['faceParts']['lipUpper'];
		var lipLower = data['faceParts']['lipLower'];

		this.eyeL.update(data);
		this.eyeL.group.position = eyeL.position;

		this.eyeR.update(data);
		this.eyeR.group.position = eyeR.position;

		this.nose.update(data);
		this.nose.group.position = nose.position.add([0, -50]);

		this.mouth.update(data);
		this.mouth.group.position = mouth.position.add([0, 0]);

		this.earL.update(data);
		this.earL.group.position = earL.position.add([0, 0]);
		
		this.earR.update(data);
		this.earR.group.position = earR.position.add([0, 0]);

		this.browL.update(data);
		this.browL.group.position = browL.position.add([0, -100]);
		
		this.browR.update(data);
		this.browR.group.position = browR.position.add([0, -100]);

		if(head.velocity.length > calc.random(4.1, 4.8)){
			this.eyeL.move();
			this.eyeR.move();
			this.nose.move();
			this.mouth.move();
			this.earL.move();
			this.earR.move();
			this.browR.move();
			this.browL.move();
		}
	}

	show() {
		this.showLayer();
	}

	hide() {
		this.hideLayer();
	}
}