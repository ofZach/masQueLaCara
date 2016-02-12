'use strict';
class DropShape{
	constructor(){
		this.hadleLength = 60;



		this.start = new paper.Point(0, 0);
		this.end = new paper.Point(0, -200);

		this.colorStart = '#87d0a1';
		this.colorEnd = '#ea4a73'
		this.gradPointStartOffset = new paper.Point(0, 0);
		this.gradPointEndOffset = new paper.Point(0, 0);

		this.colorStartAlpha = 0.8;
		this.colorEndAlpha = 0.0;
	}
	make(reverse){

		this.upRight = new paper.Point(this.hadleLength, -this.hadleLength);
		this.upLeft = new paper.Point(-this.hadleLength, -this.hadleLength);
		this.downLeft = new paper.Point(-this.hadleLength, this.hadleLength);
		this.downRight = new paper.Point(this.hadleLength, this.hadleLength);
		this.up = new paper.Point(0, -this.hadleLength);
		this.down = new paper.Point(0, this.hadleLength);
		this.left = new paper.Point(-this.hadleLength, 0);
		this.right = new paper.Point(this.hadleLength, 0);
		if(reverse){
			this.firstSegment = new paper.Segment(this.start, this.right, this.left);
			this.secondSegment = new paper.Segment(this.end, this.upLeft, this.upRight);
		}else{
			this.firstSegment = new paper.Segment(this.end, this.upLeft, this.upRight );
			this.secondSegment = new paper.Segment(this.start, this.right, this.left);
		}
		
		this.firstSegment.handleIn.angle = this.firstSegment.handleIn.angle + this.end.angle - 90;
		this.firstSegment.handleOut.angle = this.firstSegment.handleOut.angle + this.end.angle -90;
		this.secondSegment.handleIn.angle = this.secondSegment.handleIn.angle + this.end.angle - 90;
		this.secondSegment.handleOut.angle = this.secondSegment.handleOut.angle + this.end.angle -90;
		
		this.gradPointStart = this.start;
		this.gradPointEnd = this.end;
		// this.firstSegment.
		this.path = new paper.Path(this.firstSegment, this.secondSegment);
		this.path.fillColor = {
			gradient: {
		   		stops: [this.colorStart,this.colorEnd]
			},
			origin: this.gradPointStart,
			destination: this.gradPointEnd,
		}
		this.path.fullySelected = true;
		this.path.fillColor.gradient.stops[0].color.alpha = this.colorStartAlpha;
		this.path.fillColor.gradient.stops[1].color.alpha = this.colorEndAlpha;
		this.path.closed = true;
	}
}
class head{
	constructor(){
		this.headGroup = new paper.Group();
		this.headGroup.transformContent = false;
		this.headGroup.pivot = [0, 0];

		var circleRadius = 3;
		this.shapesGroup = new paper.Group();
		this.shapesGroup.transformContent = false;
		this.shapesGroup.pivot = [0, 0];

		var dropShape = new DropShape();
		dropShape.start = new paper.Point(-100, 0);
		dropShape.end = new paper.Point(0, 0);
		dropShape.make(true);

		var dropShape2 = new DropShape();
		dropShape2.start = new paper.Point(0, 0);
		dropShape2.end = new paper.Point(100, 0);
		dropShape2.make(true);

		this.headGroup.addChild(dropShape.path);
		this.headGroup.addChild(dropShape2.path);
		// path.fullySelected = true;
		// 0
		this.spring = new Fx.Spring({
            'stiffness': 100,
            'friction': 5,
            // 'onMotion': function(t){console.log("t = " + t);}
         });

	}
	update(d, name){
		this.spring.start(this.spring.get(), d['faceParts'][name]['velocity'].length);
		this.headGroup.position = d['faceParts'][name]['position'];
		for (var i = 0; i < this.headGroup.children.length; i++) {
			// this.eyeGroup.children[i].segments[0].handleIn.angle = this.spring.get()*6-70;
			// this.eyeGroup.children[i].segments[1].handleIn.angle = this.spring.get()*10-90;
			// this.eyeGroup.children[i].segments[0].point.y = this.spring.get()*10+10;
			// this.eyeGroup.children[i].segments[0].handleOut.angle = this.spring.get()*20+100;
		};
		// this.eyeGroup.rotation = this.spring.get()*2;
		// this.eyeGroup.children[0].segments[0].handleIn.angle = this.spring.get()*20;
	}
}
class gradientMask extends MaskBase{
	setup(){
		super.addLayer();
		this.name = 'gradientMask';
		this.head = new head();
	}
	update(d){

		this.head.update(d, 'head');

	}
	show(){
		this.showLayer();
	}
	hide(){
		this.hideLayer();
	}

}