'use strict';


// I think these lines need some smoothing (blurring) 
// or to be offset in 3d...  
// don't have the right look yet  : /


class lineDisplaceMask extends MaskBase {

	//------------------------------------------
	setup() {
		super.addLayer();
		this.name = "lineDisplaceMask"


		this.pts = [];
		this.origPts = [];
		this.nLines = 35;
		this.resolution = 40;
		this.paths = [];

		this.lines = [];

		for (var i = 0; i < this.nLines; i++) {

			var pathTemp = new paper.Path();

			for (var j = 0; j < this.resolution; j++) {
				var pt = new paper.Point(j * 20 + 100, i * 20 + 200);

				pathTemp.add(pt);

				//var path = new paper.Path.Line(pt, pt.add(new paper.Point(0, 3)));
				//path.strokeColor = 'white';

				//this.paths.push(path);
				this.pts.push(pt);
				this.origPts.push(pt);

			}
			pathTemp.strokeColor = 'white';
			pathTemp.strokeWidth = 3.0;
			this.lines.push(pathTemp);
		}

	}

	//------------------------------------------
	update(data) {



		var counter = 0;


		var tempPt = data['faceParts']['eyeL']['position'];
		var tempPt2 = data['faceParts']['eyeR']['position'];
		var radius = 100;


		for (var i = 0; i < this.nLines; i++) {
			for (var j = 0; j < this.resolution; j++) {

				var diff = this.pts[counter].subtract(tempPt);
				if (diff.length < 100) {
					//console.log(diff.length)
					var scale = 1.0 - (diff.length / 100.0);
					scale = Math.pow(scale, 1.3);
					//if (scale > 0.3) scale = 0.3;
					this.pts[counter] = this.pts[counter].add(diff.normalize(6.0 * scale));
				}

				var diff2 = this.pts[counter].subtract(tempPt2);
				if (diff2.length < 100) {
					//console.log(diff.length)
					var scale = 1.0 - (diff2.length / 100.0);
					scale = Math.pow(scale, 1.3);
					//if (scale > 0.3) scale = 0.3;
					this.pts[counter] = this.pts[counter].add(diff2.normalize(6.0 * scale));
				}

				this.lines[i].segments[j].point = this.pts[counter];
				this.pts[counter] = this.pts[counter].multiply(0.9).add(this.origPts[counter].multiply(0.1));
				this.pts[counter].x = 0.7 * this.pts[counter].x + 0.3 * this.origPts[counter].x;
				//this.paths[counter].position = this.pts[counter];
				counter++;
			}

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