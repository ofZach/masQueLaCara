'use strict';
class flowerMaskControl {
	constructor(d) {
		this.papameters = {
			
		};
		this.loader = new flowerSvgLoader(d);
		
		//---------------------------- gui
		this.guiSettings = {
			message: 'dat.gui',
			speed: 0.8,
			displayOutline: false
		};
		this.gui = new dat.GUI({
			//autoPlace: false
		});
		var self = this;
		this.gui.add(this.osc, 'frequency', 0.1, 3.9).onChange(function(value){
			self.osc.setFrequency(value);
		});
		this.gui.domElement.id = this.name + '_gui';
		document.getElementById(this.gui.domElement.id).style.visibility = "hidden";
		//---------------------------------------------------- 
		this.randomNum = [];		
		this.spring = new Fx.Spring({
			'stiffness': 100,
			'friction': 5,
			// 'onMotion': function(t){console.log("t = " + t);}
		});

		this.counter = 0;
	}
	smoothValue(valueOld, valueNew, smooth) {
		return valueOld * smooth + (1 - smooth) * valueNew;
	}
	update(data, name) {
		var d = data['faceParts'][name];
		var osc = this.osc.getSample();
		this.loader.update({
			rootPos: d.position,

			posPoint0: [osc*20, osc*30],
			posPoint1: [osc*20, osc*30],
			
			inPoint0: osc*20,
			outPoint0: osc*20,
			
			inPoint1: osc*20,
			outPoint1: osc*20,
		});
		this.counter++;
	}
	show(){
		document.getElementById(this.gui.domElement.id).style.visibility = "visible";
	}
	hide(){
		document.getElementById(this.gui.domElement.id).style.visibility = "hidden";
	}
}
