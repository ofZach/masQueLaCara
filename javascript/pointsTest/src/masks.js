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
	var self = this;
	parameters.addRange("radius", 0, 200,  this.eyeL.getParameters()["radius"], 1, function(value) {
        self.eyeL.setParameter("radius", value);
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
	var self = this;
	parameters.addRange("radius", 0, 200,  this.eyeL.getParameters()["radius"], 1, function(value) {
        self.eyeL.setParameter("radius", value);
    });
	parameters.addRange("circleSpeedX", 0, 20,  this.eyeL.getParameters()["circleSpeedX"], 1, function(value) {
        self.eyeL.setParameter("circleSpeedX", value);
    });
	parameters.addRange("circleSpeedY", 0, 20,  this.eyeL.getParameters()["circleSpeedY"], 1, function(value) {
        self.eyeL.setParameter("circleSpeedY", value);
    });
	parameters.addRange("circleDistance", 0, 200,  this.eyeL.getParameters()["circleDistance"], 1, function(value) {
        self.eyeL.setParameter("circleDistance", value);
    });
};

Mask2.prototype.clearParameters = function(parameters) {
	parameters.removeControl("radius");
	parameters.removeControl("circleSpeedX");
	parameters.removeControl("circleSpeedY");
	parameters.removeControl("circleDistance");

	// or (var prop in obj) {
 //        // skip loop if the property is from prototype
 //        if(!obj.hasOwnProperty(prop)) continue;

 //        // your code
 //        alert(prop + " = " + obj[prop]);
 //    }
};
