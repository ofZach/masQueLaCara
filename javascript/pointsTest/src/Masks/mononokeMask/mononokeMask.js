'use strict';

class NoisePath
{
	constructor(_path, _sampleDist, _noiseDiv, _noiseScale) 
	{
		this.hiddenPath = _path;
		this.hiddenPath.flatten(_sampleDist);
		this.hiddenPath.visible = false;
		this.sampleDist = _sampleDist;
		this.noiseDiv = _noiseDiv;
		this.noiseScale = _noiseScale;
		this.noiseTimer = calc.random(0, 255);
		this.jiggleSpeedFact = calc.random(0.0001, 0.005)
		this.targetPosition = new paper.Point(0, 0);
		this.lastPosition = new paper.Point(0, 0);
		this.positionSmoothfactor = calc.random(0.3, 0.7);
	}

	update(_dt)
	{
		function noisifyPath(_path, _noiseDiv, _noiseScale, _noiseTimer)
		{
	        for(var i = 0; i < _path.segments.length; i++)
	        {
	            var noiseX = noise.simplex3(_path.segments[i].point.x / _noiseDiv,
	                _path.segments[i].point.y / _noiseDiv,
	                _noiseTimer);
	            var noiseY = noise.simplex3(_path.segments[i].point.y / _noiseDiv,
	                _noiseTimer,
	                _path.segments[i].point.x / _noiseDiv);

	            _path.segments[i].point = _path.segments[i].point.add(new Point(noiseX, noiseY).multiply(_noiseScale));
	        }
	        _path.smooth();
		}

		this.noiseTimer += _dt * this.jiggleSpeedFact;

		if(this.path)
			this.path.remove();

		this.path = this.hiddenPath.clone();
		this.path.visible = true;
		noisifyPath(this.path, this.noiseDiv, this.noiseScale, this.noiseTimer);

		function smoothPoint(valueOld, valueNew, smooth) 
		{
			return valueOld.multiply(smooth).add(valueNew.multiply(1 - smooth));
		}

		var p = smoothPoint(this.lastPosition, this.targetPosition, this.positionSmoothfactor);
		this.path.position = p;
		this.lastPosition = p;
	}
	setPosition(_pos)
	{
		this.targetPosition = _pos;
	}
}

class mononokeMask extends MaskBase {

	//------------------------------------------
	setup() {
		super.addLayer();
		this.name = "mononokeMask";

		var headPath = new paper.Path.Ellipse([0, 0], [calc.random(450, 600), calc.random(450, 600)]);
		headPath.fillColor = "white";
		this.head = new NoisePath(headPath, 100, 400, 20.0);

		var leftEyePath = new paper.Path.Circle([0, 0], calc.random(30, 80));
		leftEyePath.fillColor = "black";
		this.leftEye = new NoisePath(leftEyePath, 50, 200, 10.0);

		var rightEyePath = new paper.Path.Circle([0, 0], calc.random(30, 80));
		rightEyePath.fillColor = "black";
		this.rightEye = new NoisePath(rightEyePath, 50, 200, 10.0);

		var mw = calc.random(50.0, 300.0);
		var mhf = calc.random(0.5, 1.0);
		var mouthPath = new paper.Path.Ellipse([0, 0], [mw, mw * mhf]);
		mouthPath.fillColor = "black";
		this.mouth = new NoisePath(mouthPath, 50, 200, 10.0);
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

		this.layer.activate();

		var now = Date.now();
		var dt = now - this.lastFrameTime;
		this.lastFrameTime = now;

		this.head.update(dt);
		this.head.setPosition(head.position);

		this.leftEye.update(dt);
		this.leftEye.setPosition(eyeL.position);

		this.rightEye.update(dt);
		this.rightEye.setPosition(eyeR.position);

		this.mouth.update(dt);
		this.mouth.setPosition(mouth.position.add(chin.position.subtract(mouth.position).multiply(0.4)));
	}

	show() {
		this.showLayer();
		this.lastFrameTime = Date.now();
	}

	hide() {
		this.hideLayer();
	}
}
