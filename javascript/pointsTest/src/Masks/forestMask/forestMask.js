'use strict';
'use strict';
class forestSVG {
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
            self.group.pivot = self.rootPivot.add(d.pivot);
            self.group.transformContent = false;
            this.loaded = true;
        });
    }
    setPivot(item){
    	// iterate through hierarchy
    	for (var i = 0; i < item.children.length; i++) {
           var name = item.children[i].name;
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
           		var group = item.children[i];
           		var fadeForce = 1;
           		if(this.levelCount != 0){
           			fadeForce = this.levelCount/this.fadeForce;
           		}
           		group.rotation = Math.cos(this.counter/this.speed+i*100)*this.energy;
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
    		// root.rotation = Math.cos(this.counter/20+100)*this.energy;
    		this.rotate(root);
    	}
    }
}
class plainSVG {
	constructor(d){
		this.group = new paper.Group();
		var self = this;
		paper.project.importSVG(d.path, function(item) {
			console.log("item = " + item);
            self.group.addChild(item.children[0]);
            self.group.pivot = d.pivot;
            self.group.transformContent = false;
            this.loaded = true;
        });
	}
}
class forestMask extends MaskBase {

	//------------------------------------------
	setup() {
		super.addLayer();
		this.name = "forestMask";
		this.forest = new forestSVG({
			path: 'assets/svg/forestMask/rootSmallTrees.svg',
			pivot: [0, -270],
			energy: 20,
			speed: 5,
			fadeForce: 1,
		});
		this.bigTree = new forestSVG({
			path: 'assets/svg/forestMask/rootBigTree.svg',
			pivot: [-20, 50],
			energy: 20,
			speed: 5,
			fadeForce: 1,
		});
		this.sun = new plainSVG({
			path: 'assets/svg/forestMask/sun.svg',
		});
		this.moon = new plainSVG({
			path: 'assets/svg/forestMask/moon.svg',
		});
		var width = 300;
		var height = 400;
		this.clipPath = new paper.Path.Rectangle({
			from: [0, 0],
			to: [width, height],
			pivot: [width/2, height/2],
			strokeWidth: 2,
			strokeColor: 'white',
			transformContent: false,
		})
		this.clipPathStroke = this.clipPath.clone();
		this.window = new paper.Group({
			children: [this.clipPath, this.forest.group],
			clipped: true,
			transformContent: false,
		})
		this.velocity = 0;
		this.angle = 0;
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

		this.velocity = calc.smooth(this.velocity, head.velocity.length, 0.9);
		this.angle = calc.smooth(this.angle, calc.deg(head.angle), 0.9);

		this.sun.group.position = eyeL.position;
		this.moon.group.position = eyeR.position;
		
		this.forest.update();
		this.forest.group.position = head.position;
		this.forest.energy = this.velocity;

		this.bigTree.update();
		this.bigTree.group.position = nose.position;
		this.bigTree.energy = this.velocity;

		this.clipPath.position = head.position;
		this.clipPath.rotation = this.angle;
		this.clipPath.scaling = [head.scale, head.scale];
		
		this.clipPathStroke.position = head.position;
		this.clipPathStroke.rotation = this.angle;
		this.clipPathStroke.scaling = [head.scale, head.scale];



		// data contains face data, see dataPlayer.js, ie face parts data['faceParts']['eyeL']['position'] as well as face points, etc...
	}

	show() {
		this.showLayer();
	}

	hide() {
		this.hideLayer();
	}
}