'use strict';
paper.install(window);
/* jshint strict: true */
class blobSVG{
	constructor(data){
		this.counter = 0;
		this.group = new paper.Group();
		this.group.transformContent = false;
		this.group.pivot = [0, 0];
		this.pointsPositions = {}; // path0: [Point, Point, ..], path1: [Point, Point, ...]
		this.smoothAngle = 0;
		this.speed = data['speed'];
		this.scale = data.scale;
 		var self = this;
 		paper.project.importSVG(data['path'], function(item) {
            var gradient = item.children[0].children[1].children;
            var paths = item.children[0].children[0].children;
            var gradientData = {};
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
				self.pointsPositions["handleIn"+i] = [];
				self.pointsPositions["handleOut"+i] = [];
				for (var k = 0; k < segments.length; k++) {
					self.pointsPositions["path"+i][k] = new paper.Point(segments[k].point.x,segments[k].point.y) ;
					self.pointsPositions["handleIn"+i][k] = segments[k].handleIn.angle;
					self.pointsPositions["handleOut"+i][k] = segments[k].handleOut.angle;
				}
            	// paths[i].fullySelected = true;
            };
            // delete dummy objects
            item.children[0].children[1].remove();
            self.group.pivot = [item.bounds.width/2+data['pivot'][0], item.bounds.height/2 + data['pivot'][1]];
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
	update(){
		if(this.group.children[0] != undefined){
			var paths = this.group.children[0].children[0].children[0].children;
			for (var i = 0; i < paths.length; i++) {
				var segments = paths[i].segments;
				// var xOffset = ns * 100.0;
				for (var k = 0; k < segments.length; k++) {
					var initPos = this.pointsPositions["path"+i][k];
					var handleIn = this.pointsPositions["handleIn"+i][k];
					var handleOut = this.pointsPositions["handleOut"+i][k];
					var nsX = noise.simplex2(0.0,  (this.counter+k*200+i*100)/this.speed);
					var nsY = noise.simplex2(0.0,  (this.counter+k*100+i*100+400)/this.speed);
					var nsAngle = noise.simplex2(0.0,  (this.counter+k*100+i*100+2000)/this.speed*0.7);
					segments[k].point.x = initPos.x+nsX*20;
					segments[k].point.y = initPos.y+nsY*20;
					segments[k].handleIn.angle = handleIn+nsAngle*50;
					segments[k].handleOut.angle = handleOut+nsAngle*50;
				}
			}
		}
		this.counter++;
	}
}
class blobGradientMask2 extends MaskBase{
	setup(){
		this.name = 'blobGradientMask2';
		super.addLayer();
		this.scale = [1, 1];
		this.angle = 0;
		this.head = new blobSVG(
			{ path:'assets/svg/blobs/glass.svg',
			  pivot:[0, 0],
			  speed: 80,
			  scale: 0.5,
			});

	}
	smoothValue(valueOld, valueNew, smooth){
 		return valueOld*smooth + (1-smooth)* valueNew;
	}
	update(data){
		var head = data['faceParts']['head'];
		var nose = data['faceParts']['nose'];
		var eyeL = data['faceParts']['eyeL'];
		var eyeR = data['faceParts']['eyeR'];
		var earR = data['faceParts']['earR'];
		var earL = data['faceParts']['earL'];
		var mouth = data['faceParts']['mouth'];
		var cheekL = data['faceParts']['cheekL'];
		var browL = data['faceParts']['browL'];
		var browR = data['faceParts']['browR'];
		var lipUpper = data['faceParts']['lipUpper'];
		var lipLower = data['faceParts']['lipLower'];
		
		var scale = head.scale;
		var angle = head.angle;

		this.angle =  this.smoothValue(this.angle, angle * (180.0 / Math.PI), 0.6);
		this.scale[0] = this.smoothValue(this.scale[0], scale, 0.7);
		this.scale[1] = this.smoothValue(this.scale[1], scale, 0.7);
		
		this.head.update();
		this.head.group.position = head.position;
	}
	show(){
		this.showLayer();
	}
	hide(){
		this.hideLayer();
	}

}