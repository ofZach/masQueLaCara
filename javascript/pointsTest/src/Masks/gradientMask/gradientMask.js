'use strict';

class SvgGrad{
	constructor(path, offset){
		this.headGroup = new paper.Group();
		this.headGroup.transformContent = false;
		this.headGroup.pivot = [0, 0];
		this.headP1pos = [];
 		var self = this;
 		paper.project.importSVG(path, function(item) {
            // set gradients 
            var paths = item.children[0].children;

            for (var i = 0; i < paths.length; i++) {
            	if(i <= 1){ 
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
            	self.headP1pos[i] = new paper.Point(paths[i].segments[0].point.x, paths[i].segments[0].point.y);
            	// paths[i].fullySelected = true;
            };
            self.headGroup.pivot = [item.bounds.width/2+offset[0], offset[1]];
            self.headGroup.addChild(item);
        });

		this.spring = new Fx.Spring({
            'stiffness': 100,
            'friction': 5,
            // 'onMotion': function(t){console.log("t = " + t);}
         });

	}	
	smoothValue(valueOld, valueNew, smooth){
 		return valueOld*smooth + (1-smooth)* valueNew;
	}
	update(d, name){
		var head = this.headGroup;
		var data = d['faceParts'][name];
		if(this.headGroup.children[0] != undefined){
			var paths = this.headGroup.children[0].children[0].children;
			for (var i = 0; i < paths.length; i++) {
				paths[i].segments[0].point.y = this.headP1pos[i].y+this.spring.get()*5;
			}
		}
		this.spring.start(this.spring.get(), data['velocity'].length);
		head.position = data['position'];
		head.rotation =  this.smoothValue(head.rotation, data['angle'] * (180.0 / Math.PI), 0.6);
		head.scaling.x = this.smoothValue(head.scaling.x, data['scale'], 0.7)+0.1;
		head.scaling.y = this.smoothValue(head.scaling.y, data['scale'], 0.7)+0.1;
	}
}
class gradientMask extends MaskBase{
	setup(){
		super.addLayer();
		this.name = 'gradientMask';
		this.head = new SvgGrad('assets/svg/GradientMask/GradientMask.svg', [0, 300]);
		this.cheekR = new SvgGrad('assets/svg/GradientMask/cheekR.svg', [-50, 0]);
	}
	update(d){

		this.head.update(d, 'head');
		this.cheekR.update(d, 'cheekR');

	}
	show(){
		this.showLayer();
	}
	hide(){
		this.hideLayer();
	}

}