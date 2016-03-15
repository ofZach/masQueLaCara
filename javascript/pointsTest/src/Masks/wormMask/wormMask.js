'use strict';
class shapeSet{
	constructor(d){
		this.group = new paper.Group({transformContent: false,});
		this.currShapeNum = 0;
		var self = this;
		this.isMove = false;
		this.speed = 50;
		this.curOffset = 0;
		this.tween = new TWEEN.Tween(this.curPos).onComplete(function(){
		});

        paper.project.importSVG(d.path, function(item) {
        	var paths = item.children[0].children;
        	for (var i = 0; i < paths.length; i++) {
        		var path = paths[i];
        		path.scaling = 2;
        		path.visible = false;
        		path.dashArray = [path.length, path.length];
        		path.dashOffset = -path.length;
        		// reset pos
        		path.position = [path.bounds.width/2, path.bounds.height/2];
        	}
        	paths[0].visible = true;
            self.group.addChild(item.children[0]);
        });
        this.runOnce = true;
	}
	
	update(){
		if(this.isMove){
			if(this.group.children[0] != undefined){
				var paths = this.group.children[0].children;
				var id = this.currShapeNum;
				var speed = paths[id].length/this.speed;
				paths[id].dashOffset += speed;
				if(this.runOnce && paths[id].dashOffset > 0){
					this.isMove = false;
					this.runOnce = false;
				}
				if(paths[id].dashOffset > paths[id].length){
					paths[id].visible = false;
					paths[id].dashOffset = -paths[id].length;
					this.nextShapeNum();
					var id = this.currShapeNum;
					paths[id].visible = true;	
					this.runOnce = true;		
				}
			}
		}
	}
	nextShapeNum(){
		var paths = this.group.children[0].children;
		this.currShapeNum = calc.randomInt(0, paths.length-1);
		this.speed = calc.randomInt(20,70);
	}
}
class wormMask extends MaskBase {

	//------------------------------------------
	setup() {
		super.addLayer();
		this.eyeL = new shapeSet({
			path: 'assets/svg/wormMask/eyeSet.svg',
		})
		this.eyeR = new shapeSet({
			path: 'assets/svg/wormMask/eyeSet.svg',
		})
		this.nose = new shapeSet({
			path: 'assets/svg/wormMask/noseSet.svg',
		})
		this.mouth = new shapeSet({
			path: 'assets/svg/wormMask/mouthSet.svg',
		})
		this.browL = new shapeSet({
			path: 'assets/svg/wormMask/browSet.svg',
		})
		this.browR = new shapeSet({
			path: 'assets/svg/wormMask/browSet.svg',
		})
		this.name = "wormMask";
	}

	//------------------------------------------
	update(data) {
		var head = data['faceParts']['head'];
		var nose = data['faceParts']['nose'];
		var eyeL = data['faceParts']['eyeL'];
		var eyeR = data['faceParts']['eyeR'];
		var earR = data['faceParts']['earR'];
		var earL = data['faceParts']['earL'];
		var mouth = data['faceParts']['mouth'];
		var cheekL = data['faceParts']['cheekL'];
		var cheekR = data['faceParts']['cheekR'];
		var browL = data['faceParts']['browL'];
		var browR = data['faceParts']['browR'];
		var lipUpper = data['faceParts']['lipUpper'];
		var lipLower = data['faceParts']['lipLower'];

		this.eyeL.update();
		this.eyeL.group.position = eyeL.position;

		this.eyeR.update();
		this.eyeR.group.position = eyeR.position;
		
		this.nose.update();
		this.nose.group.position = nose.position;
		
		this.mouth.update();
		this.mouth.group.position = mouth.position;

		this.browL.update();
		this.browL.group.position = browL.position.add([0, -48]);

		this.browR.update();
		this.browR.group.position = browR.position.add([0, -48]);
		
		if(head.velocity.length > calc.random(3.1, 4.8)){
			this.eyeL.isMove = true;
			this.eyeR.isMove = true;
			this.nose.isMove = true;
			this.mouth.isMove = true;
			this.browL.isMove = true;
			this.browR.isMove = true;
		}

		// data contains face data, see dataPlayer.js, ie face parts data['faceParts']['eyeL']['position'] as well as face points, etc...
	}

	show() {
		this.showLayer();
	}

	hide() {
		this.hideLayer();
	}
}