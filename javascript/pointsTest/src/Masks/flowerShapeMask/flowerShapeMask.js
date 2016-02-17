'use strict';
class petal{
	constructor(d){
		this.group = new paper.Group();
		this.group.transformContent = false;
		this.shape = new paper.Path.Circle({
			center: [0, 0],
			radius: d.radius,
			fillColor: '#ffffff'
		});
		this.shape.removeSegment(0);
		this.shape.removeSegment(1);
		this.shape.fullySelected = true;
		this.group.addChild(this.shape);
		this.group.pivot = [0, 0];
		this.counter = 0;
	}
	update(d){
		this.group.position = d.position;
		this.shape.segments[0].point.x = Math.cos(this.counter/20)*100;
		this.shape.segments[0].point.y = Math.sin(this.counter/20)*100;
		this.counter++;
	}	
}
class flowerShapeMask extends MaskBase {
	//------------------------------------------
	setup() {
		super.addLayer();
		this.name = "flowerShapeMask"
		this.petal = new petal({
			radius: 40,
		})
	}
	//------------------------------------------
	update(data) {
		var head = data['faceParts']['head'];
		var nose = data['faceParts']['nose'];
		var eyeL = data['faceParts']['eyeL'];
		var eyeR = data['faceParts']['eyeR'];
		var mouth = data['faceParts']['mouth'];
		var cheekL = data['faceParts']['cheekL'];
		this.petal.update(head);
		// data contains face data, see dataPlayer.js, ie face parts data['faceParts']['eyeL']['position'] as well as face points, etc...
	}
	show() {
		this.showLayer();
	}
	hide() {
		this.hideLayer();
	}
}