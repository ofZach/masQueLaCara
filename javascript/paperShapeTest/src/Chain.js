'use strict';
class Chain{
	setup(){
		this.rootGroup = new paper.Group();
		var rect1 = new paper.Shape.Rectangle([0, 0], [90, 100]);
		rect1.strokeColor = 'yellow';
		this.rootGroup.addChild(rect1);
		this.rootGroup.transformContent = false;
		this.rootGroup.position = new paper.Point(0, 0);
		this.rootGroup.pivot = new paper.Point(0, 0);
		this.groups = [];
		this.groups.push(this.rootGroup);
		this.curGroupNum = 1;
	}

	addTo(item){
		this.groups.push(new paper.Group());
		this.groups[this.curGroupNum].addChild(item);
	}
	linkGroups(){
		for (var i = this.groups.length-1; i !=1; i--) {
			this.groups[i].pivot = new paper.Point(0, this.groups[i].bounds.height/2);
			this.groups[i].position = new paper.Point(this.groups[i-1].bounds.width, this.groups[i-1].bounds.height/2);

		};
		for (var i = 0; i < this.groups.length-1; i++) {
			this.groups[i].addChild(this.groups[i+1]);
		};
	}
}