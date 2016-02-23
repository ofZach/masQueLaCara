'use strict';
class loadSvgPivot {
    constructor(d) {
        this.loaded = false;
        this.group = new paper.Group();
        this.energy = d.energy;
        this.speed = d.speed;
        this.fadeForce = d.fadeForce;
        this.rootPivot;
        this.levelCount = 0;
        var self = this;
        paper.project.importSVG(d.path, function(item) {
            self.setPivot(item.children[0]);
            self.group.addChild(item.children[0]);
            self.group.pivot = self.rootPivot;
            self.group.transformContent = false;
            this.loaded = true;
        });
    }
    setPivot(item){
    	// iterate through hierarchy
    	for (var i = 0; i < item.children.length; i++) {
           var name = item.children[i].name;
           // add shadow
           if(item.children[i].className == 'Path'){
           		var path = item.children[i];
           		path.shadowColor = new Color(0, 0, 0, 0.8);
				path.shadowBlur = 120;
				path.shadowOffset = new Point(10, 10);
           }
           // if wee meet layer named dummy set parent pivot to this object
           if(name != undefined && name.substring(0, 5) == 'dummy'){
           		var dummy = item.children[i];
				var group = dummy.parent;
				dummy.visible = false;
				group.pivot = dummy.position;
				if(group.name.substring(0, 4) == 'root'){
					this.rootPivot = dummy.position;
				}
				group.transformContent = false;
           }
           if(item.children[i].children != undefined){
           		// continiue search in level tree
           		this.setPivot(item.children[i]);
           		// how deep this hierarchy?
           		this.levelCount++;
           }
        }
        this.counter = 0;
    }
    rotate(item){
    	for (var i = 0; i < item.children.length; i++) {
           if(item.children[i].className == 'Group'){
           		var fadeForce = 1;
           		if(this.levelCount != 0){
           			fadeForce = this.levelCount/this.fadeForce;
           		}
           		item.children[i].rotation = Math.cos(this.counter/this.speed+i*100)*this.energy/fadeForce;
           }
           if(item.children[i].children != undefined){
           		this.rotate(item.children[i]);
           }
        }
    }
    update(){
    	this.counter++;
    	if(this.group.children[0] != undefined){
    		var root = this.group.children[0];
    		this.group.children[0].rotation = Math.cos(this.counter/20+100)*this.energy;
    		this.rotate(this.group.children[0]);
    	}
    }
}

class paperCutMask extends MaskBase {

	//------------------------------------------
	setup() {
		super.addLayer();
		this.name = "paperCutMask";
		this.eyeL = new loadSvgPivot({
			path: 'assets/svg/CutPaperMask/rootEyeL.svg',
			pivot: [0, 0],
			energy: 20,
			speed: 15,
			fadeForce: 2,
		});
		this.eyeR = new loadSvgPivot({
			path: 'assets/svg/CutPaperMask/rootEyeR.svg',
			pivot: [0, 0],
			energy: 20,
			speed: 18,
			fadeForce: 2,
		});
		this.mouth = new loadSvgPivot({
			path: 'assets/svg/CutPaperMask/rootHead.svg',
			pivot: [0, 0],
			energy: 20,
			speed: 30,
			fadeForce: 2,
		});
		this.velocity = 0;
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

		this.velocity = calc.smooth(this.velocity, head.velocity.length, 0.99);

		this.eyeL.update();
		this.eyeL.group.position = eyeL.position.add([-140, 0]);
		this.eyeL.energy = this.velocity*10;

		this.eyeR.update();
		this.eyeR.group.position = eyeR.position.add([0, 0]);
		this.eyeR.energy = this.velocity*7;

		this.mouth.update();
		this.mouth.group.position = mouth.position.add([-100, 0]);
		this.mouth.energy = this.velocity*6;
		// data contains face data, see dataPlayer.js, ie face parts data['faceParts']['eyeL']['position'] as well as face points, etc...
	}

	show() {
		this.showLayer();
	}

	hide() {
		this.hideLayer();
	}
}