'use strict';

//some globals to adjust mainly scale related things
var noiseDiv = 400.0;
var noiseSampleDist = 100.0;
var minHeadWidth = 450.0;
var maxHeadWidth = 600.0;
var minEyeRad = 30.0;
var maxEyeRad = 80.0;

// helper class to noisify the provided path everytime update is called
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
		this.jiggleSpeedFact = calc.random(0.00005, 0.002)
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

		//make sure to activate this layer as we regenerate the whole face geometry
		//every frame for the noise effect.
		this.layer.activate();

		var now = Date.now();
		var dt = now - this.lastFrameTime;
		this.lastFrameTime = now;

		if(this.group)
			this.group.remove();

		//update all the noise path objects
		this.head.update(dt);
		this.head.setPosition(head.position);

		this.leftEye.update(dt);
		this.leftEye.setPosition(eyeL.position);

		this.rightEye.update(dt);
		this.rightEye.setPosition(eyeR.position);

		this.mouth.update(dt);
		this.mouth.setPosition(mouth.position.add(chin.position.subtract(mouth.position).multiply(0.4)));

		// generate the overall composition from the noisyfied paths
		var highlightA = new paper.Path.Rectangle(this.head.path.bounds);
		var highlightB = this.head.path.clone();
		highlightB.translate(this.lightDir.multiply(60.0));
		var highlightCP = new paper.CompoundPath(highlightA, highlightB);
		highlightCP.fillColor = this.lightColor;
		this.group = new paper.Group(this.head.path.clone(), this.head.path, highlightCP, this.leftEye.path, this.rightEye.path, this.mouth.path);
		this.group.clipped = true;
	}

	show() {
		this.showLayer();
		this.lastFrameTime = Date.now();

		this.layer.removeChildren();

		//make sure to activate this layer
		this.layer.activate();

		function mixColor(_a, _b, _fact)
		{
			return _a.multiply(1.0 - _fact).add(_b.multiply(_fact));
		}

		//pick a random light color and direction
		this.lightColor = new Color({hue: calc.random(0, 360.0), saturation: calc.random(0.2, 0.5), brightness: calc.random(0.8, 0.95)});
		this.lightDir = new paper.Point(0, -1).rotate(calc.random(-30.0, 30.0)).normalize();

		var headCol = mixColor(new Color(1.0, 1.0, 1.0), this.lightColor.convert("rgb"), 0.25);
		var headPath = new paper.Path.Ellipse([0, 0], [calc.random(minHeadWidth, maxHeadWidth), calc.random(minHeadWidth, maxHeadWidth)]);
		headPath.fillColor = headCol;
		this.head = new NoisePath(headPath, noiseSampleDist, noiseDiv, 20.0);

		var leftEyePath = new paper.Path.Circle([0, 0], calc.random(minEyeRad, maxEyeRad));
		leftEyePath.fillColor = "black";
		this.leftEye = new NoisePath(leftEyePath, noiseSampleDist * 0.5, noiseDiv * 0.5, 10.0);

		var rightEyePath = new paper.Path.Circle([0, 0], calc.random(minEyeRad, maxEyeRad));
		rightEyePath.fillColor = "black";
		this.rightEye = new NoisePath(rightEyePath, noiseSampleDist * 0.5, noiseDiv * 0.5, 10.0);

		var mw = calc.random(50.0, 300.0);
		var mhf = calc.random(0.5, 1.0);
		var mouthPath = new paper.Path.Ellipse([0, 0], [mw, mw * mhf]);
		mouthPath.fillColor = "black";
		this.mouth = new NoisePath(mouthPath, noiseSampleDist * 0.5, noiseDiv * 0.5, 10.0);
	}

	hide() {
		this.hideLayer();
	}
}
