var mask1 = Object.create(maskBase);
mask1.print = function () {
	maskBase.print.call(this);
}
mask1.setup = function () {
	console.log("mask1 setup");
	this.layer = new paper.Layer();
	this.eyeL = new Eye("white");
	this.eyeR = new Eye("magenta");
	this.layer.visible = false;
}
mask1.setVisible = function (value) {
	this.layer.visible = value;
}
mask1.getGroup = function () {
	return this.eyeL.getGroup();
}
mask1.attachToMask  = function (){
	var groups = {
		"eyeL": this.eyeL.getGroup(),
		"eyeR": this.eyeR.getGroup(),		
	};
	maskBase.attachToMask.call(this, groups);
}
mask1.update = function () {
    this.eyeL.update();
}

var mask2 = Object.create(maskBase);
mask2.print = function () {
	maskBase.print.call(this);
}
mask2.setup = function () {
	console.log("mask2 setup");
	this.layer = new paper.Layer();
	this.eyeL = new Eye("green");
	this.layer.visible = false;
}
mask2.setVisible = function (value) {
	this.layer.visible = value;
}
mask2.getGroup = function () {
	return this.eyeL.getGroup();
}
mask2.attachToMask  = function (){
	var groups = {
		"eyeL": this.eyeL.getGroup(),
	};
	maskBase.attachToMask.call(this, groups);
}
mask2.update = function () {

}
