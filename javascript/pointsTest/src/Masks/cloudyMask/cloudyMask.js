'use strict';

function arcifyPath(_path, _sampleDistMin, _sampleDistMax)
{
	var ret = new paper.Path();
	var len = _path.length;
	var off = 0;
	ret.add(_path.getPointAt(0));

	while(off < len)
	{
		var p = _path.getPointAt(Math.min(off, len));
		ret.arcTo(p, true);
		off += _sampleDistMin + Math.random() * (_sampleDistMax - _sampleDistMin);
	}

	ret.arcTo(_path.getPointAt(len), true);
	ret.closePath(true);

	return ret;
}

var noiseSeed = Math.random(0, 255);

//helper function to noisify a paperjs path or a paperjs group of paths
function applyNoiseToPath(_path, _sampleDist, _noiseDiv, _noiseScale)
{
    if(_path instanceof Group || _path instanceof CompoundPath)
    {
        for(var i = 0; i < _path.children.length; i++)
        {
            applyNoiseToPath(_path.children[i], _sampleDist, _noiseDiv, _noiseScale);
        }
    }
    else
    {
        if(_sampleDist < _path.length)
            _path.flatten(_sampleDist);
        for(var i = 0; i < _path.segments.length; i++)
        {
            var noiseX = noise.simplex3(_path.segments[i].point.x / _noiseDiv,
                _path.segments[i].point.y / _noiseDiv,
                noiseSeed);
            var noiseY = noise.simplex3(_path.segments[i].point.y / _noiseDiv,
                noiseSeed,
                _path.segments[i].point.x / _noiseDiv);

            _path.segments[i].point = _path.segments[i].point.add(new Point(noiseX, noiseY).multiply(_noiseScale));
        }
        _path.smooth();
    }
}

function mixColor(_a, _b, _fact)
{
	return _a.multiply(1.0 - _fact).add(_b.multiply(_fact));
}

class cloudyMask extends MaskBase {

