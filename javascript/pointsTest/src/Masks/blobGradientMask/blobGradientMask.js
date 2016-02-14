/* jshint strict: true */
'use strict';
class blob{
	constructor(data){
		this.counter = 0;
		this.group = new paper.Group();
		this.group.transformContent = false;
		this.group.pivot = [0, 0];
		this.pointsPositions = {}; // path0: [Point, Point, ..], path1: [Point, Point, ...]
		this.smoothAngle = 0;
 		var self = this;
 		paper.project.importSVG(data['path'], function(item) {
            // console.log("paths = " + item.children[0]); // head
            // console.log("paths = " + item.children[0].children[0]); // path
            // console.log("paths = " + item.children[0].children[1]); // gradient
            var gradient = item.children[0].children[1].children;
            var paths = item.children[0].children[0].children;
            var gradientData = {};
            // set gradient data
            for (var i = 0; i < gradient.length; i++) { // gradient 
            	gradientData['path'+i] = []; // hold gradient data for each shape
            	var layers =  gradient[i].children; // layers with grad points
            	for (var k = 0; k < layers.length; k++) { // each point object
            		gradientData['path'+i]['point'+k+'pos'] = layers[k].position;
            		gradientData['path'+i]['point'+k+'color'] = layers[k].fillColor;
            		gradientData['path'+i]['point'+k+'alpha'] = layers[k].opacity;
            		// console.log("layers[k].opacity = "+layers[k].opacity);
            	}
            }
            // set gradients and store init positions
            for (var i = 0; i < paths.length; i++) { // paths
            	var gd = gradientData['path'+i];
	        	paths[i].fillColor = {
				   gradient: {
				       stops: [ gd['point0color'] , gd['point1color'] ]
				   },
				   origin: gd['point0pos'],
				   destination: gd['point1pos'],
				}
				paths[i].fillColor.gradient.stops[0].color.alpha = gd['point0alpha'];
				paths[i].fillColor.gradient.stops[1].color.alpha = gd['point1alpha'];

				var segments = paths[i].segments;
				self.pointsPositions["path"+i] = [];
				for (var k = 0; k < segments.length; k++) {
					self.pointsPositions["path"+i][k] = new paper.Point(segments[k].point.x,segments[k].point.y) ;
				}
            	// paths[i].fullySelected = true;
            };
            // delete dummy objects
            item.children[0].children[1].remove();
            self.group.pivot = [item.bounds.width/2+data['pivot'][0], data['pivot'][1]];
            self.group.addChild(item);
            // console.log("self.group = " + self.group.children[0].children[0].children[0].children);
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
			var paths = this.group.children[0].children[0].children[0].children;
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
			{ path:'assets/svg/BlobGradientMask/head.svg',
			  pivot:[0, 300],
			});
		this.cheekR = new blob(
			{ path:'assets/svg/BlobGradientMask/cheekR.svg',
			  pivot:[0, 100],
			});
		this.cheekL = new blob(
			{ path:'assets/svg/BlobGradientMask/cheekL.svg',
			  pivot:[70, 100],
			});

	}
	update(d){
		this.head.update(d, 'head');
		this.cheekR.update(d, 'cheekR');
		this.cheekL.update(d, 'cheekL');
		// this.cheekL.update(d, 'cheekL');
		// this.cheekR.update(d, 'cheekR');
	}
	show(){
		this.showLayer();
	}
	hide(){
		this.hideLayer();
	}

}