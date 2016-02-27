'use strict';
class lampSVG {
    constructor(d) {
        this.loaded = false;
        this.group = new paper.Group();
        this.energy = d.energy;
        this.speed = d.speed;
        this.fadeForce = d.fadeForce;
        this.rootPivot;
        this.levelCount = 0;
        this.randomNum = [];
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
           this.randomNum.push(calc.random(1, 5));
           // add shadow

           if(item.children[i].className == 'Path' || item.children[i].className == 'Shape'){
           		var path = item.children[i];
           		path.strokeColor = 'white';
           }
           // if(item.children[i].name != undefined){
	          //  if(item.children[i].className == 'Path' || item.children[i].className == 'Shape'){
	          //  		var shape = item.children[i];
	          //  		var group = shape.parent;
	          //  		var text = new PointText({
	          //  			point: shape.position,
	          //  			justification: 'left',
	          //  			fillColor: 'white',
	          //  			content: shape.name,
	          //  		});
	          //  		group.addChild(text);
	          //  }
           // }
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
    		if(item.children[i].className == 'Path' || item.children[i].className == 'Shape'){
           		var path = item.children[i];
				path.shadowOffset.x = Math.cos(this.counter/this.speed/this.randomNum[i]+this.randomNum[i]*500)*this.energy*100;
				path.shadowOffset.y = Math.sin(this.counter/this.speed/this.randomNum[i]+this.randomNum[i]*500)*this.energy*100;
           }
           if(item.children[i].className == 'Group'){
           		var group = item.children[i];
           		var fadeForce = 1;
           		if(this.levelCount != 0){
           			fadeForce = this.levelCount/this.fadeForce;
           		}
           		group.rotation = Math.cos(this.counter/this.speed+this.randomNum[i]*500)*this.energy*this.randomNum[i];
           		group.scaling =  calc.map(Math.sin(this.counter/this.speed+this.randomNum[i]*100)*this.energy, -5, 5, 0.8, 1);
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
    		root.rotation = Math.cos(this.counter/20+100)*this.energy;
    		this.rotate(root);
    	}
    }
}
class lampMask extends MaskBase {
	//------------------------------------------
	setup() {
		super.addLayer();
		this.name = "lampMask";
		this.velocity = 0;
		this.angle = 0;
		this.mouth = new lampSVG({
			path: 'assets/svg/lampMask/rootLamp.svg',
			pivot: [0, 0],
			energy: 20,
			speed: 5,
			fadeForce: 19,
		});
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

		this.mouth.update();
		this.mouth.group.position = mouth.position;
		this.mouth.energy = this.velocity;
	}

	show() {
		this.showLayer();
	}

	hide() {
		this.hideLayer();
	}
}