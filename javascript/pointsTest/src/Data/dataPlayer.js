'use strict';



//* Input: A list of points, where each point is an object {x: float, y: float}, e.g. [{x:0,y:5}, {x:3.1,y:-2.7}].
//* Output: A circle object of the form {x: float, y: float, r: float}


class dataPlayer {



	//-------------------------------------------------------------
	setup() {


		this.viewScale = 1.3;
		this.frame = 0;
		this.frameAnalysis = {};
		this.angleSmoothing = 0.1;
		this.firstFrame = true;
		this.refFrame = false;
		this.nPts = 68;

		this.ptsForCircleTest = [];
		this.prevFrameData = []; // for velocity calculation
		this.velocity = []; // for velocity calculation


		this.referenceSizes = {};

		//--------------------------------------------
		// these are 'regions' on the face or 'points'
		// both have lines which is used for scale and angle calculations

		this.faceParts = {
			mouth: {
				region: {
					start: 48,
					end: 60
				},
				line: {
					start: 48,
					end: 54
				}
			},
			head: {
				region: {
					start: 0,
					end: 67
				},
				line: {
					start: 3,
					end: 13
				}
			},
			eyeL: {
				region: {
					start: 36,
					end: 41
				},
				line: {
					start: 36,
					end: 39
				}
			},
			eyeR: {
				region: {
					start: 42,
					end: 47
				},
				line: {
					start: 42,
					end: 45
				}
			},
			nose: {
				region: {
					start: 29,
					end: 35
				},
				line: {
					start: 31,
					end: 35
				}
			},
			browL: {
				region: {
					start: 18,
					end: 20
				},
				line: {
					start: 18,
					end: 20
				}
			},
			browR: {
				region: {
					start: 23,
					end: 25
				},
				line: {
					start: 23,
					end: 25
				}
			},
			cheekL: {
				line: {
					start: 3,
					end: 31
				}
			},
			cheekR: {
				line: {
					start: 35,
					end: 13
				}
			},
			lipUpper: {
				line: {
					start: 50,
					end: 52
				}
			},
			lipLower: {
				line: {
					start: 58,
					end: 56
				}
			},
			chin: {
				line: {
					start: 7,
					end: 9
				}
			},
			earR: {
				line: {
					start: 16,
					end: 14
				}
			},
			earL: {
				line: {
					start: 0,
					end: 2
				}
			}
		};

		// allocate the points
		this.frameAnalysis['points'] = [];
		for (var i = 0; i < 68; i++) {
			this.frameAnalysis['points'].push(new paper.Point(0, 0));
			var ptObj = {
				x: 0,
				y: 0
			};
			this.ptsForCircleTest.push(ptObj);

			this.prevFrameData.push(new paper.Point(0, 0));

			this.velocity.push(0.0);
		}
		//console.log(this.ptsForCircleTest);

		this.frameAnalysis['faceParts'] = {};

		for (var k in this.faceParts) {
			this.frameAnalysis['faceParts'][k] = {};
			this.frameAnalysis['faceParts'][k]['position'] = new paper.Point(0, 0);
			this.frameAnalysis['faceParts'][k]['angle'] = 0;
			this.frameAnalysis['faceParts'][k]['scale'] = 1;
			this.frameAnalysis['faceParts'][k]['velocity'] = new paper.Point(0, 0);
		}

		this.frameAnalysis['boundingCircle'] = {};

	}


