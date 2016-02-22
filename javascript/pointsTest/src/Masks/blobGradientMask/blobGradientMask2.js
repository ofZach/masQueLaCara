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
		this.angleRange = data.angleRange;
		this.posRange = data.posRange;
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
					segments[k].point.x = initPos.x+nsX*this.posRange;
					segments[k].point.y = initPos.y+nsY*this.posRange;
					segments[k].handleIn.angle = handleIn+nsAngle*this.angleRange;
					segments[k].handleOut.angle = handleOut+nsAngle*this.angleRange;
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
		this.scale = new paper.Point(1, 1);
		this.angle = 0;
		this.head = new blobSVG({ 
			path:'assets/svg/blobs/glass.svg',
		  	pivot:[0, 0],
		  	speed: 80,
		  	scale: 0.5,
		  	angleRange: 50,
		  	posRange: 20,
		});
		this.nose = new blobSVG({ 
			path:'assets/svg/blobs/tshape.svg',
		  	pivot:[0, 0],
		  	speed: 100,
		  	scale: 0.5,
		  	angleRange: 40,
		  	posRange: 20,
		});
		this.eyeR = new blobSVG({ 
			path:'assets/svg/blobs/duck.svg',
		  	pivot:[0, 0],
		  	speed: 80,
		  	scale: 0.3,
		  	angleRange: 60,
		  	posRange: 10,
		});
		this.eyeL = new blobSVG({ 
			path:'assets/svg/blobs/duck.svg',
		  	pivot:[0, 0],
		  	speed: 70,
		  	scale: 0.3,
		  	angleRange: 50,
		  	posRange: 10,
		});
		this.mouth = new blobSVG({ 
			path:'assets/svg/blobs/mouth.svg',
		  	pivot:[0, 0],
		  	speed: 80,
		  	scale: 0.3,
		  	angleRange: 60,
		  	posRange: 10,
		});
		this.cheekL = new blobSVG({ 
			path:'assets/svg/blobs/bone.svg',
		  	pivot:[0, 0],
		  	speed: 80,
		  	scale: 0.3,
		  	angleRange: 60,
		  	posRange: 10,
		});
		this.eyeR.group.opacity = 0.6;
		this.eyeL.group.opacity = 0.6;
		this.velocity = 0;

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
		this.scale.x = this.smoothValue(this.scale.x, scale, 0.7);
		this.scale.y = this.smoothValue(this.scale.y, scale, 0.7);
		this.velocity = this.smoothValue(this.velocity, head.velocity.length, 0.9);

		
		this.head.update();
		this.head.group.position = head.position.add([0, 120]);
		this.head.group.scaling = this.scale.add([-0.1, -0.1]);
		
		this.nose.update();
		this.nose.group.position = nose.position.add([-20, 0]);
		this.nose.group.rotation = this.angle;

		this.cheekL.update();
		this.cheekL.group.position = browL.position.add([20, -20]);
		this.cheekL.group.rotation = this.angle;
		this.cheekL.group.scaling = this.scale.add([-0.7,-0.7]);
		
		this.eyeR.update();
		this.eyeR.group.position = eyeR.position;
		this.eyeR.group.rotation = this.angle;
		this.eyeR.group.scaling = this.scale.add([0.4, 0.4]);
		this.eyeR.posRange = 5*this.velocity+10;
		
		this.eyeL.update();
		this.eyeL.group.position = eyeL.position;
		this.eyeL.group.rotation = this.angle+90;
		this.eyeL.group.scaling = this.scale.add([0.5, 0.5]);
		
		this.mouth.update();
		this.mouth.group.position = mouth.position;
		this.mouth.group.scaling = [0.5, 0.5];
	}
	show(){
		this.showLayer();
	}
	hide(){
		this.hideLayer();
	}

}