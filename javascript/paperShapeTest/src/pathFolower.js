'use strict';
class Follower {
	setup(waitDistance){
		this.waitDistance = waitDistance;
		this.waitCounter = waitDistance;
		this.offset = 0;
		this.curCurveNum = 0;
		this.point = new paper.Point(0, 0);
		this.speed = 1;
		this.curTotalDistance = 0;
	}
	update(curves, totalDistance, endFunction){
		if(this.waitCounter<0){
			this.point = curves[this.curCurveNum].getPointAt(this.offset);
			this.offset += this.speed;
			this.curTotalDistance += this.speed;
			if(this.offset > curves[this.curCurveNum].length){
				this.offset = 0;
				this.curCurveNum++;
				if(this.curCurveNum > curves.length - 1){
					this.curCurveNum = 0;
				}
			}
			if(this.curTotalDistance > totalDistance){
				this.waitCounter = this.waitDistance;
				endFunction();
			}
		}else{
			this.waitCounter-= this.speed;
		}
	}
}
class PathFollower {
	setup(count){
		this.animatedPath = new paper.Path();
		this.animatedPath.strokeColor = 'red';
		this.animatedPath.strokeWidth = 2;
		this.animatedPath.fullySelected = true;
		this.distance = 20;
		this.followers = [];
		
		this.typeLayer = new paper.Layer();
		
		for (var i = 0; i < count; i++) {
			this.animatedPath.add(new paper.Point(0, 0));
			this.followers.push(new Follower()) ;
			this.followers[i].setup(i*this.distance);

			var text = new paper.PointText({
				point: paper.view.center,
				justification: 'center',
				fontSize: 10,
				fillColor: 'white'
			});
			text.content = i;
		};
	}
	update(path, totalDistance){
		for (var i = 0; i < this.animatedPath.segments.length; i++) {
			this.animatedPath.segments[i].point = this.followers[i].point;
			this.typeLayer.children[i].point = this.followers[i].point;
			this.followers[i].update(path.curves);
		};
		this.animatedPath.smooth();
	}
}