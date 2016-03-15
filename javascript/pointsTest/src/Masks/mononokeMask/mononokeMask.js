'use strict';

/*
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
}*/

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

		/*if(this.headShape)
			this.headShape.remove();

		var headRad = Math.abs(chin.position.y - head.position.y);
		var headPos = this.smoothPoint(this.lastHeadPoint, head.position, 0.5);
		this.lastHeadPoint = headPos;
		this.headShape = new paper.Path.Ellipse(headPos.subtract([headRad, headRad]), [headRad * 2, headRad * 2]);
		this.headShape.fillColor = "white";*/
		//noiseSeed += 0.01;
		//applyNoiseToPath(this.headShape, 200, 500, 40.0);
	}
	//------------------------------------------
	smoothPoint(valueOld, valueNew, smooth) {
		return valueOld.multiply(smooth).add(valueNew.multiply(1 - smooth));
	}

	show() {
		this.showLayer();
		/*this.layer.removeChildren();
		this.noiseTimer = 0;
		noiseSeed = calc.random(0, 255);
		this.lastHeadPoint = new paper.Point(0, 0);*/
	}

	hide() {
		this.hideLayer();
	}
}
