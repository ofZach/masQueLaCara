var maskManager = {
	masks: {},
	currentMask: "mask1",
	currentMaskNum: 0,
	names: ["mask1", "mask2"]
};
// add all existing masks to `masks`
// TODO: make function for creating new mask, because now this masks are global objects which is not useful
maskManager.setup = function () {
	this.masks[this.names[0]] = mask1;
	this.masks[this.names[1]] = mask2;
	this.masks[this.names[0]].setup();
	this.masks[this.names[1]].setup();
};
maskManager.update = function () {
	this.masks[this.getCurMaskName()].update();
};
maskManager.getCurMask = function () {
	return this.masks[this.getCurMaskName()];
};
maskManager.getCurMaskName = function(){
	return this.names[this.currentMaskNum];
};
maskManager.attachMask = function () {
	this.masks[this.getCurMaskName()].attachToLeftEye();
};
maskManager.nextMask = function(){
	this.currentMaskNum++;
	if(this.currentMaskNum > this.names.length-1){
		this.currentMaskNum = 0;
	} 
	this.attachMask();
	console.log("currentMaskNum = " + this.currentMaskNum);
};