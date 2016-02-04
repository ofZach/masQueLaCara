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
Mask1.prototype.addParameters = function(parameters) {
	var eyeL = this.eyeL;
	parameters.addRange("radius", 0, 10,  this.eyeL.getParameters()["radius"], 1, function(value) {
        eyeL.setParameter("radius", value);
    });
};

Mask1.prototype.clearParameters = function(parameters) {
	parameters.removeControl("radius");
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
Mask2.prototype.addParameters = function(parameters) {
	var eyeL = this.eyeL;
	parameters.addRange("radius", 0, 10,  this.eyeL.getParameters()["radius"], 1, function(value) {
        eyeL.setParameter("radius", value);
    });
};

Mask2.prototype.clearParameters = function(parameters) {
	parameters.removeControl("radius");
};
