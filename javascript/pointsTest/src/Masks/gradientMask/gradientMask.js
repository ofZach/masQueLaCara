/* jshint strict: true */
'use strict';
class SvgGrad{
	constructor(path, offset){
		this.group = new paper.Group();
		this.group.transformContent = false;
		this.group.pivot = [0, 0];
		this.pointPos1 = [];
		this.pointPos2 = [];
		this.smoothAngle = 0;
		this.handleInAngle = [[], []];
		this.handleOutAngle = [[], []];
 		var self = this;
 		paper.project.importSVG(path, function(item) {
            // set gradients 
            var paths = item.children[0].children;
            console.log("name = " + paths);
            for (var i = 0; i < paths.length; i++) {
            	if(i %2 == 0){ 
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
            	
            	self.pointPos1[i] = new paper.Point(paths[i].segments[0].point.x, paths[i].segments[0].point.y);
            	self.pointPos2[i] = new paper.Point(paths[i].segments[1].point.x, paths[i].segments[1].point.y);
            	self.handleInAngle[0][i] = paths[i].segments[0].handleIn.angle;
            	self.handleInAngle[1][i] = paths[i].segments[1].handleIn.angle;
            	self.handleOutAngle[0][i] = paths[i].segments[0].handleOut.angle;
            	self.handleOutAngle[1][i] = paths[i].segments[1].handleOut.angle;
            	// paths[i].fullySelected = true;
            };
            self.group.pivot = [item.bounds.width/2+offset[0], offset[1]];
            self.group.addChild(item);
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
		var head = this.group;
		var data = d['faceParts'][name];
		this.smoothAngle = this.smoothValue(this.smoothAngle, data['angle'], 0.9);
		if(this.group.children[0] != undefined){
			var paths = this.group.children[0].children[0].children;
			for (var i = 0; i < paths.length; i++) {
				if(i%2==0){
					paths[i].segments[0].point.y = this.pointPos1[i].y+this.spring.get()*5;
					paths[i].segments[0].handleIn.angle = this.handleInAngle[0][i]+this.smoothAngle*200;
					paths[i].segments[0].handleOut.angle = this.handleOutAngle[0][i]+this.smoothAngle*200;
				} else{
					paths[i].segments[1].point.x = this.pointPos2[i].x+this.spring.get()*5;
					paths[i].segments[0].handleIn.angle = this.handleInAngle[0][i]-this.smoothAngle*200;
					paths[i].segments[0].handleOut.angle = this.handleOutAngle[0][i]-this.smoothAngle*200;
					paths[i].segments[1].handleIn.angle = this.handleInAngle[1][i]-this.smoothAngle*200;
					paths[i].segments[1].handleOut.angle = this.handleOutAngle[1][i]+this.smoothAngle*200;
				}

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
		this.cheekR = new SvgGrad('assets/svg/GradientMask/cheekR.svg', [-30, 20]);
		this.cheekL = new SvgGrad('assets/svg/GradientMask/cheekL.svg', [30, 20]);
	}
	update(d){

		this.head.update(d, 'head');
		this.cheekR.update(d, 'cheekR');
		this.cheekL.update(d, 'cheekL');

	}
	show(){
		this.showLayer();
	}
	hide(){
		this.hideLayer();
	}

}