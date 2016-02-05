'use strict';
class PyramidMask extends MaskBase {
	setup(){
		this.addLayer();
		this.faceParts = {
			eyeL: new SvgLoader(),
			eyeR: new SvgLoader(),
		}
		this.faceParts['eyeL'].setup('eyeL','assets/StrokeFaceEye.svg');
		this.faceParts['eyeR'].setup('eyeR','assets/StrokeFaceEye.svg');
	}
	update(data){
		this.faceParts['eyeL'].setPosition(data['eyeLPos']);
		this.faceParts['eyeR'].setPosition(data['eyeRPos']);
	}
	clearParameters(settings){

	}
	addParameters(settings){

	}
}
class CircleMask extends MaskBase {
	setup(){
		this.addLayer();
		this.faceParts = {
			eyeL: new SvgLoader(),
			eyeR: new SvgLoader(),
		}
		this.faceParts['eyeL'].setup('eyeL','assets/CircleFaceEye.svg');
		this.faceParts['eyeR'].setup('eyeR','assets/CircleFaceEye.svg');
	}
	update(data){
		this.faceParts['eyeL'].setPosition(data['eyeLPos']);
		this.faceParts['eyeR'].setPosition(data['eyeRPos']);
	}
	clearParameters(settings){

	}
	addParameters(settings){
		
	}
}