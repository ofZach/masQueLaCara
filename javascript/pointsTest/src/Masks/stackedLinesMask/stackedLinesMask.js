'use strict';

class FaceRect
{
	constructor(_path, _positionSmoothFact, _angleSmoothFact)
	{
		this.path = _path;
		this.path.applyMatrix = false;
		this.targetPosition = new paper.Point(0, 0);
		this.lastPosition = new paper.Point(0, 0);
		this.positionSmoothfactor = _positionSmoothFact;
		this.angleSmoothfactor = _angleSmoothFact;
		this.lastAngle = 0;
		this.targetAngle = 0;
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
		console.log(this.lastAngle);
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

class stackedLinesMask extends MaskBase {

	//------------------------------------------
	setup() {
		super.addLayer();
		this.name = "stackedLinesMask";
	}

	//------------------------------------------
	update(data) {
		// data contains face data, see dataPlayer.js, ie face parts data['faceParts']['eyeL']['position'] as well as face points, etc...
		var head = data['faceParts']['head'];
		var eyeL = data['faceParts']['eyeL'];
		var eyeR = data['faceParts']['eyeR'];

		this.outline.position = head.position;
		this.outline.rotate((head.angle * (180.0/Math.PI)) - this.outline.rotation);
		//console.log(head.position);

		for(var i = 0; i < this.rectangles.length; i++)
		{
			this.rectangles[i].faceRect.update(0.16666);
			this.rectangles[i].faceRect.setPosition(head.position);
			this.rectangles[i].faceRect.setAngle(head.angle * (180.0/Math.PI));
		}

		this.leftEye.update(0.1666);
		this.leftEye.setPosition(eyeL.position);
		this.leftEye.setAngle(head.angle * (180.0/Math.PI));

		this.rightEye.update(0.1666);
		this.rightEye.setPosition(eyeR.position);
		this.rightEye.setAngle(head.angle * (180.0/Math.PI));
	}

	show() 
	{
		this.showLayer();
		this.layer.removeChildren();
		this.layer.activate();

		var gridWidth = 400.0;
		var gridHeight = 500.0;
		var colCount = calc.randomInt(4, 9);
		var rowCount = calc.randomInt(4, 9);
		//rowCount = colCount;
		var center = new paper.Point(gridWidth * 0.5, gridHeight * 0.5);
		var cellWidth = gridWidth / colCount;
		var cellHeight = gridHeight / rowCount;
		var bounds = new paper.Path.Rectangle([0, 0], [gridWidth, gridHeight]);
		var cellCount = rowCount * cellCount;
		var emptyCells = cellCount;

		var cells = [];
		var rectangles = [];

		this.outline = new paper.Path.Rectangle([0, 0], new paper.Size(gridWidth, gridHeight));
		this.outline.strokeColor = "white";
		this.outline.applyMatrix = false;
		this.outline.visible = false;
		for(var x=0; x<colCount;x++)
		{
			for(var y=0; y<rowCount;y++)
			{
				cells.push({bIsEmpty: true});
			}
		}

		function cell(_col, _row)
		{
			return cells[_col * rowCount + _row];
		}

		function cellHasSpaceFor(_col, _row, _colCount, _rowCount)
		{
			if(_col + _colCount > colCount || _row + _rowCount > rowCount)
				return false;
			for(var x = _col; x < _col + _colCount; x++)
			{
				for(var y = _row; y < _row + _rowCount; y++)
				{
					if(!cell(x, y).bIsEmpty)
						return false;
				}
			}
			return true;
		}

		function markCellsFull(_col, _row, _colCount, _rowCount)
		{
			for(var x = _col; x < Math.min(_col + _colCount, colCount); x++)
			{
				for(var y = _row; y < Math.min(_row + _rowCount, rowCount); y++)
				{
					cell(x, y).bIsEmpty = false;
				}
			}
		}

		var initialHue = calc.random(0, 360.0);
		var bRainbow = calc.random(0, 1) >= 0.8;
		var fillMode = calc.randomInt(0, 5);
		var circleRadFact = calc.random(0.5, 1.0);
		var arcSizeFact = 1.0;
		if(calc.random(0, 1) >= 0.5)
			arcSizeFact = calc.random(1.0, 3.0);
		var bArcReorient = calc.random(0, 1) >= 0.5;
		var bSmoothArcs = calc.random(0, 1) >= 0.5;

		function placeRectangle(_colCount, _rowCount)
		{
			for(var x = 0; x < colCount; x++)
			{
				for(var y = 0; y < rowCount; y++)
				{
					if(cellHasSpaceFor(x, y, _colCount, _rowCount))
					{	
						var cc = _colCount;
						var rc = _rowCount;
						if(fillMode != 2 && fillMode != 4)
						{
							if(calc.random(0, 1) >= 0.9)
								cc = Math.max(1, cc - 1);
							if(calc.random(0, 1) >= 0.9)
								rc = Math.max(1, rc - 1);
						}
						var w = cellWidth * cc;
						var h = cellHeight * rc;
						var xp = x * cellWidth;
						var yp = y * cellHeight;
						var col;
						if(bRainbow)
						{
							col = new Color({hue: calc.random(0, 360.0), saturation: calc.random(0.9, 1), brightness: calc.random(0.9, 1)});
						}
						else
						{
							col = new Color({hue: initialHue + calc.random(-20.0, 20.0), saturation: calc.random(0, 1), brightness: calc.random(0.8, 1)});
						}
						if(calc.random(0, 1) >= 0.5)
							col.hue += calc.random(160.0, 200.0);
						else if(calc.random(0, 1) >= 0.75)
							col = "white";
						else if(calc.random(0, 1) >= 0.75)
							col.brightness = calc.random(0.1, 0.5);
						

						function makeLines()
						{
							var grp = new paper.Group();
							var lineHeight = 0;
							var lineCount = 0;
							while(lineHeight <= 2.0)
							{
								lineCount = calc.randomInt(5, 60);
								lineHeight = h / lineCount / 2;
							}
							for(var j=0; j < lineCount; j++)
							{
								var p = new paper.Path.Rectangle(new paper.Point(xp, yp + lineHeight * 2.0 * j), new paper.Size(w, lineHeight));
								p.fillColor = col;
								grp.addChild(p);
							}
							return grp;
						}

						function makeRect()
						{
							var p = new paper.Path.Rectangle(new paper.Point(xp, yp), new paper.Size(w, h));
							p.fillColor = col;
							return p;
						}

						function makeCircle()
						{
							var rad = Math.min(w, h) * circleRadFact;
							var p = new paper.Path.Circle(new paper.Point(xp + rad, yp + rad), rad);
							p.fillColor = col;
							return p;
						}

						function makeArc()
						{
							var rad = Math.min(w, h) * arcSizeFact;
							var p = new paper.Path();
							p.add(0, 0);
							p.arcTo(0, rad, calc.random(0, 1) >= 0.5);
							p.position = new paper.Point(xp + w * 0.5, yp + h * 0.5);
							p.fillColor = col;
							p.closePath();
							if(bArcReorient)
							{
								p.rotate(Math.PI * 0.25 * calc.randomInt(1, 5) * (180.0/Math.PI));
							}
							if(bSmoothArcs)
								p.smooth();
							return p;
						}

						var item;
						if(fillMode == 0)
						{
							item = makeLines();
						}
						else if(fillMode == 1)
						{
							item = makeRect();
						}
						else if(fillMode == 2)
						{
							item = makeCircle();
						}
						else if(fillMode == 3)
						{
							if(calc.random(0, 1) >= 0.5)
								item = makeLines();
							else if(calc.random(0, 1) >= 0.5) 
								item = makeRect();
							else if(calc.random(0, 1) >= 0.5)
								item = makeCircle();
							else
								item = makeArc();
						}
						else if(fillMode == 4)
						{
							item = makeArc();
						}

						item.pivot = center;
						rectangles.push({faceRect: new FaceRect(item, calc.random(0.75, 0.9), calc.random(0.5, 0.75)), offset: center.subtract(new paper.Point(xp - w * 0.5, yp - h * 0.5))});
						markCellsFull(x, y, _colCount, _rowCount);
						return true;
					}
				}
			}

			return false;
		}

		for(var i=0; i < 100; i++)
		{
			var rc = calc.randomInt(1, 3);
			var cc = calc.randomInt(1, 3);
			if(placeRectangle(cc, rc))
			{
				emptyCells -= rc * cc;
			}

			if(emptyCells <= 0)
				break;
		}

		this.rectangles = rectangles;

		//make the eyes
		var eyeMode = calc.randomInt(0, 2);
		if(eyeMode == 0)
		{
			var eyeWidth = gridWidth / calc.random(5.0, 12.0);
			var hFact = calc.random(0.5, 1.0);
			var eyeCol = new Color(0, 0, 0, 1.0);
			var leftEye = new paper.Path.Rectangle([0,0], new paper.Size(eyeWidth, eyeWidth * hFact));
			leftEye.fillColor = eyeCol;
			//leftEye.blendMode = "overlay";
			var rightEye = new paper.Path.Rectangle([0,0], new paper.Size(eyeWidth, eyeWidth * hFact));
			rightEye.fillColor = eyeCol;
			//rightEye.blendMode = "overlay";

			this.leftEye = new FaceRect(leftEye, 0.75, 0.75);
			this.rightEye = new FaceRect(rightEye, 0.75, 0.75);
		}
		else if(eyeMode == 1)
		{
			var eyeRad = gridWidth / calc.random(10.0, 14.0);
			var leftEye = new paper.Path.Circle([0,0], eyeRad);
			var eyeCol = new Color(0, 0, 0, 1.0);
			leftEye.fillColor = eyeCol;
			//leftEye.blendMode = "overlay";
			var rightEye = new paper.Path.Circle([0,0], eyeRad);
			rightEye.fillColor = eyeCol;
			//rightEye.blendMode = "overlay";

			this.leftEye = new FaceRect(leftEye, 0.75, 0.75);
			this.rightEye = new FaceRect(rightEye, 0.75, 0.75);
		}
	}

	hide() {
		this.hideLayer();
	}
}
