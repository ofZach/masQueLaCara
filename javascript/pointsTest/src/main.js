  // load the data in! 
var offsetX = -300;
var offsetY = -130;
// global scale 
var viewScale = 1.7;
var frame = 0;

setup(data);  
var values = {
    count: 68
};


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
// ------------------------------------------------------------- mouth eyes nose
maskBase.setup();
maskManager.currentMask = "mask1";
maskManager.setup();
maskManager.getCurMask().setVisible(true);
maskManager.attachMask();

function onFrame(event) {
    
    var frameData = getFrameData();     // grab frame data, update points. 

    for (var i = 0; i < values.count; i++) {
       var item = layer.children[i];
       item.position.x =  frameData[i][0] ;
       item.position.y =  frameData[i][1] ;
       item = typeLayer.children[i];
       item.position.x =  frameData[i][0] ;
       item.position.y =  frameData[i][1] + 10;
    }

    var obj = computeStats(frameData);
    
    maskBase.update(obj);
    maskManager.update();

    frame++;
}
function onMouseDown(event) {
    maskManager.nextMask();
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