	//-------------------------------------------------------------
	setupDebugView() {
		// circles
		this.layer = new paper.Layer();
		for (var i = 0; i < this.nPts; i++) {
			var path = new paper.Path.Circle(new paper.Point(100, 100), 5);
			this.layer.children[i].fillColor = (255, 255, 0, 0.1);
		}

		//type
		this.typeLayer = new paper.Layer();
		for (var i = 0; i < this.nPts; i++) {
			var text = new paper.PointText({
				point: paper.view.center,
				justification: 'center',
				fontSize: 10,
				fillColor: (255, 255, 0, 0.3)
			});
			text.content = i;
		}

		//face info
		this.regionsLayer = new paper.Layer();
		this.facePartDebug = {};
		this.facePartVel = {};

		var count = 0;
		for (var k in this.faceParts) {

			var circle = new paper.Path.Circle(new paper.Point(0, 0), 20);
			var line = new paper.Path.Line(new paper.Point(0, 0), new paper.Point(20, 0));
			circle.fillColor = 'green';
			circle.opacity = 0.4;
			//line.strokeColor = 'red';
			line.strokeColor = '#ff0000';
			line.strokeWidth = 2;
			line.opacity = 0.8;
			this.facePartDebug[k] = new paper.Group(circle, line);
			this.facePartDebug[k].transformContent = false;
			this.facePartDebug[k].position.x = count * 100;
			this.facePartDebug[k].position.y = 100;

			this.facePartDebug[k].pivot = new paper.Point(0, 0);

			this.facePartVel[k] = new paper.Path.Line(new paper.Point(100, 100), new paper.Point(150, 150));
			this.facePartVel[k].strokeColor = '#ffff00';
			this.facePartVel[k].strokeWidth = 1;
			//this.facePartDebug[k] = new paper.Path.Circle(new paper.Point(count * 100, 100), 30);

			count++;
		}

		var overallCirc = new paper.Path.Circle({
			center: [80, 50],
			radius: 100,
			strokeWidth: 1,
			strokeColor: 'red'
		});
		overallCirc.dashArray = [3, 3];
		overallCirc.opacity = 0.3;

		this.overallSize = new paper.Group(overallCirc);
		this.overallSize.transformContent = false;


	}

	setDebugView(value) {

		if (value === true) {
			this.regionsLayer.visible = true;
			this.typeLayer.visible = true;

		} else {
			this.regionsLayer.visible = false;
			this.typeLayer.visible = false;
		}
	}

	//-------------------------------------------------------------
	loadData(jsonData) {
		this.dataObject = JSON.parse(jsonData);
		this.frame = 0;
		this.firstFrame = true;
		console.log("loaded");
	}