	//------------------------------------------
	setup() {
		super.addLayer();
		this.name = "cloudyMask";
	}
	//------------------------------------------
	smooth(valueOld, valueNew, smooth) {
		return valueOld * smooth + (1 - smooth) * valueNew;
	}
	//------------------------------------------
	smoothPoint(valueOld, valueNew, smooth) {
		return valueOld.multiply(smooth).add(valueNew.multiply(1 - smooth));
	}
	//------------------------------------------
	radsToDeg(rads) {
		return rads * (180.0 / Math.PI);
	}
	//------------------------------------------
	update(data) {
		// data contains face data, see dataPlayer.js, ie face parts data['faceParts']['eyeL']['position'] as well as face points, etc...
		var head = data['faceParts']['head'];
		var nose = data['faceParts']['nose'];
		var eyeL = data['faceParts']['eyeL'];
		var eyeR = data['faceParts']['eyeR'];

		var now = Date.now();
		var frameTime = (Date.now() - this.lastFrameTime) / 1000.0;
		this.lastFrameTime = now;

		function scaleCloud(_cloud, _scaleTime)
		{
			_scaleTime.time += frameTime * 10.0;
			var scale = (Math.sin(_scaleTime.time) + 1.0) * 0.5 * 0.25;
			_cloud.scale(new paper.Point(2.0 + scale, 2.0 + scale).subtract(_cloud.scaling));
		}
		var p = this.smoothPoint(this.oldLeftEyePos, eyeL.position, 0.5);
		this.oldLeftEyePos = p;
		this.leftEye.position = p;
		var ang = this.smooth(this.lastLeftEyeRot, this.radsToDeg(eyeL.angle), 0.5);
		this.lastLeftEyeRot = ang;
		this.leftEye.rotate(ang - this.leftEye.rotation);
		scaleCloud(this.leftEye, this.leftScalingTimer);

		var p2 = this.smoothPoint(this.oldRightEyePos, eyeR.position, 0.5);
		this.oldRightEyePos = p2;
		this.rightEye.position = p2;
		var ang2 = this.smooth(this.lastRightEyeRot, this.radsToDeg(eyeR.angle), 0.5);
		this.lastRightEyeRot = ang2;
		this.rightEye.rotate(ang - this.rightEye.rotation);
		scaleCloud(this.rightEye, this.rightScalingTimer);

		for(var i=0; i < this.stripes.length; ++i)
		{
			var p3 = this.smoothPoint(this.stripes[i].lastPos, head.position, this.stripes[i].easeFact);
			this.stripes[i].lastPos = p3;
			this.stripes[i].path.position = p3;
			this.stripes[i].path.dashOffset += frameTime * this.stripes[i].speed;
		}

		this.timeElapsed += frameTime;
		this.lightning.fillColor.brightness = noise.simplex2(this.timeElapsed, 0);

		this.rainNoiseTimer += frameTime * 0.1;
		var i = this.rainDrops.length;
		while(i--) 
		{
			if(this.rainDrops[i].dropPath)
				this.rainDrops[i].dropPath.remove();

			this.rainDrops[i].pos = this.rainDrops[i].pos.add([0.0, 80.0 * frameTime * this.rainDrops[i].rad]);
			var n = noise.simplex3(this.rainDrops[i].pos.x / 300.0, this.rainDrops[i].pos.y / 300.0, this.rainNoiseTimer) * Math.PI;
			this.rainDrops[i].pos = this.rainDrops[i].pos.add(new paper.Point(Math.cos(n), Math.sin(n)).multiply(0.75));
			var targetScale = Math.sin(Math.PI/this.rainDrops[i].lifeTime * this.rainDrops[i].age);
			var rad = this.rainDrops[i].rad * targetScale;
			if(this.rainStyle == 0)
				this.rainDrops[i].dropPath = new paper.Path.Circle(this.rainDrops[i].pos, rad);
			else
				this.rainDrops[i].dropPath = new paper.Path.Rectangle(this.rainDrops[i].pos, new paper.Size(rad * 0.8, rad * 2.0));
			this.rainDrops[i].dropPath.fillColor = this.rainDrops[i].color;
			this.rainDrops[i].age += frameTime;

			//console.log("TS: ", targetScale, this.rainDrops[i].dropPath.scaling);
			if(this.rainDrops[i].age >= this.rainDrops[i].lifeTime)
			{
				this.rainDrops[i].dropPath.remove();
				this.rainDrops.splice(i, 1);
			}
		}

		var posRef = calc.random(0.0, 1.0) >= 0.5 ? this.rightEye : this.leftEye
		var rdp = posRef.position.add([calc.random(-posRef.bounds.width * 0.5, posRef.bounds.width * 0.5), calc.random(0.0, posRef.bounds.height * 0.5)]);
		
		var dropColor;
		if(!this.rainbowRain)
			dropColor = new Color({ hue: calc.random(200.0, 220.0), saturation: calc.random(0.5, 1.0), brightness: calc.random(0.8, 1.0) })
		else
			dropColor = new Color({ hue: calc.random(0.0, 360.0), saturation: calc.random(0.75, 1.0), brightness: calc.random(0.9, 1.0) })
		dropColor = mixColor(dropColor.convert("rgb"), this.skyColor.convert("rgb"), 0.25);
		this.rainDrops.push({dropPath: null, age: 0, lifeTime: calc.random(0.5, 2.0), rad: calc.random(1, 4), pos: new paper.Point(rdp), color: dropColor});
	}

