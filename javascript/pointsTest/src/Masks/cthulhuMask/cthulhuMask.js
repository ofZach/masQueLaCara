'use strict';
class gradLine{
	constructor(d){
		this.line = new paper.Path.Line({
			from:[0, 0], 
			to:[0, d.length],
			strokeWidth: d.width,
			strokeColor:{
					   gradient: {
					       stops: [d.startColor, d.endColor]
					   },
					   origin: [0, 0],
					   destination:  [0, d.length],
				},
			transformContent: false,
			pivot: [0, 0],
			strokeCap: 'round',
		});
		this.line.strokeColor.gradient.stops[0].color.alpha = 0;
		this.line.strokeColor.gradient.stops[1].color.alpha = 0.9;

		this.spring = new Fx.Spring({
            'stiffness': d.stiffness, // 1000
            'friction': d.friction,
            // 'threshold': 2033,
            // 'onMotion': function(t){console.log("t = " + t);}
         });
		this.counter = 0;
		this.speed = d.speed;
	}
	update(velocity){
		this.spring.start(this.spring.get(), velocity*2);
		// this.line.scaling = [1, calc.map(this.spring.get(), -20, 20, 0.5, 1.5)];
		var osc = Math.cos(this.counter/this.speed)*0.5+1.5;
		this.line.scaling = [1, osc/2];
		// this.line.rotation = Math.cos(this.counter/this.speed)*10;
		this.counter++;
	}
}
class cthulhuMask extends MaskBase {

	//------------------------------------------
	setup() {
		super.addLayer();
		this.name = "cthulhuMask";
		var width = 37;
		var startColor = 'red';
		var endColor = 'green';
		this.lines = [];
		this.linesInterval = [];
		for (var i = 0; i < 12; i++) {
			var line = new gradLine({
				length: calc.random(100, 500),
				width: width,
				startColor: '#9900ff',
				endColor: '#ea4a73',
				stiffness: calc.random(500, 1000),
				friction: calc.random(10, 15),
				speed: calc.random(10, 30),
			});
			this.linesInterval.push( calc.random(20, 100));
			this.lines.push(line);
		}
		this.rotator1 = new rotator({
			energy: 0.9999,
			scaleFactor: 0.4,
			offset: 0,
		});
		this.head = new tubeCircle({
			innerRadius: 170,
			radius: width,
			count: 2,
		});
		this.head.groupOffset = [0, -100];

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

		this.head.update(data, 'head');
		this.head.group.scaling = head.scale
		this.rotator1.update(data, 'head');
		for (var i = 0; i < this.lines.length; i++) {
			var interval = this.linesInterval[i];
			var angle = calc.deg(head.angle) + interval*i + this.rotator1.rotation;
			var radius = 170*head.scale;
			var linePos = this.lines[i].line.position;
			var centerPoint = head.position.add([0, -100]);
			linePos.x = centerPoint.x + Math.cos(calc.rad(angle))*radius;
			linePos.y = centerPoint.y + Math.sin(calc.rad(angle))*radius;
			this.lines[i].update(head.velocity.length);
		}
		// data contains face data, see dataPlayer.js, ie face parts data['faceParts']['eyeL']['position'] as well as face points, etc...
	}

	show() {
		this.showLayer();
	}

	hide() {
		this.hideLayer();
	}
}