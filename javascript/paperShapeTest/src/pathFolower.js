'use strict';
class Follower {
	setup(_offset){
		this.offset = _offset;
		this.curCurveNum = 0;
		this.point = new paper.Point(0, 0);
		this.speed = 2;
	}
	update(curves){
		this.point = curves[this.curCurveNum].getPointAt(this.offset);
		this.offset += this.speed;
		if(this.offset > curves[this.curCurveNum].length){
			this.offset = 0;
			this.curCurveNum++;
			if(this.curCurveNum > curves.length - 1){
				this.curCurveNum = 0;
			}
		}
	}
}
class PathFollower {
	setup(count){
		this.animatedPath = new paper.Path();
		this.animatedPath.strokeColor = 'red';
		this.animatedPath.strokeWidth = 2;

		this.distance = 300;
		this.followers = [];
		for (var i = 0; i < count; i++) {
			this.animatedPath.add(new paper.Point(0, 0));
			this.followers.push(new Follower()) ;
			this.followers[i].setup(i*20);
		};
	}
	update(path){
		for (var i = 0; i < this.animatedPath.segments.length; i++) {
			this.animatedPath.segments[i].point = this.followers[i].point;
			this.followers[i].update(path.curves);
		};
		this.animatedPath.smooth();
	}
}