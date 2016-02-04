// ------------------------------------------------------------- gui
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
maskManager.currentMask = "mask1";
maskManager.setup();
maskManager.nextMask();

var settings = QuickSettings.create();
var maskSettings = QuickSettings.create( 800, 0, "maskSettings");

settings.setGlobalChangeHandler(onFrame);
settings.addRange("currentMaskNum", 0, 1,  maskManager, 1, function(value) {
        maskManager.hideMask(maskSettings);
        maskManager["currentMaskNum"] = value;
        maskManager.showMask(maskSettings);
    });


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
    
    maskManager.update(obj);

    frame++;
}
function onMouseDown(event) {
    maskManager.nextMask();
}
// Reposition the paths whenever the window is resized:
function onResize(event) {
    layer.position = view.center;
    typeLayer
}