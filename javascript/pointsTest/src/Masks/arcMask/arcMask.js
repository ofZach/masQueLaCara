'use strict';
paper.install(window);
class arc {
	constructor(d){
		this.name = calc.randomInt(0, 20);
		this.clipPos = d.pos;
		this.offset = d.offset;
		this.clip = new Group({transformContent: false, pivot: [0, 0]});
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
		this.circle = new Path.Circle({
			center: [d.radius,d.radius],
			radius: d.radius,
		});
		this.rect = new Path.Rectangle({
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
			this.circle.fillColor = new Color(c.r, c.g, c.b, 1);
			this.circle.position = [this.curPos.x, this.curPos.y];
		}
	}
}

class arcGrid {
	constructor(d){
		this.shapes = [];
		this.rightComb = d.combination;

		var radius = 50;
		var width = radius;
		var height = radius;
		var offset = [380, 200];
		this.colors = [
			{r: 116/255, g:91/255, b: 153/255},
			{r: 207/255, g:177/255, b: 124/255},
			{r: 231/255, g:1/255, b: 69/255},
			{r: 0/255, g:156/255, b: 147/255}
		];
		this.group = new Group({
			transformContent: false,
			pivot: [width/2, height/2],
		})
		this.pos = [];
		for (var i = 0; i < d.column; i++) {
			for (var k = 0; k < d.row ; k++) {
				

				// var arcCircle = new Path.Circle({
				// 	center: [0,0],
				// 	radius: 10,
				// 	fillColor: 'white',
				// });	
				// arcCircle.position = [i*20, k*20];
				// this.group.addChild(arcCircle);	

				// var path =  arcCircle.symbol.place();
				var shape = new arc({
					radius: radius,
					location: this.rightComb[calc.randomInt(0, 5)],
					destination: this.rightComb[calc.randomInt(0, 5)],
				});
				var x = width*i + offset[0];
				var y = height*k + offset[1];
				shape.clip.position = [x-radius/2, y-radius/2];
				this.pos.push(new Point(x, y));
				this.shapes.push(shape);
				this.group.addChild(shape.clip);
			}
		}
		this.counter = 0;
	}
	update(data){
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
		TWEEN.update();

		for (var i = 0; i < this.shapes.length; i++) {
			var dest = 'empty';
			var minDist = 50
			if(this.pos[i].getDistance(eyeL.position) < minDist){
				dest = this.rightComb[calc.randomInt(0, 5)];
			}else if(this.pos[i].getDistance(eyeR.position) < minDist){
				dest = this.rightComb[calc.randomInt(0, 5)];
			}else if(this.pos[i].getDistance(mouth.position) < minDist){
				dest = this.rightComb[calc.randomInt(0, 5)];
			}

			this.shapes[i].moveTo({
					destination: dest,
					duration: calc.randomInt(100, 500),
					color: this.colors[calc.randomInt(0, 4)],
				});
			this.shapes[i].update();
		}
	}
	move(){
		for (var i = 0; i < this.shapes.length; i++) {
			this.shapes[i].moveTo({
				destination: this.rightComb[calc.randomInt(0, 5)],
				duration: calc.randomInt(500, 1000),
				color: this.colors[calc.randomInt(0, 4)],
			});
		}
		this.counter++;
	}
}
class arcMask extends MaskBase {
	//------------------------------------------
	setup() {
		super.addLayer();
		this.name = "arcMask";
		this.eyeL = new arcGrid({
			row: 7,
			column: 8,
			// loop start down to row then to column, 
			// center of the shape: br - bottomRight tr - topRight etc. 'empty' just for variations
			combination: ['br', 'tr', 'bl', 'tl', 'empty'],
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
		// this.eyeL.group.position = [350, 100];
		// if(head.velocity.length > calc.random(3.1, 4.8)){
		// 	this.eyeL.move();
		// }
	}

	show() {
		this.showLayer();
	}

	hide() {
		this.hideLayer();
	}
}