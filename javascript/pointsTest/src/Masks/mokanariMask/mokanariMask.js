'use strict';

// globals for scaling purposes
var globalScale = 1.0;
var eyeSizeMin = 20.0 * globalScale;
var eyeSizeMax = 60.0 * globalScale;
var mouthSizeMin = 10.0 * globalScale;
var mouthSizeMax = 70.0 * globalScale;
var minNoseHeight = 60.0 * globalScale;
var maxNoseHeight = 180.0 * globalScale;
var headSize = 400.0 * globalScale;

// helper class to animate and position all the paths
// in the composition.
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

		this.nose.update(dt);
		this.nose.setPosition(nose.position.subtract([0, 50.0]));
		this.nose.setAngle(nose.angle * (180.0 / Math.PI));

		this.chin.update(dt);
		this.chin.setPosition(chin.position.subtract([0, 25.0]));
		this.chin.setAngle(chin.angle * (180.0 / Math.PI));

		this.hair.update(dt);
		this.hair.setPosition(nose.position.subtract([0, 250.0]));
		this.hair.setAngle(head.angle * (180.0 / Math.PI));

		if(this.rightCheek)
		{
			this.rightCheek.update(dt);
			this.rightCheek.setPosition(cheekR.position);
			this.rightCheek.setAngle(cheekR.angle * (180.0 / Math.PI));
		}
		if(this.leftCheek)
		{
			this.leftCheek.update(dt);
			this.leftCheek.setPosition(cheekL.position);
			this.leftCheek.setAngle(cheekL.angle * (180.0 / Math.PI));
		}

		console.log(data);
	}

	show() {
		this.showLayer();

		this.layer.activate();
		this.layer.removeChildren();

		//helper function to generate a variation of different eyes
		function makeEyes()
		{
			var type = calc.randomInt(0, 4);
			var leftEyeSize = calc.random(eyeSizeMin, eyeSizeMax);
			var rightEyeSize = calc.random(eyeSizeMin, eyeSizeMax);
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
			else if(type == 3)
			{
				var bFlip = calc.random(0, 1) >= 0.5;
				function makeArcy(_size)
				{
					var path = new paper.Path();
					path.add(0, 0);
					path.add(_size, 0);
					path.arcTo(0, 0);
					path.closePath(true);
					if(bFlip)
						path.rotate(180.0);
					return path;
				}
				return {leftEye: new FaceElement(makeArcy(leftEyeSize), 0.25), rightEye: new FaceElement(makeArcy(rightEyeSize), 0.25)};
			}
		}

		//helper to make a selection of different mouths
		function makeMouth()
		{
			var type = calc.randomInt(0, 4);
			if(type == 0)
			{	var mw = calc.random(mouthSizeMin, mouthSizeMax);
				return new FaceElement(new paper.Path.Circle([0, 0], mw * 0.5), 0.25);
			}
			else if(type == 1)
			{
				var mw = calc.random(mouthSizeMin, mouthSizeMax);
				return new FaceElement(new paper.Path.Rectangle([0, 0], [mw, mw * calc.random(0.4, 1.0)]), 0.25);
			}
			else if(type == 2)
			{	
				var mw = calc.random(mouthSizeMin, mouthSizeMax);
				var mh = mw * calc.random(0.4, 0.7);
				var path = new paper.Path();
				path.add(0, 0);
				path.add(mw, 0);
				path.add(mw * 0.75, mh);
				path.add(mw * 0.25, mh);
				path.closePath();

				if(calc.random(0, 1) >= 0.5)
					path.rotate(180.0);

				return new FaceElement(path, 0.25);
			}
			else if(type == 3)
			{
				var mw = calc.random(mouthSizeMin, mouthSizeMax);
				var mh = mw * calc.random(0.4, 0.7);
				var path = new paper.Path();
				path.add(0, 0);
				path.add(mw, 0);
				path.arcTo(0, 0);
				path.closePath(true);

				if(calc.random(0, 1) >= 0.5)
					path.rotate(180.0);

				return new FaceElement(path, 0.25);
			}
		}

		//helper function to generate a variation of different noses
		function makeNose()
		{
			var type = calc.randomInt(0, 2);
			if(type == 0)
			{
				var nh = calc.random(minNoseHeight, maxNoseHeight);
				var nw = nh * calc.random(0.4, 0.7);
				var path = new paper.Path();
				path.add(0, 0);
				if(calc.random(0, 1) >= 0.5)
					path.add(nw, nh);
				else
					path.arcTo([nw, nh], true);

				path.add(0, nh);
				path.closePath();
				if(calc.random(0, 1) >= 0.5)
					path.rotate(180.0);
				return new FaceElement(path, 0.1);
			}
			else if(type == 1)
			{
				var nh = calc.random(minNoseHeight, maxNoseHeight);
				var nw = nh * calc.random(0.4, 0.7);
				var path = new paper.Path();
				path.add(0, 0);
				if(calc.random(0, 1) >= 0.5)
					path.add(nw, 0);
				else
					path.arcTo([nw, 0], true);
				path.add(nw * 0.5, nh);
				path.closePath();
				if(calc.random(0, 1) >= 0.5)
					path.rotate(180.0);
				return new FaceElement(path, 0.1);
			}
		}

		//helper function to generate a variation of different head shapes
		function makeHead()
		{
			var type = calc.randomInt(0, 3);
			if(type == 0)
			{
				return new FaceElement(new paper.Path.Rectangle([0, 0], [headSize, headSize * 1.1]), 0.05);
			}
			else if(type == 1)
			{
				var path = new paper.Path();
				path.add(0, 0);
				path.add(headSize, 0);
				path.add(headSize, calc.random(headSize * 0.75, 400));
				path.add(calc.random(headSize * 0.75, headSize * 0.85), headSize * 1.1);
				path.add(0, headSize * 1.1);
				path.closePath();
				return new FaceElement(path, 0.05);
			}
			else if(type == 2)
			{
				var path = new paper.Path();
				path.add(0, 0);
				path.add(headSize, 0);
				path.add(headSize, headSize * 0.5);
				path.arcTo(0, headSize * 0.5, true);
				path.closePath();
				return new FaceElement(path, 0.05);
			}
		}

		//helper function to generate a variation of different chins/hairs
		function makeChin()
		{
			var type = calc.randomInt(0, 4);
			if(type == 0)
			{
				var path = new paper.Path();
				path.add(0, 0);
				var y = calc.random(headSize * 0.2, headSize * 0.5);
				path.add(headSize, y);
				path.add(0, y);
				path.closePath();
				if(calc.random(0.0, 1.0) >= 0.5)
					path.rotate(180.0);
				return new FaceElement(path, 0.05);
			}
			else if(type == 1)
			{
				var path = new paper.Path();
				var w = headSize;
				var stepCount = calc.randomInt(2, 10);
				var step = w / stepCount;
				var x = w;
				path.add(0, 0);
				path.add(headSize, 0);
				for(var i = 0; i <= stepCount; i++)
				{
					path.arcTo(x, 0, true);
					x -= step;
				}
				path.closePath();
				if(calc.random(0, 1) >= 0.5)
					path.rotate(180.0);
				return new FaceElement(path, 0.05);
			}
			else if(type == 2)
			{
				var path = new paper.Path();
				var y0 = calc.random(0, headSize * 0.15);
				var y = calc.random(headSize / 5.0, headSize * 0.5);
				var w = headSize;
				var stepCount = calc.randomInt(2, 10);
				var step = w / stepCount;
				var x = w;
				path.add(0, 0);
				path.add(headSize, 0);
				for(var i = 0; i <= stepCount; i++)
				{
					path.add(x, y0);
					path.add(x - step * 0.5, y);
					x -= step;
				}
				path.add(0, y0);
				path.closePath();
				if(calc.random(0, 1) >= 0.5)
					path.rotate(180.0);
				return new FaceElement(path, 0.05);
			}
			else if(type == 3)
			{
				var path = new paper.Path();
				var w1 = calc.random(headSize * 0.5, headSize);
				var w2 = calc.random(headSize * 0.5, headSize);
				var h = calc.random(headSize * 0.25, headSize * 0.5);
				var l = calc.random(headSize * 0.25, headSize * 0.5);
				path.add(0, 0);
				path.add(w1, 0);
				path.add(w1, h / 3.0);
				path.add(l, h / 3.0);
				path.add(l, h / 3.0 * 2.0);
				path.add(w2, h / 3.0 * 2.0);
				path.add(w2, h);
				path.add(0, h);
				path.closePath();
				if(calc.random(0, 1) >= 0.5)
					path.rotate(180.0);
				return new FaceElement(path, 0.05);
			}
		}

		this.head = makeHead();
		if(calc.random(0, 1) <= 0.25)
			this.head.path.fillColor = "white";
		else
			this.head.path.fillColor = new Color({hue: calc.random(0, 360.0), saturation: calc.random(0.2, 0.7), brightness: calc.random(0.85, 1.0)});

		var bNoseMoutBlack = calc.random(0, 1) >= 0.5;
		var eyeMouthColor = "black";
		if(!bNoseMoutBlack)
		{
			if(calc.random(0, 1) >= 0.5)
				eyeMouthColor = new Color({hue: this.head.path.fillColor.hue + calc.random(120.0, 200.0), saturation: calc.random(0.4, 1.0), brightness: calc.random(0.5, 1.0)});
			else
			{
				eyeMouthColor = new Color(this.head.path.fillColor);
				eyeMouthColor.brightness *= calc.random(0.3, 0.6);
			}
		}

		var eyes = makeEyes();
		this.leftEye = eyes.leftEye;
		this.leftEye.path.fillColor = eyeMouthColor;
		//this.leftEye.path.blendMode = "overlay";
		this.rightEye = eyes.rightEye;
		this.rightEye.path.fillColor = eyeMouthColor;
		//this.rightEye.path.blendMode = "overlay";

		this.mouth = makeMouth();
		this.mouth.path.fillColor = eyeMouthColor;
		//this.mouth.path.blendMode = "overlay";

		var headCol = this.head.path.fillColor;

		//helper function to generate a variation of different cheeks
		function makeCheek()
		{
			var type = calc.randomInt(0, 2);
			if(type == 0)
			{
				var w = calc.random(headSize * 0.15, headSize * 0.25);
				var off = w / 3.0;
				var p = new paper.Path();
				p.add(calc.random(-off, off), calc.random(-off, off));
				p.add(w + calc.random(-off, off), calc.random(-off, off));
				p.add(w + calc.random(-off, off), w + calc.random(-off, off));
				p.add(calc.random(-off, off), w + calc.random(-off, off));
				p.closePath();

				if(calc.random(0, 1) >= 0.75)
					p.smooth();
				if(calc.random(0, 1) <= 0.2)
					p.fillColor = "red";
				else if(calc.random(0, 1) <= 0.2)
					p.fillColor = "black";
				else
					p.fillColor = new Color({hue: headCol.hue + calc.random(120.0, 200.0), saturation: 1.0, brightness: calc.random(0.85, 1.0)});
				return new FaceElement(p, 0.15);
			}
			else if(type == 1)
			{
				var w = calc.random(headSize * 0.15, headSize * 0.5);
				var p = new paper.Path();
				for(var i=0; i < calc.randomInt(4, 12); i++)
				{
					p.add(calc.random(0, w), calc.random(0, w));
				}
				if(calc.random(0, 1) >= 0.5)
					p.strokeColor = "black";
				else if(calc.random(0, 1) >= 0.5)
					p.strokeColor = "red";
				else
					p.strokeColor = new Color({hue: calc.random(0, 360.0), saturation: 1.0, brightness: 1.0});

				if(calc.random(0, 1) >= 0.5)
					p.smooth();
				p.strokeJoin = "round";
				p.strokeCap = "round";
				p.strokeWidth = calc.random(2.0, 20.0);
				return new FaceElement(p, 0.15);
			}
		}
		if(calc.random(0, 1) >= 0.5)
		{
			this.rightCheek = makeCheek();
		}

		if(calc.random(0, 1) >= 0.5)
		{
			this.leftCheek = makeCheek();
		}

		var noseCol = new Color({hue: this.head.path.fillColor.hue + calc.random(120.0, 200.0), saturation: calc.random(0.6, 1.0), brightness: calc.random(0.85, 1.0)});
		this.nose = makeNose();
		if(calc.random(0, 1) >= 0.5)
			this.nose.path.smooth();
		this.nose.path.fillColor = noseCol;
		this.nose.path.blendMode = "multiply";

		var chinCol = noseCol.clone();
		chinCol.hue += calc.random(0.0, 200.0);
		this.chin = makeChin();
		this.chin.path.fillColor = chinCol;
		this.chin.path.blendMode = "multiply";
		if(calc.random(0, 1) >= 0.5)
			this.chin.path.smooth();

		var hairCol = noseCol.clone();
		hairCol.hue += calc.random(0.0, 200.0);
		this.hair = makeChin();
		this.hair.path.fillColor = hairCol;
		this.hair.path.blendMode = "multiply";
		if(calc.random(0, 1) >= 0.5)
			this.hair.path.smooth();

		this.lastFrameTime = Date.now();
	}

	hide() {
		this.hideLayer();
	}
}