	show() {
		this.showLayer();
		this.layer.removeChildren();
		noiseSeed = Math.random(0, 255);
		var skyColor = new Color({ hue: calc.random(0.0, 360.0), saturation: calc.random(0.5, 1.0), brightness: calc.random(0.9, 1.0) });
		this.skyColor = skyColor;
		var groundColor = new Color({ hue: skyColor.hue + 180.0, saturation: calc.random(0.25, 0.6), brightness: calc.random(0.25, 0.6) });

		var lightDir = new paper.Point(0, -1).rotate(calc.random(-90.0, 90.0)).normalize();
		function makeCloud()
		{
			var grp = new paper.Group();
			grp.transformContent = false;
			var w = calc.random(80, 160);
			var tmp = new paper.Path.Ellipse(new paper.Point(0, 0), [w, w * calc.random(0.5, 0.75)]);
			var sw = calc.random(5.0, 15.0);
			var ret = arcifyPath(tmp, sw, sw * 3.0);
			tmp.remove();
			var cloudColor = new Color({hue: calc.random(0, 1), saturation: calc.random(0.0, 0.25), brightness: 1.0});
			cloudColor = mixColor(cloudColor.convert("rgb"), skyColor.convert("rgb"), 0.15);
			ret.fillColor = cloudColor;
			ret.applyMatrix = false;
			applyNoiseToPath(ret, 2.0, 50.0, 6.0);

			grp.addChild(ret.clone());
			grp.addChild(ret);
			var shadow = new paper.Path.Rectangle(ret.bounds);
			var ellipse = new paper.Path.Ellipse(ret.bounds);
			ellipse.translate(lightDir.multiply(calc.random(10.0, 25.0)));
			applyNoiseToPath(ellipse, 10.0, calc.random(10.0, 20.0), 3.0);
			var shadowCP = new paper.CompoundPath(shadow, ellipse);
			var shadowCol = mixColor(cloudColor.convert("rgb"), groundColor.convert("rgb"), 0.15);
			shadowCP.fillColor = shadowCol;
			grp.addChild(shadowCP);
			grp.clipped = true;
			return grp;
		}

		var bRoundStripeStroke = calc.random(0.0, 1.0) >= 0.5;
		var bSmoothStripes = calc.random(0.0, 1.0) >= 0.5;
		function makeStripe()
		{
			var ret = new paper.Path();
			var pc = calc.randomInt(3, 12);
			for(var i = 0; i < pc; i++)
			{
				ret.add(new paper.Point(calc.random(0, 540), calc.random(0, 640)));
			}
			if(bSmoothStripes)
				ret.smooth();
			var len = ret.length;
			ret.dashArray = [len * 0.1, len * calc.random(1.0, 10.0)];
			var stripeColor = new Color({ hue: calc.random(0.0, 360.0), saturation: calc.random(0.75, 1.0), brightness: calc.random(0.9, 1.0) })
			stripeColor = mixColor(stripeColor.convert("rgb"), skyColor.convert("rgb"), 0.25);
			ret.strokeColor = stripeColor;
			ret.strokeWidth = calc.random(1.0, 5.0);
			ret.blendMode = "overlay";
			if(bRoundStripeStroke)
			{
				ret.strokeCap = "round";
				ret.strokeJoin = "round";
			}
			return ret;
		}

		this.leftEye = makeCloud();
		this.rightEye = makeCloud();

		//TODO Better start values for this?
		this.oldLeftEyePos = new paper.Point(0, 0);
		this.lastLeftEyeRot = 0.0;
		this.leftScalingTimer = {time: calc.random(0.0, Math.PI)};
		this.rightScalingTimer = {time: calc.random(0.0, Math.PI)};
		this.oldRightEyePos = new paper.Point(0, 0);
		this.lastRightEyeRot = 0.0;

		this.rainDrops = [];
		this.lastFrameTime = Date.now();
		this.rainNoiseTimer = 0;
		this.rainbowRain = calc.random(0.0, 1.0) >= 0.75;
		this.rainStyle = calc.randomInt(0, 2);

		this.stripes = [];
		for(var i=0; i < calc.randomInt(3, 15); i++)
		{
			var stripePath = makeStripe();
			this.stripes.push({path: stripePath, lastPos: new paper.Point(0, 0), easeFact: calc.random(0.5, 0.95), speed: calc.random(1600.0, 2500.0)});
		}

		var darkenStripe = makeStripe();
		darkenStripe.blendMode = "overlay";
		darkenStripe.strokeColor = new Color(0.0, 0.0, 0.0, 0.5);
		darkenStripe.strokeWidth = calc.random(100.0, 300.0);
		darkenStripe.shadowColor = new Color(0.0, 0.0, 0.0, 1.0);
		darkenStripe.shadowBlur = 30.0;
		darkenStripe.shadowOffset = new paper.Point(30.0, 60.0);
		darkenStripe.strokeCap = "round";
		darkenStripe.strokeJoin = "round";
		//darkenStripe.dashArray = [];
		this.stripes.push({path: darkenStripe, lastPos: new paper.Point(0, 0), easeFact: calc.random(0.5, 0.95), speed: calc.random(1600.0, 2500.0)});

		this.lightning = new paper.Path.Rectangle(paper.project.view.bounds);
		this.lightning.fillColor = skyColor.convert("hsb");
		this.lightning.fillColor.brightness = 1.0;
		this.lightning.fillColor.alpha = 0.4;
		this.lightning.blendMode = "lighten";
		this.timeElapsed = 0;
	}

	hide() {
		this.hideLayer();
	}
}
