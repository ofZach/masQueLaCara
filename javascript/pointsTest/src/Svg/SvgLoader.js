'use strict';



class SvgLoader {
    constructor(name, parentName, path, pivotOffset) {

        this.angleOffset = 0;
        this.positionOffset = new paper.Point(0, 0);
        this.scale = 1.0;

        this.name = name;
        this.ParentName = parentName; // for debugging this is the mask name.
        this.group = new paper.Group();
        this.group.transformContent = false;
        var self = this;
        paper.project.importSVG(path, function(item) {
            self.group.addChild(item);
            
            self.group.pivot = [self.group.bounds.width/2+pivotOffset.x, self.group.bounds.height/2+pivotOffset.y];
            // var rect = new paper.Shape.Rectangle([0, 0], [self.group.bounds.width, self.group.bounds.height]);
            // self.group.addChild(rect);
            // rect.strokeColor = 'white';
        });

        
    }
    setPosition(position) {
        var smooth = 0.76;
        this.group.position.x = this.group.position.x*smooth + (1-smooth)*position.x + this.positionOffset.x;
        this.group.position.y = this.group.position.y*smooth + (1-smooth)*position.y + this.positionOffset.y;
    }
    offsetPivot(position) {
        this.group.pivot = this.group.pivot+position;
    }
    setAngle(angle, smooth) {
       var curAngle = this.group.rotation;
       var newAngle = angle * (180.0 / Math.PI);
       var diff = (newAngle - curAngle);
       if (diff < -180) diff += 360;
       if (diff > 180) diff -= 360;

       curAngle = curAngle + smooth * diff;
       this.group.rotation = curAngle + this.angleOffset;
   }
    setScale(scale) {
        var smooth = 0.75;
        this.group.scaling.x = this.group.scaling.x*smooth + (1-smooth)*scale;
        this.group.scaling.y = this.group.scaling.y*smooth  + (1-smooth)*scale;
    }
    setOpacity(opacity){
        var smooth = 0.9; 
        this.group.opacity = this.group.opacity*smooth + (1-smooth)*opacity;

    }
    sayHello() {
        console.log("hello");
        console.log(name);
    }

    // returnGuiJson() {
    //     var self = this;
    //     var params = {
    //         angle: {
    //             display: 'range',
    //             value: 0,
    //             min: -180,
    //             max: 180,
    //             onChange: function(val) {
    //                 self.angleOffset = val;
    //             },
    //             listen: true
    //         },
    //         scale: {
    //             display: 'range',
    //             value: 1,
    //             min: -5,
    //             max: 5,
    //             step: 0.02,
    //             onChange: function(val) {
    //                 self.scale = val;
    //             },
    //             listen: true
    //         },
    //         positionOffset: {
    //             x: {
    //                 display: 'range',
    //                 value: 0,
    //                 min: -300,
    //                 max: 300,
    //                 step: 1,
    //                 onChange: function(val) {
    //                     self.positionOffset.x = val;
    //                 },
    //                 listen: true
    //             },
    //             y: {
    //                 display: 'range',
    //                 value: 0,
    //                 min: -300,
    //                 max: 300,
    //                 step: 1,
    //                 onChange: function(val) {
    //                     self.positionOffset.y = val;
    //                 },
    //                 listen: true
    //             }
    //         }
    //     }

    //     return params;
    // }

};