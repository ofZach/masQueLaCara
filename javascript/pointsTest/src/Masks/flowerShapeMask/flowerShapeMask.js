'use strict';

class petal{
	constructor(d){
		this.group = new paper.Group();
		this.group.transformContent = false;
		this.shape = new paper.Path.Circle({
			center: [0, 0],
			radius: 20,
		});
		this.shape.removeSegment(0);
		this.shape.removeSegment(1);
		this.pos = [this.shape.segments[0].point,this.shape.segments[1].point]
		this.shape.fillColor = {
			gradient: {
				stops: ['#87d0a1', '#ea4a73']
			},
			origin: this.pos[0],
			destination: this.pos[1],
		}
		// this.shape.bounds.selected = true;
		// this.shape.fullySelected = true;
		this.shape.fillColor.gradient.stops[1].color.alpha = 0.2;
		this.shape.fillColor.gradient.stops[0].color.alpha = 1.7;
		this.shape.segments[0].handleIn.length = d.length;
		this.shape.segments[0].handleOut.length = d.length;
		this.shape.segments[1].handleIn.length = d.length;
		this.shape.segments[1].handleOut.length = d.length;
		this.group.addChild(this.shape);
		this.group.pivot = [d.offset[0], this.shape.bounds.height/2+d.offset[1]];
		this.counter = 0;
		this.radius = d.radius;
		this.angleRange = d.angleRange;
		this.angleRangeH = d.angleRangeH;
		this.angleOffset = d.angleOffset;
		this.speed = d.speed;
		this.isOsc = d.isOsc;
		this.angle;
		this.angleH;
	}
	rad(degrees) {
  		return degrees * Math.PI / 180;
	}
	update(d){
		this.group.position = d.position;
		var radius = this.radius;
		var angleRange = this.angleRange;
		var angleRangeH = this.angleRangeH; // for handles
		var angleOffset = this.angleOffset;
		var speed = this.speed;
		var angle;
		var angleH;
		if(this.isOsc){
			angle = Math.cos(this.counter/speed)*angleRange+angleOffset;
			angleH = Math.cos(this.counter/speed)*angleRangeH+angleOffset;
		}else{
			angle = this.angle;
			angleH = this.angleH;
		}
		this.pos[0].x = this.pos[1].x + Math.cos(this.rad(angle))*radius;
		this.pos[0].y = this.pos[1].y + Math.sin(this.rad(angle))*radius;
		this.shape.segments[0].point = this.pos[0];
		this.shape.segments[0].handleIn.angle = angleH+200;
		this.shape.segments[0].handleOut.angle = angleH+150;
		this.shape.segments[1].handleIn.angle = angleOffset+90;
		this.shape.segments[1].handleOut.angle = angleOffset-90;
		this.shape.fillColor.origin = this.pos[0];
		this.counter++;
	}	
}
class flowerShapeMask extends MaskBase {
	//------------------------------------------
	setup() {
		super.addLayer();
		this.name = "flowerShapeMask"
		this.eyeL = new petal({
			length: 130, 
			radius: 270, 
			offset: [50, 0],
			angleRange: 45, 
			angleRangeH: 100, 
			angleOffset: 0, 
			speed: 16,
			isOsc: true, 
		})
		this.eyeR = new petal({
			length: 130, // hadle length
			radius: 270, 
			offset: [-50, 0],
			angleRange: 45, // pendulum
			angleRangeH: 100, // for handles
			angleOffset: 180, // rotation
			speed: 16,
			isOsc: true, // auto rotation
		})
		this.head = new petal({
			length: 400,
			radius: 600,
			offset: [0, -120],
			angleRange: 45,
			angleRangeH: 100,
			angleOffset: -90,
			speed: 20,
			isOsc: true,
		})
		this.angle = 0;
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
		this.angle = this.smooth(this.angle, head.angle, 0.95);
		this.eyeL.update(eyeL);
		this.eyeL.angleRange = this.angle*500;
		this.eyeL.angleRangeH = this.angle*1000;

		this.eyeR.update(eyeR);
		this.eyeR.angleRange = this.angle*500;
		this.eyeR.angleRangeH = this.angle*1000;
		
		this.head.update(head);
		this.head.angleRange = this.angle*500;
		this.head.angleRangeH = this.angle*1000;
		// data contains face data, see dataPlayer.js, ie face parts data['faceParts']['eyeL']['position'] as well as face points, etc...
	}
	show() {
		this.showLayer();
	}
	hide() {
		this.hideLayer();
	}
}