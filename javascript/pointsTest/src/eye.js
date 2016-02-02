var Eye = function(){
	var circle1 = new paper.Path.Circle(new paper.Point(0, 0), 30);
	var circle2 = new paper.Path.Circle(new paper.Point(0, 0), 10);
	var circle3 = new paper.Path.Circle(new paper.Point(0, 0), 5);

	this.groupEyeL = new paper.Group();

	this.groupEyeL.addChild(circle1);
	this.groupEyeL.addChild(circle2);
	this.groupEyeL.addChild(circle3);
	
	this.groupEyeL.children[0].fillColor = 'white';
	this.groupEyeL.children[1].fillColor = 'red';
	this.groupEyeL.children[2].fillColor = 'blue';

	this.groupEyeL.transformContent = false;
	this.groupEyeL.pivot = new paper.Point(0,0);
//	this.groupEyeL.pivot.x = 100;/
//	this.groupEyeL.pivot.y = 100;
};
Eye.prototype.update = function(posX, posY) {
	this.groupEyeL.position.x = posX;
    this.groupEyeL.position.y = posY+200;
    this.groupEyeL.scaling = 1.5;
    this.groupEyeL.children[1].position.x = Math.cos(frame/6)*10;
    this.groupEyeL.children[1].position.y = Math.sin(frame/7)*30;
    this.groupEyeL.children[2].scaling = Math.sin(frame/4)*1.9+2.5;
};