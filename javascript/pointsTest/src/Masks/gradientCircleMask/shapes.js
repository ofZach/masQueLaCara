'use strict';
class shapeType{
	constructor(d){
		this.shapeType;
		if(d.shape == 'circle'){
			this.shapeType = new shapeCircle(d);
		}else if(d.shape == 'halfCircle'){
			this.shapeType = new shapeCircle(d);
			this.shapeType.path.removeSegment(0);
			this.shapeType.path.closed = false;
		}else if(d.shape == 'polygon'){
			this.shapeType = new shapePolygon(d);
		}
	}
};
class shapeCircle{
	constructor(d){
		this.path = new paper.Path.Circle({
				center: [0, 0],
				radius: d.radius,
				strokeWidth: d.stroke,
				strokeColor:{
					   gradient: {
					       stops: [d.startColor, d.endColor]
					   },
					   origin: [-d.radius, 0],
					   destination:  [d.radius, 0],
				}
		});
		this.path.strokeColor.gradient.stops[0].color.alpha = 0.2;
		this.path.strokeColor.gradient.stops[1].color.alpha = 0.9;
	}
};
class shapePolygon{
	constructor(d){
		this.path = new paper.Path.RegularPolygon({
			center: [0, 0],
			sides: d.sides,
			strokeWidth: d.stroke,
			radius: d.radius,
			strokeColor:{
					   gradient: {
					       stops: [d.startColor, d.endColor]
					   },
					   origin: [-d.radius, 0],
					   destination:  [d.radius, 0],
			},

		});
		this.path.strokeColor.gradient.stops[0].color.alpha = 0.2;
		this.path.strokeColor.gradient.stops[1].color.alpha = 0.9;
	}
};