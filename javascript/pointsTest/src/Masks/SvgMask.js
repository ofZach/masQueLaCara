function SvgMask() {}
SvgMask.prototype = Object.create(MaskBase.prototype);

SvgMask.prototype.setupGroup = function(data) {
	this.addLayer();
	this.color = "white";
	this.mouth = new paper.Group();
	this.eyeL = new paper.Group();
	this.eyeR = new paper.Group();
	this.nose = new paper.Group();
	
	this.noseOffset = new paper.Point(0, 0);

	this.eyeL.transformContent = false;
	this.eyeR.transformContent = false;
	this.mouth.transformContent = false;
	this.nose.transformContent = false;

	this.loadData(data);

	this.nose.pivot = new paper.Point(0, 0);
};
SvgMask.prototype.loadData = function(data){
	var self = this;

	paper.project.importSVG(data['eyeL'], function(item){
		
		self.eyeL.addChild(item);
	});

	paper.project.importSVG(data['eyeR'], function(item){
		
		self.eyeR.addChild(item);
	});
	paper.project.importSVG(data['mouth'], function(item){
		
		self.mouth.addChild(item);
	});
	paper.project.importSVG(data['nose'], function(item){
		
		self.nose.addChild(item);
	});
} 
SvgMask.prototype.update = function(obj) {
	if (typeof this.eyeL !== "undefined"){
        this.eyeL.position = obj["leftEye"];
        this.eyeL.rotation = obj["leftEyeAngle"]* (180.0 / Math.PI);
    }
   	if (typeof this.eyeR !== "undefined"){
        this.eyeR.position = obj["rightEye"];
        this.eyeR.rotation = obj["rightEyeAngle"]* (180.0 / Math.PI);
    }
   	if (typeof this.nose !== "undefined"){
   		var pos = new paper.Point(obj["nose"].x+this.noseOffset.x, obj["nose"].y+this.noseOffset.y);
        this.nose.position = pos;
   		this.nose.rotation = obj["noseAngle"]* (180.0 / Math.PI);
    }
   	if (typeof this.mouth !== "undefined"){
        this.mouth.position = obj["mouth"];
   		this.mouth.rotation = obj["mouthAngle"]* (180.0 / Math.PI);
    }
};
SvgMask.prototype.addParameters = function(parameters) {
	var self = this;
	parameters.addRange("noseOffsetY", -300, 300, this.noseOffset.y, 1, function(value) {
        self.noseOffset.y = value;
    });
   	parameters.addRange("nosePivotX", -300, 1000, this.nose.pivot.x, 1, function(value) {
        self.nose.pivot.x = value;
    });
   	parameters.addRange("nosePivotY", -300, 1000, this.nose.pivot.y, 1, function(value) {
        self.nose.pivot.y = value;
    });
};
SvgMask.prototype.clearParameters = function(parameters) {
	parameters.removeControl("noseOffsetY");
	parameters.removeControl("nosePivotX");
	parameters.removeControl("nosePivotY");
};