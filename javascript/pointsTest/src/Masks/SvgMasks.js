'use strict';
//----------------------------------------
function addParam( settings, valueToChange, name, startVal, min, max, step){
	
	if (typeof valueToChange[name] != 'undefined'){
		settings.addRange(name, min, max, valueToChange[name].value, step, function(value){
			valueToChange[name].value = value;
		});
	} else {
		valueToChange[name] = {};
		valueToChange[name].value = startVal;
		settings.addRange(name, min, max, startVal, step, function(value){
			valueToChange[name].value = value;
		});
	}
	
	
}

//----------------------------------------
class SvgFaceRig extends MaskBase {
	setupData(data){
		this.addLayer();
		this.faceParts = {
			head: new SvgLoader(),
			eyeL: new SvgLoader(),
			eyeR: new SvgLoader(),
			nose: new SvgLoader(),
			mouth: new SvgLoader(),
			cheekL: new SvgLoader(),
			cheekR: new SvgLoader(),
			browL: new SvgLoader(),
			browR: new SvgLoader(),
		}
		this.parameters = {};
		this.faceParts['eyeL'].setup('eyeL', data['eyeL']  );
		this.faceParts['eyeR'].setup('eyeR', data['eyeR'] );
		this.faceParts['mouth'].setup('mouth', data['mouth'] );
		this.faceParts['nose'].setup('nose', data['nose']  );
		this.faceParts['head'].setup('head', data['head']  );
		this.faceParts['cheekL'].setup('cheekL', data['cheekL']  );
		this.faceParts['cheekR'].setup('cheekR', data['cheekR']  );
		this.faceParts['browL'].setup('browL', data['browL']  );
		this.faceParts['browR'].setup('browR', data['browR']  );
	}
	update(data){
		var eyeLX = 
		this.faceParts['eyeL'].setPosition(  data['eyeLPos'].add(new paper.Point(this.parameters["eyeLX"].value, 
																			   this.parameters["eyeLY"].value)));
		this.faceParts['eyeR'].setPosition(  data['eyeRPos'].add(new paper.Point(this.parameters["eyeRX"].value, 
																			   this.parameters["eyeRY"].value)));
		this.faceParts['nose'].setPosition(  data['nosePos'].add(new paper.Point(this.parameters["noseX"].value, 
																			   this.parameters["noseY"].value)));
		this.faceParts['mouth'].setPosition(  data['mouthPos'].add(new paper.Point(this.parameters["mouthX"].value, 
																			   this.parameters["mouthY"].value)));
		this.faceParts['head'].setPosition(  data['headPos'].add(new paper.Point(this.parameters["headX"].value, 
																			   this.parameters["headY"].value)));
		this.faceParts['cheekL'].setPosition(  data['cheekLPos'].add(new paper.Point(this.parameters["cheekLX"].value, 
																			   this.parameters["cheekLY"].value)));
		this.faceParts['cheekR'].setPosition(  data['cheekRPos'].add(new paper.Point(this.parameters["cheekRX"].value, 
																			   this.parameters["cheekRY"].value)));
		this.faceParts['browL'].setPosition(  data['browLPos'].add(new paper.Point(this.parameters["browLX"].value, 
																			   this.parameters["browLY"].value)));
		this.faceParts['browR'].setPosition(  data['browRPos'].add(new paper.Point(this.parameters["browRX"].value, 
																			   this.parameters["browRY"].value)));
		this.faceParts['eyeL'].setAngle(data['eyeLAngle']);
		this.faceParts['eyeR'].setAngle(data['eyeRAngle']);
		this.faceParts['nose'].setAngle(data['noseAngle']);
		this.faceParts['mouth'].setAngle(data['mouthAngle']);
		this.faceParts['head'].setAngle(data['headAngle']);
		this.faceParts['cheekL'].setAngle(data['headAngle']);
		this.faceParts['cheekR'].setAngle(data['headAngle']);
		this.faceParts['browL'].setAngle(data['headAngle']);
		this.faceParts['browR'].setAngle(data['headAngle']);

		this.faceParts['mouth'].setScale(this.parameters['mouthScale'].value);
		this.faceParts['nose'].setScale(this.parameters['noseScale'].value);
		this.faceParts['eyeL'].setScale(this.parameters['eyeLScale'].value);
		this.faceParts['eyeR'].setScale(this.parameters['eyeRScale'].value);
		this.faceParts['head'].setScale(this.parameters['headScale'].value);
		this.faceParts['cheekL'].setScale(this.parameters['cheekLScale'].value);
		this.faceParts['cheekR'].setScale(this.parameters['cheekRScale'].value);
		this.faceParts['browL'].setScale(this.parameters['browLScale'].value);
		this.faceParts['browR'].setScale(this.parameters['browRScale'].value);
	}
	addParameters(settings){
		var min = -100;
		var max = 100;
		var scaleMin = 0.2;
		var scaleMax = 5.0;
		var self = this;
		addParam( settings, this.parameters, "eyeLX", 0, min, max, 1);
		addParam( settings, this.parameters, "eyeLY", 0, min, max, 1);
		addParam( settings, this.parameters, "eyeRX", 0, min, max, 1);
		addParam( settings, this.parameters, "eyeRY", 0, min, max, 1);
		addParam( settings, this.parameters, "noseX", 0, min, max, 1);
		addParam( settings, this.parameters, "noseY", 0, min, max, 1);
		addParam( settings, this.parameters, "mouthX", 0, min, max, 1);
		addParam( settings, this.parameters, "mouthY", 0, min, max, 1);
		addParam( settings, this.parameters, "headX", 0, min, max, 1);
		addParam( settings, this.parameters, "headY", 0, min, max, 1);
		addParam( settings, this.parameters, "cheekLX", 0, min, max, 1);
		addParam( settings, this.parameters, "cheekLY", 0, min, max, 1);
		addParam( settings, this.parameters, "cheekRX", 0, min, max, 1);
		addParam( settings, this.parameters, "cheekRY", 0, min, max, 1);
		addParam( settings, this.parameters, "browRX", 0, min, max, 1);
		addParam( settings, this.parameters, "browRY", 0, min, max, 1);
		addParam( settings, this.parameters, "browLX", 0, min, max, 1);
		addParam( settings, this.parameters, "browLY", 0, min, max, 1);
		
		addParam( settings, this.parameters, "eyeLScale", 1, scaleMin, scaleMax, 0.02);
		addParam( settings, this.parameters, "eyeRScale", 1, scaleMin, scaleMax, 0.02);
		addParam( settings, this.parameters, "noseScale", 1, scaleMin, scaleMax, 0.02);
		addParam( settings, this.parameters, "mouthScale", 1, scaleMin, scaleMax, 0.02);
		addParam( settings, this.parameters, "headScale", 1, scaleMin, scaleMax, 0.02);
		addParam( settings, this.parameters, "cheekLScale", 1, scaleMin, scaleMax, 0.02);
		addParam( settings, this.parameters, "cheekRScale", 1, scaleMin, scaleMax, 0.02);
		addParam( settings, this.parameters, "browLScale", 1, scaleMin, scaleMax, 0.02);
		addParam( settings, this.parameters, "browRScale", 1, scaleMin, scaleMax, 0.02);
	}
	clearParameters(settings){
		for(var key in this.parameters){
      		settings.removeControl(key);
   		}
	}
}
class GridMask extends SvgFaceRig {
	setup(){
		this.faceParts = {
			eyeL: 'assets/svg/GridFace/eye',
			eyeR: 'assets/svg/GridFace/eye',
			nose: 'assets/svg/GridFace/nose',
			mouth: 'assets/svg/GridFace/mouth',
			head: 'assets/svg/GridFace/head',
			cheekL: 'assets/svg/GridFace/cheek',
			cheekR: 'assets/svg/GridFace/cheek',
			browL: 'assets/svg/GridFace/brow',
			browR: 'assets/svg/GridFace/brow',
		}
		this.setupData(this.faceParts);
	}
}
class CloudMask extends SvgFaceRig {
	setup(){
		this.faceParts = {
			eyeL: 'assets/svg/CloudFace/eye',
			eyeR: 'assets/svg/CloudFace/eye',
			nose: 'assets/svg/CloudFace/nose',
			mouth: 'assets/svg/CloudFace/mouth',
			head: 'assets/svg/CloudFace/head',
			cheekL: 'assets/svg/CloudFace/cheek',
			cheekR: 'assets/svg/CloudFace/cheek',
			browL: 'assets/svg/CloudFace/brow',
			browR: 'assets/svg/CloudFace/brow',
		}
		this.setupData(this.faceParts);
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