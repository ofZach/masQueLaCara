var maskManager = {
	masks: [
			new StrokeFace(),
			new StrokeFace2(),
			new StrokeFace3(),
			new CircleFace(),
			new SquareElephant(),
			new Egypt(),
			new FadeFace(),
		],
	currentMaskNum: 0,
	names: ["StrokeFace", 
			"StrokeFace2", 
			"StrokeFace3",
			"CircleFace",
			"SquareElephant",
			"Egypt",
			"FadeFace",
			]
};
maskManager.setup = function () {
	for(var i = 0 ; i < this.masks.length; i++){
		this.masks[i].setup();
	}
};
maskManager.update = function (obj) {
	this.masks[this.currentMaskNum].update(obj);
};
maskManager.getCurMask = function () {
	return this.masks[this.currentMaskNum];
};
maskManager.setMaskByName = function (name) {
	index = this.names.indexOf(name.value);
	if (index >= 0){
		this.currentMaskNum = index;
	}
};
maskManager.getCurMaskName = function(){
	return this.names[this.currentMaskNum];
};
maskManager.hideMask = function(settings){
	this.masks[this.currentMaskNum].hide();
	this.masks[this.currentMaskNum].clearParameters(settings);
}
maskManager.showMask = function(settings){
	this.masks[this.currentMaskNum].show();
	this.masks[this.currentMaskNum].addParameters(settings);
}
maskManager.nextMask = function(){
	this.masks[this.currentMaskNum].hide();

	this.currentMaskNum++;
	if(this.currentMaskNum > this.names.length-1){
		this.currentMaskNum = 0;
	} 

	this.masks[this.currentMaskNum].show();

	console.log("currentMaskNum = " + this.currentMaskNum);
};