function StrokeFace() {};
StrokeFace.prototype = Object.create(SvgMask.prototype);
StrokeFace.prototype.setup = function() {
	var data = {
		eyeL: 'assets/StrokeFaceEye.svg',
		eyeR:'assets/StrokeFaceEye.svg',
		mouth:'assets/StrokeFaceMouth.svg',
		nose: 'assets/StrokeFaceNose.svg'
	};
	this.setupGroup(data);
	this.nose.pivot = new paper.Point(19, 232);
};

function StrokeFace2() {};
StrokeFace2.prototype = Object.create(SvgMask.prototype);
StrokeFace2.prototype.setup = function() {
	var data = {
		eyeL: 'assets/StrokeFaceEye.svg',
		eyeR:'assets/StrokeFaceEye.svg',
		mouth:'assets/StrokeFaceMouth.svg',
		nose: 'assets/StrokeFaceNose2.svg'
	};
	this.setupGroup(data);
	this.nose.pivot = new paper.Point(135, 233);
};

function StrokeFace3() {};
StrokeFace3.prototype = Object.create(SvgMask.prototype);
StrokeFace3.prototype.setup = function() {
	var data = {
		eyeL: 'assets/StrokeFaceEye.svg',
		eyeR:'assets/StrokeFaceEye.svg',
		mouth:'assets/StrokeFaceMouth.svg',
		nose: 'assets/StrokeFaceNose3.svg'
	};
	this.setupGroup(data);
	this.nose.pivot = new paper.Point(138, 204);
};

function CircleFace() {};
CircleFace.prototype = Object.create(SvgMask.prototype);
CircleFace.prototype.setup = function() {
	var data = {
		eyeL: 'assets/CircleFaceEye.svg',
		eyeR:'assets/CircleFaceEye.svg',
		mouth:'assets/CircleFaceMouth.svg',
		nose: 'assets/CircleFaceNose.svg'
	};
	this.setupGroup(data);
	this.nose.pivot = new paper.Point(120, 156);
};

function SquareElephant() {};
SquareElephant.prototype = Object.create(SvgMask.prototype);
SquareElephant.prototype.setup = function() {
	var data = {
		eyeL: 'assets/SquareElephantEye.svg',
		eyeR:'assets/SquareElephantEye.svg',
		nose: 'assets/SquareElephantNose.svg'
	};
	this.setupGroup(data);
	this.nose.pivot = new paper.Point(171, 300);
};

function Egypt() {};
Egypt.prototype = Object.create(SvgMask.prototype);
Egypt.prototype.setup = function() {
	var data = {
		eyeL: 'assets/EgyptEye.svg',
		eyeR:'assets/EgyptEye.svg',
		nose: 'assets/EgyptNose.svg'
	};
	this.setupGroup(data);
	this.nose.pivot = new paper.Point(397, 578);
};

function FadeFace() {};
FadeFace.prototype = Object.create(SvgMask.prototype);
FadeFace.prototype.setup = function() {
	var data = {
		eyeL: 'assets/FadeFaceEye.svg',
		eyeR:'assets/FadeFaceEye.svg',
		mouth:'assets/FadeFaceMouth.svg',
		nose: 'assets/FadeFaceNose.svg'
	};
	this.setupGroup(data);
	this.nose.pivot = new paper.Point(114, 295);
};









