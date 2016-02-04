var Eye = function(color){
	var circle1 = new paper.Path.Circle(new paper.Point(0, 0), 30);
	var circle2 = new paper.Path.Circle(new paper.Point(0, 0), 10);
	var circle3 = new paper.Path.Circle(new paper.Point(0, 0), 5);

	this.eyeGroup = new paper.Group();

	this.eyeGroup.addChild(circle1);
	this.eyeGroup.addChild(circle2);
	this.eyeGroup.addChild(circle3);
	
	this.eyeGroup.children[0].fillColor = color;
	this.eyeGroup.children[1].fillColor = 'red';
	this.eyeGroup.children[2].fillColor = 'blue';

	this.eyeGroup.pivot = new paper.Point(0,0);
	this.eyeGroup.transformContent = false;

	this.parameters = {
		radius: 10,
	};
};
Eye.prototype.getParameters = function(){
	return this.parameters;
}
Eye.prototype.setParameter = function(name , value){
	console.log("setParameter");
	this.parameters[name] = value;
	this.eyeGroup.children[1].position.y = value;
}
Eye.prototype.getGroup = function() {
	return this.eyeGroup;
};
Eye.prototype.update = function(position) {
	this.eyeGroup.position = position;
    this.eyeGroup.children[1].position.x = Math.cos(frame/6)*10;
    // this.eyeGroup.children[1].position.y = Math.sin(frame/7)*this.parameters["radius"];
    this.eyeGroup.children[2].scaling = Math.sin(frame/4)*1.9+2.5;
};