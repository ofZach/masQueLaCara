'use strict';
class loadSvg {
    constructor(d) {
        this.group = new paper.Group();
        this.loaded = false;
        var self = this;
        paper.project.importSVG(d.path, function(item) {
            self.group = item;
            self.group.pivot = [self.group.bounds.width/2 + d.pivot[0], self.group.bounds.height/2 + d.pivot[1] ];
            self.group.transformContent = false;
            this.loaded = true;
        });
    }
}
class cloudMask extends MaskBase {

	//------------------------------------------
	setup() {
		super.addLayer();
		this.name = "cloudMask";
		this.head = new loadSvg({
			path: 'assets/svg/CloudFace/head.svg',
			pivot: [0, 0],
		});
		this.eyeL = new loadSvg({
			path: 'assets/svg/CloudFace/eye.svg',
			pivot: [0, 0],
		});
		this.eyeR = new loadSvg({
			path: 'assets/svg/CloudFace/eye.svg',
			pivot: [0, 0],
		});
		this.nose = new loadSvg({
			path: 'assets/svg/CloudFace/nose.svg',
			pivot: [0, 0],
		});
		this.mouth = new loadSvg({
			path: 'assets/svg/CloudFace/mouth.svg',
			pivot: [0, 0],
		});
		this.cheekL = new loadSvg({
			path: 'assets/svg/CloudFace/cheek.svg',
			pivot: [0, 0],
		});
		this.cheekR = new loadSvg({
			path: 'assets/svg/CloudFace/cheek.svg',
			pivot: [0, 0],
		});
		this.browR = new loadSvg({
			path: 'assets/svg/CloudFace/brow.svg',
			pivot: [0, 0],
		});
		this.browL = new loadSvg({
			path: 'assets/svg/CloudFace/brow.svg',
			pivot: [0, 0],
		});
		this.angle = 0;
		this.scale = new paper.Point(0, 0);
	}
	smoothValue(valueOld, valueNew, smooth){
 		return valueOld*smooth + (1-smooth)* valueNew;
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

		var scale = head.scale;
		var angle = head.angle;

		this.angle =  this.smoothValue(this.angle, angle * (180.0 / Math.PI), 0.6);
		this.scale.x = this.smoothValue(this.scale.x, scale, 0.7);
		this.scale.y = this.smoothValue(this.scale.y, scale, 0.7);
		
		this.link(this.head, head, [0, -100], [0.5, 0.5], 0);
		this.link(this.eyeL, eyeL, [0, 0], [0, 0], 0);
		this.link(this.eyeR, eyeR, [0, 0], [0, 0], 0);
		this.link(this.nose, nose, [0, -50], [0.5, 0.5], 0);
		this.link(this.mouth, mouth, [0, 0], [0, 0], 0);
		this.link(this.cheekL, cheekL, [0, -50], [-0.2, -0.2], 0);
		this.link(this.cheekR, cheekR, [0, -50], [-0.2, -0.2], 0);
		this.link(this.browR, browR, [-20, -20], [0.5, 0.5], 0);
		this.link(this.browL, browL, [20, -20], [0.5, 0.5], 0);
	}
	link(obj, dest, posOffset, scaleOffset, angleOffset){
		obj.group.position = dest.position.add( posOffset[0], posOffset[1]);
		obj.group.scaling = this.scale.add(scaleOffset[0], scaleOffset[1]);
		obj.group.rotation = this.angle+angleOffset;
	}
	show() {
		this.showLayer();
	}

	hide() {
		this.hideLayer();
	}
}