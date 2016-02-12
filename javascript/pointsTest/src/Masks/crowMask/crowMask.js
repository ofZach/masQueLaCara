'use strict';
class crowMaskEye {
	constructor(){
		this.eyeLGroup = new paper.Group();
		this.eyeLGroup.transformContent = false;
		this.eyeLGroup.pivot = [0, 0];
		this.linesGroup = new paper.Group();
		this.linesGroup.transformContent = false;
		this.linesGroup.pivot = [0, 0];
		this.lineCount = 20;
		this.randomNumbers = [];
		this.innerCircleRadius = 50;
		for (var i = 0; i < this.lineCount; i++) {
			this.randomNumbers[i] = Math.random();
			var line = new paper.Path();
			line.add(0, 0);
			line.add(Math.random()*50+50,0)	;
			line.strokeColor = 'white';

			var lineOffsetGroup = new paper.Group();
			lineOffsetGroup.transformContent = false;
			lineOffsetGroup.pivot = [-this.innerCircleRadius, 0];
			lineOffsetGroup.position = [0, 0];
			lineOffsetGroup.rotation = 360/this.lineCount*i;

			var lineGroup = new paper.Group();
			lineGroup.transformContent = false;
			lineGroup.pivot = [0, 0];
			lineGroup.position = [0, 0];
			lineGroup.rotation = - Math.random()*40;
			lineGroup.addChild(line);
			
			lineOffsetGroup.addChild(lineGroup);
			this.linesGroup.addChild(lineOffsetGroup);
		};
		var innerCircle = new paper.Path.Circle({
			center: [0, 0],
			radius: this.innerCircleRadius,
			strokeColor: 'white',
		});
		var outerCircle = new paper.Path.Circle({
			center: [0, 0],
			radius: 60,
			strokeColor: 'white',
			strokeWidth: 4,
		});
		var yellowCircle = new paper.Path.Circle({
			center: [0, 0],
			radius: 10,
			fillColor: 'yellow',
		});
		var yellowCircleGroup = new paper.Group();
		// yellowCircle.pivot = [-20, 0];
		yellowCircleGroup.transformContent = false;
		yellowCircleGroup.pivot = [-40, 0];
		yellowCircleGroup.position = [0, 0];
		yellowCircleGroup.rotation = 0;
		yellowCircleGroup.addChild(yellowCircle);

		this.eyeLGroup.addChild(innerCircle); // 0
		this.eyeLGroup.addChild(outerCircle); // 1
		this.eyeLGroup.addChild(yellowCircleGroup); // 2
		this.eyeLGroup.addChild(this.linesGroup); // 3

		this.spring = new Fx.Spring({
            'stiffness': 1000,
            'friction': 5,
            // 'onMotion': function(t){console.log("t = " + t);}
          });
	}
	update(data, name){
		this.spring.start(this.spring.get(), data['faceParts'][name]['velocity'].length);

		for (var i = 0; i < this.lineCount; i++) {
			var rotation = this.spring.get()*this.randomNumbers[i]*2;
			// var rotation = this.linesGroup.children[i].children[0].rotation;
			this.linesGroup.children[i].children[0].rotation = rotation;
		}
		var eyeLGroupRotation = this.smoothValue(this.eyeLGroup.children[2].rotation , 
										data['faceParts'][name]['velocity'].length*90,
										0.97);
		this.eyeLGroup.children[2].rotation = eyeLGroupRotation;

		this.eyeLGroup.position = data['faceParts'][name]['position'];
	}
	smoothValue(valueOld, valueNew, smooth){
		return valueOld*smooth + (1-smooth)* valueNew;
	}
};
class crowMask extends MaskBase {

	setup() {
		this.name = 'crowMask';
		super.addLayer();
		this.faceParts = {
			'head': new SvgLoader('head', this.name, 'assets/svg/Crow/head.svg', new paper.Point(0, 0)),
		};
		this.eyeL = new crowMaskEye();
		this.eyeR = new crowMaskEye();
		this.rightEyeScale = 0.5;
		this.leftEyeScale = 0.5;
	}
	smoothValue(valueOld, valueNew, smooth){
		return valueOld*smooth + (1-smooth)* valueNew;
	}
	show(){
		this.showLayer();
	}
	hide(){
		this.hideLayer();
	}
	update(data) {
		
		this.eyeL.update(data, 'eyeL');
		this.eyeR.update(data, 'eyeR');
		
		this.faceParts['head'].setPosition(data['faceParts']['head']['position']);
		this.faceParts['head'].setAngle(data['faceParts']['head']['angle'], 0.6);
		this.faceParts['head'].setScale(data['faceParts']['head']['scale']);
		this.faceParts['head'].setOpacity(data['faceParts']['head']['velocity'].length*0.6);
		
		// if (Math.abs(data['faceParts']['head']['angle']) > 0.1){
		// 	if (data['faceParts']['head']['angle'] < 0){
		// 		this.rightEyeScale = 0.9 * this.rightEyeScale + 0.1 * 0.9;
		// 		this.leftEyeScale = 0.9 * this.leftEyeScale + 0.1 * 0.5;
					
		// 	} else {
		// 		this.rightEyeScale = 0.9 * this.rightEyeScale + 0.1 * 0.5;
		// 		this.leftEyeScale = 0.9 * this.leftEyeScale + 0.1 * 0.9;
				
		// 	}
		// } else {
		// 	this.rightEyeScale = 0.9 * this.rightEyeScale + 0.1 * 0.5;
		// 		this.leftEyeScale = 0.9 * this.leftEyeScale + 0.1 * 0.5;
		// }
		//console.log("data['faceParts']['head']['angle'] = " + data['faceParts']['head']['angle']);
		
	}

}