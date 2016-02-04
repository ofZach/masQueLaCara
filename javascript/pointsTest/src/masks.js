function Mask1() {}
Mask1.prototype = Object.create(MaskBase.prototype);
Mask1.prototype.setup = function() {
	this.eyeL = new Eye("white");
	this.eyeR = new Eye("magenta");
};
Mask1.prototype.update = function(obj) {
    this.eyeL.update(obj["leftEye"]);
    this.eyeR.update(obj["rightEye"]);
};
// var mask1 = Object.create(maskBase);
// mask1.setup = function () {
// 	this.eyeL = new Eye("white");
// 	this.eyeR = new Eye("magenta");
// }
// mask1.update = function (obj) {
//     this.eyeL.update(obj["leftEye"]);
//     this.eyeR.update(obj["rightEye"]);
// }

// var mask2 = makeMask();
// mask2.setup = function () {
// 	this.eyeL = new Eye("red");
// 	this.eyeR = new Eye("white");
// }
// mask2.getGroup = function () {
// 	return this.eyeL.getGroup();
// }
// mask2.update = function (obj) {
//     this.eyeL.update(obj["leftEye"]);
//     this.eyeR.update(obj["rightEye"]);
// }
