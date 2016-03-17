'use strict';

//globals to configure scale related things
var globalScale = 1.0; //change this to scale everything;
var minCloudSize = 80.0 * globalScale;
var maxCloudSize = 160.0 * globalScale;
var minCloudArc = 5.0 * globalScale;
var maxCloudArc = 15.0 * globalScale;
var cloudNoiseSampleDist = 2.0 * globalScale;
var cloudNoiseDiv = 60.0 * globalScale;
var cloudNoiseScale = 6.0 * globalScale;
var cloudShadowOff = 10.0 * globalScale;
var raindropRad = 1.0 * globalScale;
var stripeRad = 1.0 * globalScale;
var stripeMaxX = 500.0 * globalScale;
var stripeMaxY = 640.0 * globalScale;

// function to help generating the clouds.
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

//randomize the noise seed
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

//helper to mix two RGB(A) colors
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

		//make sure the layer is active is we create new paths for the raindrops in here
		this.layer.activate();

		var now = Date.now();
		var frameTime = (Date.now() - this.lastFrameTime) / 1000.0;
		this.lastFrameTime = now;

		//helper to make the clouds pulsate
		function scaleCloud(_cloud, _scaleTime)
		{
			_scaleTime.time += frameTime * 10.0;
			var scale = (Math.sin(_scaleTime.time) + 1.0) * 0.5 * 0.25;
			_cloud.scale(new paper.Point(2.0 + scale, 2.0 + scale).subtract(_cloud.scaling));
		}

		//position the left cloud
		var p = this.smoothPoint(this.oldLeftEyePos, eyeL.position, 0.5);
		this.oldLeftEyePos = p;
		this.leftEye.position = p;
		var ang = this.smooth(this.lastLeftEyeRot, this.radsToDeg(eyeL.angle), 0.5);
		this.lastLeftEyeRot = ang;
		this.leftEye.rotate(ang - this.leftEye.rotation);
		scaleCloud(this.leftEye, this.leftScalingTimer);

		//position the right cloud
		var p2 = this.smoothPoint(this.oldRightEyePos, eyeR.position, 0.5);
		this.oldRightEyePos = p2;
		this.rightEye.position = p2;
		var ang2 = this.smooth(this.lastRightEyeRot, this.radsToDeg(eyeR.angle), 0.5);
		this.lastRightEyeRot = ang2;
		this.rightEye.rotate(ang - this.rightEye.rotation);
		scaleCloud(this.rightEye, this.rightScalingTimer);

		//update the stripes / lightnings
		for(var i=0; i < this.stripes.length; ++i)
		{
			var p3 = this.smoothPoint(this.stripes[i].lastPos, head.position, this.stripes[i].easeFact);
			this.stripes[i].lastPos = p3;
			this.stripes[i].path.position = p3;
			this.stripes[i].path.dashOffset += frameTime * this.stripes[i].speed;
		}

		this.timeElapsed += frameTime;
		this.lightning.fillColor.brightness = noise.simplex2(this.timeElapsed, 0);

		//update the rain particles
		this.rainNoiseTimer += frameTime * this.rainNoiseTimeDelta;
		var i = this.rainDrops.length;
		while(i--) 
		{
			if(this.rainDrops[i].dropPath)
				this.rainDrops[i].dropPath.remove();

			this.rainDrops[i].pos = this.rainDrops[i].pos.add([0.0, 80.0 * frameTime * this.rainDrops[i].rad]);
			var n = noise.simplex3(this.rainDrops[i].pos.x / this.rainNoiseDiv, this.rainDrops[i].pos.y / this.rainNoiseDiv, this.rainNoiseTimer) * Math.PI;
			this.rainDrops[i].pos = this.rainDrops[i].pos.add(new paper.Point(Math.cos(n), Math.sin(n)).multiply(this.rainNoiseScale));
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

		//make one new rain drop every frame
		var posRef = calc.random(0.0, 1.0) >= 0.5 ? this.rightEye : this.leftEye
		var rdp = posRef.position.add([calc.random(-posRef.bounds.width * 0.5, posRef.bounds.width * 0.5), calc.random(0.0, posRef.bounds.height * 0.5)]);
		
		var dropColor;
		if(!this.rainbowRain)
			dropColor = new Color({ hue: calc.random(200.0, 220.0), saturation: calc.random(0.5, 1.0), brightness: calc.random(0.8, 1.0) })
		else
			dropColor = new Color({ hue: calc.random(0.0, 360.0), saturation: calc.random(0.75, 1.0), brightness: calc.random(0.9, 1.0) })
		dropColor = mixColor(dropColor.convert("rgb"), this.skyColor.convert("rgb"), 0.25);
		this.rainDrops.push({dropPath: null, age: 0, lifeTime: calc.random(0.5, 2.0), rad: calc.random(raindropRad, raindropRad * 4.0), pos: new paper.Point(rdp), color: dropColor});
	}

	show() {
		//Stuff is being generated in here so it's a new scene everytime the mask is shown again.
		this.showLayer();

		//this is necessary to make sure the newly created things land on the proper layer.
		this.layer.activate();

		//remove all previous stuff
		this.layer.removeChildren();

		//re-randomize the noise seed
		noiseSeed = Math.random(0, 255);

		//pick some colors to work with
		var skyColor = new Color({ hue: calc.random(0.0, 360.0), saturation: calc.random(0.5, 1.0), brightness: calc.random(0.9, 1.0) });
		this.skyColor = skyColor;
		var groundColor = new Color({ hue: skyColor.hue + 180.0, saturation: calc.random(0.25, 0.6), brightness: calc.random(0.25, 0.6) });

		//used for the shadows on the cloud
		var lightDir = new paper.Point(0, -1).rotate(calc.random(-90.0, 90.0)).normalize();

		//helper to make a cloud
		function makeCloud()
		{
			var grp = new paper.Group();
			grp.transformContent = false;
			var w = calc.random(minCloudSize, maxCloudSize);
			var tmp = new paper.Path.Ellipse(new paper.Point(0, 0), [w, w * calc.random(0.5, 0.75)]);
			var sw = calc.random(minCloudArc, maxCloudArc);
			var ret = arcifyPath(tmp, sw, sw * 3.0);
			tmp.remove();
			var cloudColor = new Color({hue: calc.random(0.0, 360.0), saturation: calc.random(0.0, 0.25), brightness: 1.0});
			cloudColor = mixColor(cloudColor.convert("rgb"), skyColor.convert("rgb"), 0.15);
			ret.fillColor = cloudColor;
			ret.applyMatrix = false;
			applyNoiseToPath(ret, cloudNoiseSampleDist, cloudNoiseDiv, cloudNoiseScale);

			grp.addChild(ret.clone());
			grp.addChild(ret);
			var shadow = new paper.Path.Rectangle(ret.bounds);
			var ellipse = new paper.Path.Ellipse(ret.bounds);
			ellipse.translate(lightDir.multiply(calc.random(cloudShadowOff, cloudShadowOff * 2.5)));
			applyNoiseToPath(ellipse, cloudNoiseSampleDist * 5.0, calc.random(cloudNoiseDiv / 6.0, cloudNoiseDiv / 3.0), cloudNoiseScale / 5.0);
			var shadowCP = new paper.CompoundPath(shadow, ellipse);
			var shadowCol = mixColor(cloudColor.convert("rgb"), groundColor.convert("rgb"), 0.15);
			shadowCP.fillColor = shadowCol;
			grp.addChild(shadowCP);
			grp.clipped = true;
			return grp;
		}

		//some random flags for the lightning/stripe things in the foreground
		var bRoundStripeStroke = calc.random(0.0, 1.0) >= 0.5;
		var bSmoothStripes = calc.random(0.0, 1.0) >= 0.5;

		//function to generate a stripe/lightning
		function makeStripe()
		{
			var ret = new paper.Path();
			var pc = calc.randomInt(3, 12);
			for(var i = 0; i < pc; i++)
			{
				ret.add(new paper.Point(calc.random(0, stripeMaxX), calc.random(0, stripeMaxY)));
			}
			if(bSmoothStripes)
				ret.smooth();
			var len = ret.length;
			ret.dashArray = [len * 0.1, len * calc.random(1.0, 10.0)];
			var stripeColor = new Color({ hue: calc.random(0.0, 360.0), saturation: calc.random(0.75, 1.0), brightness: calc.random(0.9, 1.0) })
			stripeColor = mixColor(stripeColor.convert("rgb"), skyColor.convert("rgb"), 0.25);
			ret.strokeColor = stripeColor;
			ret.strokeWidth = calc.random(stripeRad, stripeRad * 6.0);
			ret.blendMode = "overlay";
			if(bRoundStripeStroke)
			{
				ret.strokeCap = "round";
				ret.strokeJoin = "round";
			}
			return ret;
		}

		//make one cloud for each eye
		this.leftEye = makeCloud();
		this.rightEye = makeCloud();

		//some helpers to animate the clouds
		this.oldLeftEyePos = new paper.Point(0, 0);
		this.lastLeftEyeRot = 0.0;
		this.leftScalingTimer = {time: calc.random(0.0, Math.PI)};
		this.rightScalingTimer = {time: calc.random(0.0, Math.PI)};
		this.oldRightEyePos = new paper.Point(0, 0);
		this.lastRightEyeRot = 0.0;

		//simple particle system for the raindrops
		this.rainDrops = [];
		this.lastFrameTime = Date.now();
		this.rainNoiseTimer = 0;
		this.rainbowRain = calc.random(0.0, 1.0) >= 0.75;
		this.rainStyle = calc.randomInt(0, 2);

		//randomize the noise stuff for the rain particles
		this.rainNoiseScale = calc.random(globalScale * 0.5, globalScale * 1.25);
		this.rainNoiseDiv = calc.random(stripeMaxX / 3.0, stripeMaxX);
		this.rainNoiseTimeDelta = calc.random(0.1, 1.0);

		//generate the stripes/lightnings
		this.stripes = [];
		for(var i=0; i < calc.randomInt(3, 15); i++)
		{
			var stripePath = makeStripe();
			this.stripes.push({path: stripePath, lastPos: new paper.Point(0, 0), easeFact: calc.random(0.5, 0.95), speed: calc.random(1600.0, 2500.0)});
		}

		//make one extra stripe that darkens everything (fake lighting)
		var darkenStripe = makeStripe();
		darkenStripe.blendMode = "overlay";
		darkenStripe.strokeColor = new Color(0.0, 0.0, 0.0, 0.5);
		darkenStripe.strokeWidth = calc.random(stripeMaxX / 5.0, stripeMaxX / 1.5);
		darkenStripe.shadowColor = new Color(0.0, 0.0, 0.0, 1.0);
		darkenStripe.shadowBlur = stripeMaxX / 15.0;
		darkenStripe.shadowOffset = new paper.Point(stripeMaxX / 15.0, stripeMaxX / 9.0);
		darkenStripe.strokeCap = "round";
		darkenStripe.strokeJoin = "round";
		this.stripes.push({path: darkenStripe, lastPos: new paper.Point(0, 0), easeFact: calc.random(0.5, 0.95), speed: calc.random(1600.0, 2500.0)});

		//make one fullscreen quad that serves as another lighting/flash effect
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
