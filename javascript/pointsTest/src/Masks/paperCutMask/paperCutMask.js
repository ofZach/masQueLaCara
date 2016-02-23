'use strict';
class loadSvgPivot {
    constructor(d) {
        this.loaded = false;
        this.group = new paper.Group();
        this.energy = d.energy;
        this.rootPivot;
        var self = this;
        paper.project.importSVG(d.path, function(item) {
            // console.log("item = " + item.children[0]);
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
           // console.log("layers = "+item.children[i]);
           var name = item.children[i].name;
           if(name.substring(0, 5) == 'dummy'){
           		var dummy = item.children[i];
				var group = dummy.parent;
				dummy.visible = false;
    //        		console.log("match! " + i);
    //        		console.log("parent= " + item.children[i].parent);
				// console.log("pos "+item.children[i].position);
				group.pivot = dummy.position;
				if(group.name.substring(0, 4) == 'root'){
					this.rootPivot = dummy.position;
					// console.log("group.name = " + group.name);
				}
				group.transformContent = false;
           }
           if(item.children[i].children != undefined){
           		this.setPivot(item.children[i]);
           }
        }
        this.counter = 0;
    }
    rotate(item){
    	for (var i = 0; i < item.children.length; i++) {
           // console.log("layers = "+item.children[i]);
           if(item.children[i].className == 'Group'){
           		item.children[i].rotation = Math.cos(this.counter/20+i*100)*this.energy;
           		// console.log("group = " + item.children[i].name+" "+ item.children[i].rotation );
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
    		// console.log("this.group.children[0] = " + this.group.children[0]);
    	}
    }
}

class paperCutMask extends MaskBase {

	//------------------------------------------
	setup() {
		super.addLayer();
		this.name = "paperCutMask";
		this.head = new loadSvgPivot({
			path: 'assets/svg/CutPaperMask/eyeL.svg',
			pivot: [0, 0],
			energy: 20,
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

		this.head.update();
		this.head.group.position = eyeL.position.add([-140, 0]);
		// data contains face data, see dataPlayer.js, ie face parts data['faceParts']['eyeL']['position'] as well as face points, etc...
	}

	show() {
		this.showLayer();
	}

	hide() {
		this.hideLayer();
	}
}