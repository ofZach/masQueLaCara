function Mask1() {}
Mask1.prototype = Object.create(MaskBase.prototype);

Mask1.prototype.setup = function() {
	this.addLayer();
	this.eyeL = new Eye("white");
	this.eyeR = new Eye("magenta");
};
Mask1.prototype.update = function(obj) {
    this.eyeL.update(obj["leftEye"]);
    this.eyeR.update(obj["rightEye"]);
};

function Mask2() {}
Mask2.prototype = Object.create(MaskBase.prototype);
Mask2.prototype.setup = function() {
	this.addLayer();
	this.eyeL = new Eye("blue");
	this.eyeR = new Eye("white");
};
Mask2.prototype.update = function(obj) {
    this.eyeL.update(obj["leftEye"]);
    this.eyeR.update(obj["rightEye"]);
};