	//-------------------------------------------------------------
	update() {


		this.frame++;
		this.frame %= this.dataObject.length;
		var frameData = this.dataObject[this.frame];

		// copy the data in! 

		var totalVel = 0.0;

		for (var i = 0; i < 68; i++) {


			this.prevFrameData[i].x = this.frameAnalysis['points'][i].x;
			this.prevFrameData[i].y = this.frameAnalysis['points'][i].y;

			this.frameAnalysis['points'][i].x = frameData[i][0] * this.viewScale;
			this.frameAnalysis['points'][i].y = frameData[i][1] * this.viewScale;

			if (!this.firstFrame) {
				this.velocity[i] = this.frameAnalysis['points'][i].getDistance(this.prevFrameData[i]);
				totalVel += this.velocity[i];
			}

			this.ptsForCircleTest[i].x = this.frameAnalysis['points'][i].x;
			this.ptsForCircleTest[i].y = this.frameAnalysis['points'][i].y;
		}

		//console.log(totalVel);

		this.frameAnalysis['boundingCircle'] = makeCircle(this.ptsForCircleTest);

		this.overallSize.scaling = this.frameAnalysis['boundingCircle'].r / 100.0;
		this.overallSize.position.x = this.frameAnalysis['boundingCircle'].x;
		this.overallSize.position.y = this.frameAnalysis['boundingCircle'].y;
		//console.log(circleObj);

		//----------------------------------------------------------------------
		for (var i = 0; i < 68; i++) {
			var item = this.layer.children[i];
			item.position.x = this.frameAnalysis['points'][i].x;
			item.position.y = this.frameAnalysis['points'][i].y;
			item = this.typeLayer.children[i];
			item.position.x = this.frameAnalysis['points'][i].x;
			item.position.y = this.frameAnalysis['points'][i].y + 10;
		}

		for (var k in this.faceParts) {

			//-------------------------------------- position
			// calculate the points, different if we have a region (use centroid) vs line...

			if (typeof this.faceParts[k].region !== 'undefined') {
				this.computeAveragePosition(this.frameAnalysis['points'],
					this.frameAnalysis['faceParts'][k]['position'],
					this.faceParts[k].region.start,
					this.faceParts[k].region.end);
			} else {
				this.computeMidPosition(this.frameAnalysis['points'],
					this.frameAnalysis['faceParts'][k]['position'],
					this.faceParts[k].line.start,
					this.faceParts[k].line.end);
			}

			//--------------------------------------- scale

			if (this.firstFrame === true ||
				this.refFrame === true) {
				this.referenceSizes[k] = this.calcDistance(this.frameAnalysis['points'], this.faceParts[k].line.start, this.faceParts[k].line.end);
			}
			var sizeNow = this.calcDistance(this.frameAnalysis['points'], this.faceParts[k].line.start, this.faceParts[k].line.end);
			var scale = sizeNow / this.referenceSizes[k];
			this.frameAnalysis['faceParts'][k]['scale'] = Math.pow(scale, 1.3);

			//--------------------------------------- angle

			this.frameAnalysis['faceParts'][k]['angle'] = this.calcAngle(this.frameAnalysis['points'], this.faceParts[k].line.start, this.faceParts[k].line.end);


			//this.facePartDebug[k].position.x = this.frameAnalysis['points'][0].x;
			//this.facePartDebug[k].position.y = this.frameAnalysis['points'][0].y;

			var pos = this.frameAnalysis['faceParts'][k]['position'];
			this.facePartDebug[k].rotation = this.frameAnalysis['faceParts'][k]['angle'] * (180.0 / Math.PI);
			this.facePartDebug[k].scaling = this.frameAnalysis['faceParts'][k]['scale'];

			if (totalVel > 0.01) {
				if (this.frame > 0) {
					this.frameAnalysis['faceParts'][k]['velocity'] = pos.subtract(this.facePartDebug[k].position);
					//console.log(this.facePartVel[k].segments);
					this.facePartVel[k].segments[0].point.x = pos.x;
					this.facePartVel[k].segments[0].point.y = pos.y;
					this.facePartVel[k].segments[1].point.x = pos.x + this.frameAnalysis['faceParts'][k]['velocity'].x * 8.0;
					this.facePartVel[k].segments[1].point.y = pos.y + this.frameAnalysis['faceParts'][k]['velocity'].y * 8.0;
				}
				//console.log(this.frameAnalysis['faceParts'][k]['velocity']);
			}

			this.facePartDebug[k].position = pos;

		}

		this.firstFrame = false;
		this.refFrame = false;
		//console.log(this.frameAnalysis['faceParts']['mouth']['angle']);
	}

	//-------------------------------------------------------------
	computeAveragePosition(points, pt, startPos, endPos) {
		pt.x = 0;
		pt.y = 0;
		for (var i = startPos; i <= endPos; i++) {
			pt.x += points[i].x;
			pt.y += points[i].y;
		}
		pt.x /= (endPos - startPos + 1);
		pt.y /= (endPos - startPos + 1);
	}

	computeMidPosition(points, pt, startPos, endPos) {
		// we use paper.Point here since we are in javascript mode not paperscript mode
		// paper point is a little weird here, have to do this w/ x and y sep. 
		pt.x = 0;
		pt.y = 0;
		pt.x += points[startPos].x;
		pt.y += points[startPos].y;
		pt.x += points[endPos].x;
		pt.y += points[endPos].y;
		pt.x /= 2.0;
		pt.y /= 2.0;

	}

	calcDistance(points, startPos, endPos) {
		return points[endPos].getDistance(points[startPos]);
	}

	calcPolygonArea(points, startPos, endPos) {
		var total = 0;
		for (var i = startPos, l = (endPos + 1); i < l; i++) {
			var addX = points[i].x;
			var addY = points[i == (endPos + 1) - 1 ? 0 : i + 1].y;
			var subX = points[i == (endPos + 1) - 1 ? 0 : i + 1].x;
			var subY = points[i].y;
			total += (addX * addY * 0.5);
			total -= (subX * subY * 0.5);
		}
		return Math.abs(total);
	}

	calcAngle(points, indexL, indexR) {
		return Math.atan2(points[indexR].y - points[indexL].y,
			points[indexR].x - points[indexL].x);
	}


};