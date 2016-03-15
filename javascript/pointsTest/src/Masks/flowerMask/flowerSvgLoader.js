'use strict';
class flowerSvgLoader{
	constructor(d){
		// console.log("d.path = " + d.path);
		this.group = new paper.Group();
		this.group.transformContent = false;
		this.group.pivot = [0, 0];
		this.init = {};
		this.loaded = false;
		var self = this;


		paper.project.importSVG( d.path, function(item) {
			// set gradients 
			var paths = item.children[0].children;
			for (var i = 0; i < paths.length; i++) {
				paths[i].pivot = paths[i].segments[0].point;
				if (i % 2 == 0) {
					paths[i].fillColor = {
						gradient: {
							stops: ['#87d0a1', '#ea4a73']
						},
						origin: paths[i].segments[0].point,
						destination: paths[i].segments[1].point,
					}
					paths[i].fillColor.gradient.stops[1].color.alpha = 0.0;
				} else {
					paths[i].fillColor = {
						gradient: {
							stops: ['#cf9777', '#a1002c']
						},
						origin: paths[i].segments[0].point,
						destination: paths[i].segments[1].point,
					}
				}
				paths[i].fillColor.gradient.stops[1].color.alpha = 0.2;
				paths[i].fillColor.gradient.stops[0].color.alpha = 1.7;
				self.init['path'+i] = {};
				self.init['path'+i]['posPoint1'] = [];

				self.init['path'+i]['posPoint0'] = new paper.Point(paths[i].segments[0].point.x, paths[i].segments[0].point.y);
				self.init['path'+i]['inPoint0'] = paths[i].segments[0].handleIn.angle;
				self.init['path'+i]['outPoint0'] = paths[i].segments[0].handleOut.angle;
				
				self.init['path'+i]['posPoint1'] = new paper.Point(paths[i].segments[1].point.x, paths[i].segments[1].point.y);
				self.init['path'+i]['inPoint1'] = paths[i].segments[1].handleIn.angle;
				self.init['path'+i]['outPoint1'] = paths[i].segments[1].handleOut.angle;

				// paths[i].fullySelected = true;
			};
			self.group.pivot = [item.bounds.width / 2 + d.offset[0], d.offset[1]];
			self.group.addChild(item);
			this.loaded = true;
		});
		this.counter = 0;
	}

	smoothValue(valueOld, valueNew, smooth) {
		return valueOld * smooth + (1 - smooth) * valueNew;
	}

	update(d){
		if (this.group.children[0] != undefined) {

			var paths = this.group.children[0].children[0].children;
			for (var i = 0; i < paths.length; i++) {
				var init = this.init['path'+i];
				var osc = d.animate;
				paths[i].pivot.x = d.pivot[0];
				paths[i].pivot.y = d.pivot[1];
				// paths[i].rotation = d.animate*osc;
				paths[i].segments[0].point.y = init.posPoint0.y + osc*20;
				// paths[i].segments[0].point.x = init.posPoint0.x + osc*50-30;
				// paths[i].segments[0].point.y = init.posPoint0.y + osc3*100;
				// paths[i].segments[0].point.y = init.posPoint0.y - osc*100;
				// paths[i].segments[1].point.y = init.posPoint1.y- osc2*50;
				paths[i].segments[0].handleIn.angle = init.inPoint0 - osc*20 + 30 ;
				paths[i].segments[0].handleOut.angle = init.outPoint0 + osc*20 - 30;  
				// paths[i].opacity = (1.5-osc);
				// paths[i].segments[1].handleOut.angle = init.outPoint1 + osc2*100;  
			}
		}
		this.group.position = d.rootPos;
		this.group.rotation = this.smoothValue(this.group.rotation, d.rotation * (180.0 / Math.PI), 0.95);
		// this.group.scaling = d.animate+0.5+Math.sin(this.counter/20)*0.5+1.3;
		this.counter++;
	}

}
