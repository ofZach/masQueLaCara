'use strict';


// I think these lines need some smoothing (blurring) 
// or to be offset in 3d...  
// don't have the right look yet  : /

class tempClass {

};

var THREE = new tempClass();

THREE.Vector3 = function(x, y, z) {

	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0;

};


THREE.Vector3.prototype = {

	constructor: THREE.Vector3,

	set: function(x, y, z) {

		this.x = x;
		this.y = y;
		this.z = z;

		return this;

	},

	setX: function(x) {

		this.x = x;

		return this;

	},

	setY: function(y) {

		this.y = y;

		return this;

	},

	setZ: function(z) {

		this.z = z;

		return this;

	},

	copy: function(v) {

		this.x = v.x;
		this.y = v.y;
		this.z = v.z;

		return this;

	},

	clone: function() {

		return new THREE.Vector3(this.x, this.y, this.z);

	},


	add: function(v1, v2) {

		this.x = v1.x + v2.x;
		this.y = v1.y + v2.y;
		this.z = v1.z + v2.z;

		return this;

	},

	addSelf: function(v) {

		this.x += v.x;
		this.y += v.y;
		this.z += v.z;

		return this;

	},

	addScalar: function(s) {

		this.x += s;
		this.y += s;
		this.z += s;

		return this;

	},

	sub: function(v1, v2) {

		this.x = v1.x - v2.x;
		this.y = v1.y - v2.y;
		this.z = v1.z - v2.z;

		return this;

	},

	subSelf: function(v) {

		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;

		return this;

	},

	multiply: function(a, b) {

		this.x = a.x * b.x;
		this.y = a.y * b.y;
		this.z = a.z * b.z;

		return this;

	},

	multiplySelf: function(v) {

		this.x *= v.x;
		this.y *= v.y;
		this.z *= v.z;

		return this;

	},

	multiplyScalar: function(s) {

		this.x *= s;
		this.y *= s;
		this.z *= s;

		return this;

	},

	divideSelf: function(v) {

		this.x /= v.x;
		this.y /= v.y;
		this.z /= v.z;

		return this;

	},

	divideScalar: function(s) {

		if (s) {

			this.x /= s;
			this.y /= s;
			this.z /= s;

		} else {

			this.x = 0;
			this.y = 0;
			this.z = 0;

		}

		return this;

	},


	negate: function() {

		return this.multiplyScalar(-1);

	},

	dot: function(v) {

		return this.x * v.x + this.y * v.y + this.z * v.z;

	},

	lengthSq: function() {

		return this.x * this.x + this.y * this.y + this.z * this.z;

	},

	length: function() {

		return Math.sqrt(this.lengthSq());

	},

	lengthManhattan: function() {

		// correct version
		// return Math.abs( this.x ) + Math.abs( this.y ) + Math.abs( this.z );

		return this.x + this.y + this.z;

	},

	normalize: function() {

		return this.divideScalar(this.length());

	},

	setLength: function(l) {

		return this.normalize().multiplyScalar(l);

	},


	cross: function(a, b) {

		this.x = a.y * b.z - a.z * b.y;
		this.y = a.z * b.x - a.x * b.z;
		this.z = a.x * b.y - a.y * b.x;

		return this;

	},

	crossSelf: function(v) {

		var x = this.x,
			y = this.y,
			z = this.z;

		this.x = y * v.z - z * v.y;
		this.y = z * v.x - x * v.z;
		this.z = x * v.y - y * v.x;

		return this;

	},


	distanceTo: function(v) {

		return Math.sqrt(this.distanceToSquared(v));

	},

	distanceToSquared: function(v) {

		return new THREE.Vector3().sub(this, v).lengthSq();

	},


	setPositionFromMatrix: function(m) {

		this.x = m.n14;
		this.y = m.n24;
		this.z = m.n34;

	},

	setRotationFromMatrix: function(m) {

		var cosY = Math.cos(this.y);

		this.y = Math.asin(m.n13);

		if (Math.abs(cosY) > 0.00001) {

			this.x = Math.atan2(-m.n23 / cosY, m.n33 / cosY);
			this.z = Math.atan2(-m.n12 / cosY, m.n11 / cosY);

		} else {

			this.x = 0;
			this.z = Math.atan2(m.n21, m.n22);

		}

	},

	isZero: function() {

		return (this.lengthSq() < 0.0001 /* almostZero */ );

	}

};


