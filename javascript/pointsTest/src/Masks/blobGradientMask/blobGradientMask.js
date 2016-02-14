/* jshint strict: true */
'use strict';
class blob{
	constructor(data){
		this.counter = 0;
		this.group = new paper.Group();
		this.group.transformContent = false;
		this.group.pivot = [0, 0];
		// init point position of each path
		this.pointsPositions = {}; // path0: [Point, Point, ..], path1: [Point, Point, ...]
		this.smoothAngle = 0;
		// this.pointsPositions["path"+2] = [];
		// this.pointsPositions["path"+2][0] = 1;
 		var self = this;
 		paper.project.importSVG(data['path'], function(item) {
            // set gradients 
            var paths = item.children[0].children;
            for (var i = 0; i < paths.length; i++) { // paths
            	var gStart = data['gradientDir'][0];
            	var gEnd = data['gradientDir'][1];
            	if(i%2==0){
	            	paths[i].fillColor = {

					   gradient: {
					       stops: ['#87d0a1', '#ea4a73']
					   },
					   origin: paths[i].segments[gStart].point,
					   destination: paths[i].segments[gEnd].point,
					}
            	}else{
            		paths[i].fillColor = {

					   gradient: {
					       stops: ['#cf9777', '#a1002c']
					   },
					   origin: paths[i].segments[gStart].point,
					   destination: paths[i].segments[gEnd].point,
					}
            	}
				paths[i].fillColor.gradient.stops[0].color.alpha = data['alpha'][0];
				paths[i].fillColor.gradient.stops[1].color.alpha = data['alpha'][1];

				var segments = paths[i].segments;
				self.pointsPositions["path"+i] = [0];
				for (var k = 0; k < segments.length; k++) {
					self.pointsPositions["path"+i][k] = new paper.Point(segments[k].point.x,segments[k].point.y) ;
				}
            	// paths[i].fullySelected = true;
            };
            self.group.pivot = [item.bounds.width/2+data['pivot'][0], data['pivot'][1]];
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
		var data = d['faceParts'][name];
		if(this.group.children[0] != undefined){
			var paths = this.group.children[0].children[0].children;
			for (var i = 0; i < paths.length; i++) {
				var segments = paths[i].segments;
				// var xOffset = ns * 100.0;
				for (var k = 0; k < segments.length; k++) {
					var initPos = this.pointsPositions["path"+i][k];
					var nsX = noise.simplex2(0.0,  (this.counter+k*200+i*100)/70);
					var nsY = noise.simplex2(0.0,  (this.counter+k*100+i*100+400)/70);
					var nsSlow = noise.simplex2(0.0,  (this.counter+k*233+i*50+400)/50);
					segments[k].point.x = initPos.x+nsX*20;
					segments[k].point.y = initPos.y+nsY*20;
				}
			}
		}
		this.spring.start(this.spring.get(), data['velocity'].length);
		this.group.position = data['position'];
		this.group.rotation =  this.smoothValue(this.group.rotation, data['angle'] * (180.0 / Math.PI), 0.6);
		this.group.scaling.x = this.smoothValue(this.group.scaling.x, data['scale'], 0.7)+0.1;
		this.group.scaling.y = this.smoothValue(this.group.scaling.y, data['scale'], 0.7)+0.1;
		this.counter++;
	}
}
class blobGradientMask extends MaskBase{
	setup(){
		this.name = 'blobGradientMask';
		super.addLayer();
		this.head = new blob(
			{ path:'assets/svg/BlobGradientMask/blobs.svg',
			  pivot:[0, 300],
			  alpha: [0.01, 1],
			  gradientDir: [0, 1]
			});
		this.cheekL = new blob(
			{ path:'assets/svg/BlobGradientMask/cheekL.svg',
			  pivot:[40, 100],
			  alpha: [0.1, 0.5],
			  gradientDir: [0, 1]
			});
		this.cheekR = new blob(
			{ path:'assets/svg/BlobGradientMask/cheekR.svg',
			  pivot:[-40, 100],
			  alpha: [0.1, 0.5],
			  gradientDir: [0, 1]
			});
	}
	update(d){
		this.head.update(d, 'head');
		this.cheekL.update(d, 'cheekL');
		this.cheekR.update(d, 'cheekR');
	}
	show(){
		this.showLayer();
	}
	hide(){
		this.hideLayer();
	}

}