'use strict';

class head{
	constructor(){
		this.headGroup = new paper.Group();
		this.headGroup.transformContent = false;
		this.headGroup.pivot = [0, 0];

		var circleRadius = 3;
		this.shapesGroup = new paper.Group();
		this.shapesGroup.transformContent = false;
		this.shapesGroup.pivot = [0, 0];
 		var self = this;
 		paper.project.importSVG('assets/svg/GradientMask/GradientMask.svg', function(item) {
            // set gradients 
            var paths = item.children[0].children;
            for (var i = 0; i < paths.length; i++) {
            	if(i <= 1){ // brows
	            	paths[i].fillColor = {
					   gradient: {
					       stops: ['#87d0a1', '#ea4a73']
					   },
					   origin: paths[i].segments[0].point,
					   destination: paths[i].segments[1].point,
					}
					paths[i].fillColor.gradient.stops[1].color.alpha = 0.0;
            	}else{
					paths[i].fillColor = {
					   gradient: {
					       stops: ['#cf9777', '#a1002c']
					   },
					   origin: paths[i].segments[0].point,
					   destination: paths[i].segments[1].point,
					}
					paths[i].fillColor.gradient.stops[1].color.alpha = 0.0;
            	}
            	// paths[i].fullySelected = true;
            };
            self.headGroup.pivot = [item.bounds.width/2, 400];
            self.headGroup.addChild(item);

            console.log("item = " + item.children[0].children[0].segments[0]);
            // self.group.pivot = [self.group.bounds.width/2+pivotOffset.x, self.group.bounds.height/2+pivotOffset.y];
        });

		// 0
		this.spring = new Fx.Spring({
            'stiffness': 100,
            'friction': 5,
            // 'onMotion': function(t){console.log("t = " + t);}
         });

	}
	update(d, name){
		this.spring.start(this.spring.get(), d['faceParts'][name]['velocity'].length);
		this.headGroup.position = d['faceParts'][name]['position'];
		for (var i = 0; i < this.headGroup.children.length; i++) {
			// this.eyeGroup.children[i].segments[0].handleIn.angle = this.spring.get()*6-70;
			// this.eyeGroup.children[i].segments[1].handleIn.angle = this.spring.get()*10-90;
			// this.eyeGroup.children[i].segments[0].point.y = this.spring.get()*10+10;
			// this.eyeGroup.children[i].segments[0].handleOut.angle = this.spring.get()*20+100;
		};
		// this.eyeGroup.rotation = this.spring.get()*2;
		// this.eyeGroup.children[0].segments[0].handleIn.angle = this.spring.get()*20;
	}
}
class gradientMask extends MaskBase{
	setup(){
		super.addLayer();
		this.name = 'gradientMask';
		this.head = new head();
	}
	update(d){

		this.head.update(d, 'head');

	}
	show(){
		this.showLayer();
	}
	hide(){
		this.hideLayer();
	}

}