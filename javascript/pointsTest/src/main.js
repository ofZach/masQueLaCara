  // load the data in! 
var offsetX = -300;
var offsetY = -130;
// global scale 
var viewScale = 1.7;
setup(data);  
var values = {
    count: 68
};

// ------------------------------------------------------------- make circles: 
var layer = project.activeLayer;
for (var i = 0; i < values.count; i++) {
    var path = new Path.Circle(new Point(100, 100), 5);
    project.activeLayer.children[i].fillColor = 'red';
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
// ------------------------------------------------------------- mouth eyes nose
var faceParts = new Layer();
var facePartsColor = (255, 255, 255, 100);
var groupEyeL;

var mouth;
project.importSVG('assets/mouth.svg', function(item){
    mouth = item;
});

project.importSVG('assets/nose.svg', function(item){
    console.log(item);
});

project.importSVG('assets/eye.svg', function(item){  
    //console.log(item);
    groupEyeL = new Group({
            children: [item],
            fillColor: facePartsColor, 
            position: view.center, 
            transformContent: false
        });
});

//console.log(mouth);

function onFrame(event) {
    
    var frameData = getFrameData();     // grab frame data, update points. 

    for (var i = 0; i < values.count; i++) {
       var item = layer.children[i];
       item.position.x =  offsetValueX(frameData[i][0]* viewScale) ;
       item.position.y =  offsetValueY(frameData[i][1]* viewScale) ;
       item = typeLayer.children[i];
       item.position.x =  offsetValueX(frameData[i][0]* viewScale) ;
       item.position.y =  offsetValueY(frameData[i][1]* viewScale ) + 10;
    }

    var obj = computeStats(frameData);
    if (typeof groupEyeL !== "undefined"){
        groupEyeL.position.x = offsetValueX(obj['leftEye'].x);
        groupEyeL.position.y = offsetValueY(obj['leftEye'].y);
    }
}
function offsetValueX( value){
    return value+offsetX;
}
function offsetValueY( value){
    return value+offsetY;
}
// Reposition the paths whenever the window is resized:
function onResize(event) {
    layer.position = view.center;
    typeLayer
}