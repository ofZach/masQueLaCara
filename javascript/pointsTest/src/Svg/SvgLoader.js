'use strict';
class SvgLoader {
	setup(name, path){
		this.name = name;
		this.group =  new paper.Group();
        this.group.transformContent = false;
		var self = this;
		paper.project.importSVG(path, function(item){
			self.group.addChild(item);
		});
	}
    setPosition(position){
    	this.group.position = position;
    }
    setAngle(angle){
		this.group.rotation = angle * (180.0 / Math.PI);
    }
    setScale(scale){
    	this.group.scaling = scale;
    }
    addToGui(gui){
    	
    }
};
