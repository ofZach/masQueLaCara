'use strict';
// ------------------------------------------------------------- gui
var frame = 0;

setup(data);
var values = {
    count: 68
};



function getRand(min, max) {
    return Math.random() * (max - min) + min;
}

// ------------------------------------------------------------- make circles: 
var layer = project.activeLayer;
for (var i = 0; i < values.count; i++) {
    var path = new Path.Circle(new Point(100, 100), 5);
    project.activeLayer.children[i].fillColor = 'green';
}
// ------------------------------------------------------------- make typography in another layer (so we an see points) 
var typeLayer = new Layer();
for (var i = 0; i < values.count; i++) {
    var text = new PointText({
        point: view.center,
        justification: 'center',
        fontSize: 10,
        fillColor: 'blue'
    });
    text.content = i;
}

//physicsManager.setup();

// var physicsLayer = new Layer();
// var physObjs = [];
// for (i = 0; i < 50; i++){
//   var rad = getRand(10,50);
//   var path = new Path.Circle(new Point(getRand(200,300), getRand(200,300)), rad);
//   project.activeLayer.children[i].fillColor = 'pink';
//   var circs = physicsManager.addCircle(100,100,rad);
//   physObjs.push(circs);
// }

// ------------------------------------------------------------- mouth eyes nose
var maskManager = new MaskManager();
maskManager.setup();
var settings = QuickSettings.create();
var maskSettings = QuickSettings.create(project.view.size.width - 200, 0, "maskSettings");

settings.setGlobalChangeHandler(onFrame);

settings.addDropDown("whichMask", maskManager.names, function(value) {
    maskManager.hideMask(maskSettings);
    maskManager.setMaskByName(value);
    maskManager.showMask(maskSettings);
});

maskManager.showMask(maskSettings);

function onFrame(event) {

    //if (frame % 5 == 0) 

    var frameData = getFrameData(); // grab frame data, update points. 

    for (var i = 0; i < values.count; i++) {
        var item = layer.children[i];
        item.position.x = frameData[i][0];
        item.position.y = frameData[i][1];
        item = typeLayer.children[i];
        item.position.x = frameData[i][0];
        item.position.y = frameData[i][1] + 10;
    }

    // for (var i = 0; i < physObjs.length; i++){
    //     var item = physicsLayer.children[i];
    //     var b = physObjs[i];
    //     item.position.x = b.position.x;
    //     item.position.y = b.position.y;
           
    // }

    var obj = computeStats(frameData);

    maskManager.update(obj);

    frame++;
}


// function onMouseMove(event) {
//     // var mousePt = new Point(event.event.clientX, event.event.clientY);
//     // for (var i = 0; i < physObjs.length; i++){
//     //     var objPt = new Point(physObjs[i].position.x, physObjs[i].position.y);
//     //     var dist = mousePt.getDistance(objPt);
//     //     var diff = mousePt.subtract(objPt);
//     //     diff=diff.normalize();
//     //     diff=diff.multiply(0.01);
        
//     //         Body.applyForce(physObjs[i], physObjs[i].position, {
//     //                     x: diff.x,
//     //                     y: diff.y
//     //                 });
//     //         //{ x: 100, y: py }
//     //         //physObjs[i].setVelocity({ x: xVel + getRand(-20,20), y: yVel + getRand(-20,20)});
        

//     // }
//     // console.log(event.event.clientX);   
// }

// function onMouseDown(event) {

//     //maskManager.nextMask();
// }
// Reposition the paths whenever the window is resized:
function onResize(event) {
    layer.position = view.center;
    typeLayer
}