class lineDisplaceMask extends MaskBase {

	//------------------------------------------
	setup() {
		super.addLayer();
		this.name = "lineDisplaceMask"

		//var obj = new THREE.Vector3(0, 0, 0);


		this.pts = [];
		this.origPts = [];
		this.nLines = 35;
		this.resolution = 80;
		this.paths = [];

		this.lines = [];

		for (var i = 0; i < this.nLines; i++) {

			var pathTemp = new paper.Path();

			for (var j = 0; j < this.resolution; j++) {
				var pt = new THREE.Vector3(j * 120 + 200, i * 20 + 0, 1.0);
				//paper.Point(j * 120 + 200, i * 20 + 0);

				var ptPaper = new paper.Point(j * 10 + 200, i * 20 + 0);
				pathTemp.add(ptPaper);

				//var path = new paper.Path.Line(pt, pt.add(new paper.Point(0, 3)));
				//path.strokeColor = 'white';

				//this.paths.push(path);
				this.pts.push(pt.clone());
				this.origPts.push(pt.clone());

			}
			pathTemp.strokeColor = 'white';
			pathTemp.strokeWidth = 3.0;

			pathTemp.strokeColor = {
				gradient: {
					stops: ['aquamarine', 'red']
				},
				//origin and destination defines the direction of your gradient. In this case its vertical i.e bottom(blue/cooler) to up(red/warmer) refering to link you sent.
				origin: [0, 600], //gradient will start applying from y=200 towards y=0. Adjust this value to get your desired result
				destination: [0, 0]
			};

			this.lines.push(pathTemp);
		}

		this.frame = 0;

		this.eyeLpt = new THREE.Vector3(0, 0, 0);
		this.eyeRpt = new THREE.Vector3(0, 0, 0);
		this.mouthpt = new THREE.Vector3(0, 0, 0);
	}

