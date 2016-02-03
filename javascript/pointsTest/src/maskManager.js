var maskManager = {
	masks: {},
	currentMask: "mask1"
};
// add all existing masks to `masks`
// TODO: make function for creating new mask, because now this masks are global objects which is not useful
maskManager.setup = function () {
	this.masks["mask1"] = mask1;
	this.masks["mask2"] = mask2;
	this.masks["mask1"].setup();
	this.masks["mask2"].setup();
};
maskManager.update = function () {
	this.masks[this.currentMask].update();
};
maskManager.getCurMask = function () {
	return this.masks[this.currentMask];
};
maskManager.attachMask = function () {
	this.masks[this.currentMask].attachToLeftEye();
};
maskManager.nextMask = function(){

};