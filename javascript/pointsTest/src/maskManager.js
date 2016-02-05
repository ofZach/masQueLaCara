'use strict';
class MaskManager {
	constructor(){
		
	}
	setup(){
		this.pyramidMask = new PyramidMask();
		this.pyramidMask.setup();
	}
	update(frameData){
		this.pyramidMask.update(frameData);
	}
};
