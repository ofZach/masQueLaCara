var maskManager = {
	masks: {},
	currentMask: "mask1",
	currentMaskNum: 0,
	names: ["mask1", "mask2"]
};
// add all existing masks to `masks`
// TODO: make function for creating new mask, because now this masks are global objects which is not useful
maskManager.setup = function () {
	this.masks[this.names[0]] = new Mask1();
	this.masks[this.names[1]] = new Mask1();
	this.masks[this.names[0]].addLayer();
	this.masks[this.names[1]].addLayer();
	this.masks[this.names[0]].setup();
	this.masks[this.names[1]].setup();
};
maskManager.update = function (obj) {
	this.masks[this.getCurMaskName()].update(obj);
};
maskManager.getCurMask = function () {
	return this.masks[this.getCurMaskName()];
};
maskManager.getCurMaskName = function(){
	return this.names[this.currentMaskNum];
};
maskManager.nextMask = function(){
	this.masks[this.getCurMaskName()].hide();

	this.currentMaskNum++;
	if(this.currentMaskNum > this.names.length-1){
		this.currentMaskNum = 0;
	} 

	this.masks[this.getCurMaskName()].show();

	console.log("currentMaskNum = " + this.getCurMaskName());
};