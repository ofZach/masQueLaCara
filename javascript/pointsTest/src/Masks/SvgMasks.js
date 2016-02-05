'use strict';
class PyramidMask extends MaskBase {
	setup(){
		this.addLayer();
		this.faceParts = {
			eyeL: new SvgLoader(),
			eyeR: new SvgLoader(),
		}
		this.offsetPos = {
			eyeL: [0, 0],
			eyeR: [0, 0],
		}
		this.faceParts['eyeL'].setup('eyeL','assets/StrokeFaceEye.svg');
		this.faceParts['eyeR'].setup('eyeR','assets/StrokeFaceEye.svg');
	}
	update(data){
		this.faceParts['eyeL'].setPosition(data['eyeLPos']);
		this.faceParts['eyeR'].setPosition(data['eyeRPos']);
	}
	addParameters(settings){
		this.addParametersXY(settings, this.offsetPos, 0, 100);
	}
	clearParameters(settings){
		this.removeParametersXY(settings, this.offsetPos);
	}
	addParametersXY(settings, param , min, max){
		for(var prop in param){
			settings.addRange(prop +" X", min, max, param[prop][0], 1, param[prop][0]);
			settings.addRange(prop +" Y", min, max, param[prop][1], 1, param[prop][1]);
		}
	}
	removeParametersXY(settings, param){
		for(var prop in param){
			settings.removeControl(prop +" X");
			settings.removeControl(prop +" Y");
		}
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
	addParameters(settings){
		
	}
	clearParameters(settings){

	}
}