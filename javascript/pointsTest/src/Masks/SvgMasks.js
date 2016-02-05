'use strict';
class PyramidMask extends MaskBase {
	setup(){
		this.addLayer();
		this.faceParts = {
			eyeL: new SvgLoader(),
			eyeR: new SvgLoader(),
			nose: new SvgLoader(),
			mouth: new SvgLoader(),
		}
		this.offsetPos = {
			eyeL: [0, 0],
			eyeR: [0, 0],
			nose: [0, 0],
			mouth: [0, 0]
		}
		this.faceParts['eyeL'].setup('eyeL',  'assets/StrokeFaceEye.svg');
		this.faceParts['eyeR'].setup('eyeR', 'assets/StrokeFaceEye.svg');
		this.faceParts['mouth'].setup('mouth', 'assets/StrokeFaceMouth.svg');
		this.faceParts['nose'].setup('nose',  'assets/StrokeFaceNose.svg');
	}
	update(data){
		this.faceParts['eyeL'].setPosition(this.calcPos('eyeL', data['eyeLPos']));
		this.faceParts['eyeR'].setPosition(this.calcPos('eyeR', data['eyeRPos']));
		this.faceParts['nose'].setPosition(this.calcPos('nose', data['nosePos']));
		this.faceParts['mouth'].setPosition(this.calcPos('mouth', data['mouthPos']));
		this.faceParts['eyeL'].setAngle(data['eyeLAngle']);
		this.faceParts['eyeR'].setAngle(data['eyeRAngle']);
		this.faceParts['nose'].setAngle(data['noseAngle']);
		this.faceParts['mouth'].setAngle(data['mouthAngle']);
	}
	calcPos(name, dataPos){
		var newPos = new paper.Point(
			dataPos.x+this.offsetPos[name][0],
			dataPos.y+this.offsetPos[name][1]);
		return newPos;
	}
	addParameters(settings){
		var min = -100;
		var max = 100;
		var self = this;
		
		settings.addRange('eyeL' + ' X', min, max, this.offsetPos['eyeL'][0], 1, function(value){
			self.offsetPos['eyeL'][0] = value;
		});
		settings.addRange('eyeL' + ' Y', min, max, this.offsetPos['eyeL'][1], 1, function(value){
			self.offsetPos['eyeL'][1] = value;
		});
		
		settings.addRange('eyeR' + ' X', min, max, this.offsetPos['eyeR'][0], 1, function(value){
			self.offsetPos['eyeR'][0] = value;
		});
		settings.addRange('eyeR' + ' Y', min, max, this.offsetPos['eyeR'][1], 1, function(value){
			self.offsetPos['eyeR'][1] = value;
		});

		settings.addRange('nose' + ' X', min, max, this.offsetPos['nose'][0], 1, function(value){
			self.offsetPos['nose'][0] = value;
		});
		settings.addRange('nose' + ' Y', min, max, this.offsetPos['nose'][1], 1, function(value){
			self.offsetPos['nose'][1] = value;
		});

		settings.addRange('mouth' + ' X', min, max, this.offsetPos['mouth'][0], 1, function(value){
			self.offsetPos['mouth'][0] = value;
		});
		settings.addRange('mouth' + ' Y', min, max, this.offsetPos['mouth'][1], 1, function(value){
			self.offsetPos['mouth'][1] = value;
		});

	}
	clearParameters(settings){
		this.removeParametersXY(settings, this.offsetPos);
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