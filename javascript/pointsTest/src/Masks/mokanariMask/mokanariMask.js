'use strict';

class FaceElement
{
	constructor(_path, _bWobbleScaleFact)
	{
		this.path = _path;
		this.path.applyMatrix = false;
		this.targetPosition = new paper.Point(0, 0);
		this.lastPosition = new paper.Point(0, 0);
		this.targetAngle = 0;
		this.lastAngle = 0;
		this.wobbleScaleFact = _bWobbleScaleFact;
		this.positionSmoothfactor = calc.random(0.25, 0.7);
		this.angleSmoothfactor = calc.random(0.25, 0.7);
		this.scaleTime = {time: calc.random(0.0, Math.PI) };
	}

	update(_dt)
	{
		function smoothPoint(valueOld, valueNew, smooth) 
		{
			return valueOld.multiply(smooth).add(valueNew.multiply(1 - smooth));
		}

		function smoothValue(valueOld, valueNew, smooth)
		{
			return valueOld * smooth + valueNew * (1.0 - smooth);
		}

		function scalePath(_path, _scaleTime, _wobbleScaleFact)
		{
			_scaleTime.time += _dt * 0.01;
			var scale = (Math.sin(_scaleTime.time) + 1.0) * 0.5 * _wobbleScaleFact;
			_path.scale(new paper.Point(2.0 + scale, 2.0 + scale).subtract(_path.scaling));
		}

		var p = smoothPoint(this.lastPosition, this.targetPosition, this.positionSmoothfactor);
		this.path.position = p;
		this.lastPosition = p;

		var a = smoothValue(this.lastAngle, this.targetAngle, this.angleSmoothfactor);
		this.path.rotate(a - this.path.rotation);
		this.lastAngle = a;

		if(this.wobbleScaleFact)
			scalePath(this.path, this.scaleTime, this.wobbleScaleFact);
	}

	setPosition(_pos)
	{
		this.targetPosition = _pos;
	}

	setAngle(_angle)
	{
		this.targetAngle = _angle;
	}
}

class mokanariMask extends MaskBase {

	//------------------------------------------
	setup() {
		super.addLayer();
		this.name = "mokanariMask";
	}

	//------------------------------------------
	update(data) {
		// data contains face data, see dataPlayer.js, ie face parts data['faceParts']['eyeL']['position'] as well as face points, etc...
		var head = data['faceParts']['head'];
		var nose = data['faceParts']['nose'];
		var eyeL = data['faceParts']['eyeL'];
		var eyeR = data['faceParts']['eyeR'];
		var earR = data['faceParts']['earR'];
		var earL = data['faceParts']['earL'];
		var mouth = data['faceParts']['mouth'];
		var cheekL = data['faceParts']['cheekL'];
		var cheekR = data['faceParts']['cheekR'];
		var browL = data['faceParts']['browL'];
		var browR = data['faceParts']['browR'];
		var lipUpper = data['faceParts']['lipUpper'];
		var lipLower = data['faceParts']['lipLower'];
		var chin = data['faceParts']['chin'];

		var now = Date.now();
		var dt = now - this.lastFrameTime;
		this.lastFrameTime = now;
		console.log(dt);

		this.head.update(dt);
		this.head.setPosition(head.position);
		this.head.setAngle(head.angle * (180.0 / Math.PI));

		this.leftEye.update(dt);
		this.leftEye.setPosition(eyeL.position);
		this.leftEye.setAngle(eyeL.angle * (180.0 / Math.PI));

		this.rightEye.update(dt);
		this.rightEye.setPosition(eyeR.position);
		this.rightEye.setAngle(eyeR.angle * (180.0 / Math.PI));

		this.mouth.update(dt);
		this.mouth.setPosition(mouth.position);
		this.mouth.setAngle(mouth.angle * (180.0 / Math.PI));
	}

	show() {
		this.showLayer();

		this.layer.activate();
		this.layer.removeChildren();

		function makeEyes()
		{
			var type = calc.randomInt(0, 3);
			var leftEyeSize = calc.random(20.0, 60.0);
			var rightEyeSize = calc.random(20.0, 60.0);
			if(type == 0)
			{
				var leftEye = new paper.Path.Rectangle([0, 0], [leftEyeSize, leftEyeSize]);
				var rightEye = new paper.Path.Rectangle([0, 0], [rightEyeSize, rightEyeSize]);
				return {leftEye: new FaceElement(leftEye, 0.25), rightEye: new FaceElement(rightEye, 0.25)};
			}
			else if(type == 1)
			{	
				var bFlipped = calc.random(0.0, 1.0) >= 0.5;
				function makeTriangle(_size)
				{
					var ret = new paper.Path();
					ret.add(0, 0);
					ret.add(_size, 0);
					ret.add(_size * 0.5, _size);
					ret.closePath();
					if(bFlipped)
						ret.rotate(180.0);
					return ret;
				}
				return {leftEye: new FaceElement(makeTriangle(leftEyeSize), 0.25), rightEye: new FaceElement(makeTriangle(rightEyeSize), 0.25)};
			}
			else if(type == 2)
			{
				var leftEye = new paper.Path.Circle([0, 0], leftEyeSize * 0.5);
				var rightEye = new paper.Path.Circle([0, 0], rightEyeSize * 0.5);
				return {leftEye: new FaceElement(leftEye, 0.25), rightEye: new FaceElement(rightEye, 0.25)};
			}
		}

		function makeMouth()
		{
			var type = calc.randomInt(0, 1);
			if(type == 0)
			{	var mw = calc.random(10.0, 70.0);
				return new FaceElement(new paper.Path.Circle([0, 0], mw * 0.5), 0.25);
			}
		}

		var headPath = new paper.Path.Rectangle([0, 0], [400, 500]);
		headPath.fillColor = "white";
		this.head = new FaceElement(headPath, 0.05);

		var eyes = makeEyes();
		this.leftEye = eyes.leftEye;
		this.leftEye.path.fillColor = "red";
		this.rightEye = eyes.rightEye;
		this.rightEye.path.fillColor = "red";

		this.mouth = makeMouth();
		this.mouth.path.fillColor = "red";

		this.lastFrameTime = Date.now();
	}

	hide() {
		this.hideLayer();
	}
}
