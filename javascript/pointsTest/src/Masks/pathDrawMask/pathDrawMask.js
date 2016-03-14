'use strict';


class pathDrawMask extends MaskBase {

	//------------------------------------------
	setup() {

		super.addLayer();

		this.name = "pathDrawMask"

		this.osc = new oscillator();
		this.osc.setup(60, false); // 60 fps query... sine wave
		this.osc.setFrequency(0.3);
		this.osc.setVolume(1);
		this.counter = 0;

		this.paths = [];


		var self = this;

		this.firstFrame = true;

		paper.project.importSVG("assets/svg/LittleShapes/littleShapes.svg", function(item) {
			console.log(item.children['littleShapes'].children);
			for (var i = 0; i < item.children['littleShapes'].children.length; i++) {
				if (typeof item.children['littleShapes'].children[i]['closed'] !== 'undefined') {
					//console.log(item.children['littleShapes'].children[i]);
					self.paths.push(item.children['littleShapes'].children[i]);
					//self.path2 = self.paths[0].clone();
					//self.path2.flatten(2);
					//self.path3 = self.paths[0].clone();

				}
				//console.log();
				//console.log(typeof item.children['littleShapes'].children[i] === 'Path');
			}
		});

		this.timer2 = 0;


	}

	//------------------------------------------
	update(data) {

		if (this.paths.length > 0) {
			this.paths[0].position.x = data['faceParts']['eyeL']['position'].x;
			this.paths[0].position.y = data['faceParts']['eyeL']['position'].y;

			if (this.firstFrame) {
				this.path2 = this.paths[2].clone();
				this.path2.flatten(2);
				this.path2.position.x += 100;
				this.path3 = this.paths[2].clone();
				this.path3.position.x += 300;
				this.firstFrame = false;
			}

			//this.timer = (Math.sin(this.timer2) + 1.0);
			this.timer2 += 0.03;
			var pctStart = Math.max(this.timer2 - 1.5, 0);
			var pctEnd = Math.min(this.timer2, 1.0);
			if (this.timer2 > 2.5) {
				this.timer2 = -0.5;
			}

			this.path3.segments = [];

			for (var i = 0; i < this.path2.segments.length; i++) {
				var pct = i / this.path2.segments.length;
				if (pct >= pctStart && pct <= pctEnd) {
					this.path3.add(this.path2.segments[i].point);
				}
			}
			//this.path3.position.x += 100;
		}



	}

	show() {
		this.showLayer();
	}

	hide() {
		this.hideLayer();
	}
}