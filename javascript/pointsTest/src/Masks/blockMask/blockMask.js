'use strict';
class blockSVG {
	constructor(d){
		this.name = calc.randomInt(0, 20);
		this.offset = d.offset;
		this.group = new paper.Group({transformContent: false});
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
		this.tween.easing(TWEEN.Easing.Elastic.Out);
		this.tweenColor.easing(TWEEN.Easing.Quadratic.InOut);
		paper.project.importSVG(d.path, function(item) {
            self.group.addChild(item.children[0]);
            self.group.pivot = [self.group.bounds.width/2, self.group.bounds.height/2];
            var width = self.group.bounds.width;
            var height = self.group.bounds.height;
            var clipPath = new paper.Path.Rectangle({
            	from:[0,0],
            	to: [width/2, height/2],
            	fillColor: 'white',
            })
            self.location.tl = { x: 0, y: 0,};
            self.location.tr = { x: width/2, y: 0,};
            self.location.bl = { x: 0, y: height/2,};
            self.location.br = { x: width/2, y: height/2,};
            self.location.empty = { x: width, y: 0,};
            self.group.position = self.location[d.location];
            this.prevLocation = self.location[d.location];
            self.clip.addChild(clipPath);
            self.clip.addChild(self.group);
            self.clip.clipped = true;
            this.loaded = true;
            // self.moveTo(d);
        });
		// this.tween.start();
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
		if(this.group.children[0] != undefined){
			if(this.move){
				var c = this.color;
				this.group.children[0].fillColor = new Color(c.r, c.g, c.b, 1);
				this.group.position = [this.curPos.x, this.curPos.y];
			}
		}
	}
}
class blockEye{
		constructor(d){
		this.shapes = [];
		this.rightComb = d.combination;
		var width = 65.217;
		var height = 37.3285;
		this.colors = [
			{r: 116/255, g:91/255, b: 153/255},
			{r: 207/255, g:177/255, b: 124/255},
			{r: 231/255, g:1/255, b: 69/255},
			{r: 0/255, g:156/255, b: 147/255}
		];
		this.group = new paper.Group({
			transformContent: false,
			pivot: [width, height],
		})
		for (var i = 0; i < d.column; i++) {
			for (var k = 0; k < d.row ; k++) {
				var shape = new blockSVG({
					path: 'assets/svg/blockMask/halfShape.svg',
					location: this.rightComb[calc.randomInt(0, 5)],
					destination: this.rightComb[calc.randomInt(0, 5)],
				});
				shape.clip.position = [width*i, height*k];
				this.shapes.push(shape);
				this.group.addChild(shape.clip);
			}
		}
		this.counter = 0;
	}
	update(){
		TWEEN.update();
		for (var i = 0; i < this.shapes.length; i++) {
			this.shapes[i].update();
		}
	}
	move(){
		if(this.counter % 2 == 0){
			for (var i = 0; i < this.shapes.length; i++) {
				this.shapes[i].moveTo({
					destination: this.rightComb[calc.randomInt(0, 5)],
					duration: calc.randomInt(500, 1000),
					color: this.colors[calc.randomInt(0, 4)],
				});
			}
		}else{
			for (var i = 0; i < this.shapes.length; i++) {
				this.shapes[i].moveTo({
					destination: this.rightComb[i],
					duration: calc.randomInt(500, 1000),
					color: this.colors[calc.randomInt(0, 4)],
				});
			}
		}
		this.counter++;
	}
}
class blockMask extends MaskBase {
// bezierCurveTo(0,-72,155,-79,155,0);
//				(point0)
	//------------------------------------------
	setup() {
		super.addLayer();
		this.name = "blockMask";
		this.eyeL = new blockEye({
			row: 2,
			column: 2,
			// loop start down to row then to column, 
			// center of the shape: br - bottomRight tr - topRight etc. 'empty' just for variations
			combination: ['br', 'tr', 'bl', 'tl', 'empty'],
		});
		this.eyeR = new blockEye({
			row: 2,
			column: 2,
			combination: ['br', 'tr', 'bl', 'tl', 'empty'],
		});
		this.nose = new blockEye({
			row: 2,
			column: 1,
			combination: ['br', 'tr', 'bl', 'tl', 'empty'],
		});
		this.mouth = new blockEye({
			row: 1,
			column: 2,
			combination: ['tr', 'tl', 'bl', 'br', 'empty'],
		});
		this.browL = new blockEye({
			row: 1,
			column: 1,
			combination: ['br', 'bl', 'tl', 'tr', 'empty'],
		});
		this.browR = new blockEye({
			row: 1,
			column: 1,
			combination: ['bl', 'bl', 'tl', 'tr', 'empty'],
		});
		this.nose.group.rotation = -90;
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

		this.eyeL.update();
		this.eyeL.group.position = eyeL.position;

		this.eyeR.update();
		this.eyeR.group.position = eyeR.position;

		this.nose.update();
		this.nose.group.position = nose.position.add([0, -30]);

		this.mouth.update();
		this.mouth.group.position = mouth.position.add([0, 20]);

		this.browL.update();
		this.browL.group.position = browL.position.add([20, -20]);

		this.browR.update();
		this.browR.group.position = browR.position.add([20, -20]);

		if(head.velocity.length > calc.random(3.1, 4.8)){
			this.eyeL.move();
			this.eyeR.move();
			this.nose.move();
			this.mouth.move();
			this.browL.move();
			this.browR.move();
		}
	}

	show() {
		this.showLayer();
	}

	hide() {
		this.hideLayer();
	}
}