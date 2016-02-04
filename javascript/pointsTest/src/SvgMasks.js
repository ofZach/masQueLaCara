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
	this.noseOffset.y = -50;
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
	this.noseOffset.y = -150;
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
	this.noseOffset.y = -150;
};

function CircleFace() {};
CircleFace.prototype = Object.create(SvgMask.prototype);
CircleFace.prototype.setup = function() {
	var data = {
		eyeL: 'assets/CircleFaceEye.svg',
		eyeR:'assets/CircleFaceEye.svg',
		mouth:'',
		nose: 'assets/CircleFaceNose.svg'
	};
	this.setupGroup(data);
	this.noseOffset.y = -80;
};

function SquareElephant() {};
SquareElephant.prototype = Object.create(SvgMask.prototype);
SquareElephant.prototype.setup = function() {
	var data = {
		eyeL: 'assets/SquareElephantEye.svg',
		eyeR:'assets/SquareElephantEye.svg',
		mouth:'assets/SquareElephantMouth.svg',
		nose: 'assets/SquareElephantNose.svg'
	};
	this.setupGroup(data);
	this.noseOffset.y = -50;
};

function Egypt() {};
Egypt.prototype = Object.create(SvgMask.prototype);
Egypt.prototype.setup = function() {
	var data = {
		eyeL: 'assets/EgyptEye.svg',
		eyeR:'assets/EgyptEye.svg',
		mouth:'',
		nose: 'assets/EgyptNose.svg'
	};
	this.setupGroup(data);
	this.noseOffset.y = -250;
};









