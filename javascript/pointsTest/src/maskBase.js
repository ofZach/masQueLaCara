var maskBase = {
	// any var which should be copied with children
    isMoving: true, 
    counter: 0,
};
// this is static data
maskBase.print = function(){
	console.log(this.counter);
}
maskBase.setup = function(){
	this.leftEyeGroup = new paper.Group();
	this.rightEyeGroup = new paper.Group();
}
// subscribe any mask to Group, group will have a position, rotation and scale
maskBase.attachToMask = function(groups){
	this.detachAll();
	if(groups["eyeL"] != null){
		this.leftEyeGroup.addChild(groups["eyeL"]);
	}
	if(groups["eyeR"] != null){
		this.rightEyeGroup.addChild(groups["eyeR"]);
	}
}
maskBase.detachAll = function(){
	this.leftEyeGroup.removeChildren();
	this.rightEyeGroup.removeChildren();
}
maskBase.update = function (obj) {
	this.counter++;
	this.leftEyeGroup.position = obj['leftEye'];
	this.rightEyeGroup.position = obj['rightEye'];
}