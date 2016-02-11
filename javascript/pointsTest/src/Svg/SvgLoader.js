'use strict';



class SvgLoader {
    setup(name, parentName, path) {

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
        });
    }
    setPosition(position) {
        this.group.position.x = position.x + this.positionOffset.x;
        this.group.position.y = position.y + this.positionOffset.y;
    }
    setPivot(position) {
        this.group.pivot = position;
    }
    setAngle(angle) {
        this.group.rotation = angle * (180.0 / Math.PI) + this.angleOffset;
    }
    setScale(scale) {
        this.group.scaling = this.scale;
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