	//------------------------------------------
	update(data) {



		var counter = 0;



		var tempPt = data['faceParts']['eyeL']['position'];
		this.eyeLpt.set(tempPt.x, tempPt.y, 0);
		tempPt = data['faceParts']['eyeR']['position'];
		this.eyeRpt.set(tempPt.x, tempPt.y, 0);
		tempPt = data['faceParts']['mouth']['position'];
		this.mouthpt.set(tempPt.x, tempPt.y, 0);

		//this.eyeLpt.y = tempPt.y;
		//console.log(this.eyeLpt);

		// var tempPt2 = data['faceParts']['eyeR']['position'];
		// var tempPt3 = data['faceParts']['mouth']['position'];
		var radius = 100;



		this.frame++;
		var scaler = 80; //30 + 30 * Math.sin(this.frame / 100.0);

		for (var i = 0; i < this.origPts.length; i++) {
			this.pts[i].set(this.origPts[i].x, this.origPts[i].y, this.origPts[i].z);
		}
		for (var i = 0; i < this.nLines; i++) {
			for (var j = 0; j < this.resolution; j++) {
				//console.log(this.origPts[counter]);

				var p = this.origPts[counter].clone();
				p.sub(p, this.eyeLpt);
				//console.log(p.length());
				var dist = p.length();
				if (dist < 100) {
					//onsole.log(p.length())
					var scale = 1.0 - (dist / 100.0);
					scale = Math.pow(scale, 0.9);
					var diffScaled = p.normalize(); //.multiply(p, 0.0);
					diffScaled.multiplyScalar(scaler * scale);
					//console.log(diffScaled);
					diffScaled.x = 0;
					diffScaled.z = 0;
					// 	//if (scale > 0.3) scale = 0.3;
					this.pts[counter].add(this.pts[counter], diffScaled);
				}

				this.eyeRpt.y = this.eyeLpt.y;
				p = this.origPts[counter].clone();
				p.sub(p, this.eyeRpt);
				//console.log(p.length());
				dist = p.length();
				if (dist < 150) {
					//onsole.log(p.length())
					var scale = 1.0 - (dist / 150.0);
					scale = Math.pow(scale, 1.5);
					var diffScaled = p.normalize(); //.multiply(p, 0.0);
					diffScaled.multiplyScalar(scaler * scale);
					//console.log(diffScaled);
					diffScaled.x = 0;
					diffScaled.z = 0;
					// 	//if (scale > 0.3) scale = 0.3;
					this.pts[counter].add(this.pts[counter], diffScaled);
				}

				p = this.origPts[counter].clone();
				p.sub(p, this.mouthpt);
				//console.log(p.length());
				dist = p.length();
				if (dist < 100) {
					//onsole.log(p.length())
					var scale = 1.0 - (dist / 100.0);
					scale = Math.pow(scale, 0.9);
					var diffScaled = p.normalize(); //.multiply(p, 0.0);
					diffScaled.multiplyScalar(scaler * scale * 0.2);
					//console.log(diffScaled);
					diffScaled.x = 0;
					diffScaled.z = 0;
					// 	//if (scale > 0.3) scale = 0.3;
					this.pts[counter].add(this.pts[counter], diffScaled);
				}



				// var diff2 = this.origPts[counter].subtract(tempPt2);
				// if (diff2.length < 200) {
				// 	//console.log(diff.length)
				// 	var scale = 1.0 - (diff2.length / 200.0);
				// 	scale = Math.pow(scale, 0.6);
				// 	var diffScaled = diff2.normalize(2 * scaler * scale);
				// 	diffScaled.x = 0;
				// 	//if (scale > 0.3) scale = 0.3;
				// 	this.pts[counter] = this.pts[counter].add(diffScaled);
				// }

				// var diff3 = this.origPts[counter].subtract(tempPt3);
				// if (diff3.length < 200) {
				// 	//console.log(diff.length)
				// 	var scale = 1.0 - (diff3.length / 200.0);
				// 	scale = Math.pow(scale, 1.1);
				// 	var diffScaled = diff3.normalize(scaler * scale);
				// 	diffScaled.x = 0;
				// 	//if (scale > 0.3) scale = 0.3;
				// 	this.pts[counter] = this.pts[counter].add(diffScaled);
				// }
				this.lines[i].segments[j].point.x = this.lines[i].segments[j].point.x * 0.9 + 0.1 * this.pts[counter].x;
				this.lines[i].segments[j].point.y = this.lines[i].segments[j].point.y * 0.9 + 0.1 * this.pts[counter].y;

				//console.log(this.lines[i].strokeColor);
				//this.lines[i].gradient.stops[0] = paper.Color(this.frame % 255, 0, 0, 0.8);

				//this.pts[counter] = this.pts[counter].multiply(0.9).add(this.origPts[counter].multiply(0.1));
				// this.pts[counter].x = 0.7 * this.pts[counter].x + 0.3 * this.origPts[counter].x;
				//this.paths[counter].position = this.pts[counter];
				counter++;
			}


			this.lines[i].strokeColor.gradient.stops[0].color.red = 0.5 + 0.5 * Math.sin(this.frame / 10.0); //.alpha = 0.5 + 0.5 * Math.sin(this.frame / 10.0);
			//this.lines[i].strokeColor.destination[1] = 500 + 500 * Math.sin(this.frame / 10.0);
			this.lines[i].strokeWidth = 5 + 3 * Math.cos(this.frame / 20.0);
			console.log(this.lines[i].strokeColor);
			this.lines[i].smooth({
				type: 'geometric'
			});
		}

		// data contains face data, see dataPlayer.js, ie face parts data['faceParts']['eyeL']['position'] as well as face points, etc...
	}

	show() {
		this.showLayer();
	}

	hide() {
		this.hideLayer();
	}
}