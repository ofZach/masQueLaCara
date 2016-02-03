var mask1 = Object.create(maskBase);
mask1.print = function () {
	maskBase.print.call(this);
}
mask1.setup = function () {
	console.log("mask1 setup");
	this.layer = new paper.Layer();
	this.eyeL = new Eye("white");
	this.layer.visible = false;
}
mask1.setVisible = function (value) {
	this.layer.visible = value;
}
mask1.getGroup = function () {
	return this.eyeL.getGroup();
}
mask1.attachToLeftEye  = function (){
	maskBase.attachToLeftEye.call(this, this.eyeL.getGroup());
}
mask1.update = function () {

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
mask2.attachToLeftEye  = function (){
	maskBase.attachToLeftEye.call(this, this.eyeL.getGroup());
}
mask2.update = function () {

}
