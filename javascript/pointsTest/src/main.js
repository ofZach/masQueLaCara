'use strict';
var DP = new dataPlayer();
DP.setup();
DP.setupDebugView();
DP.loadData(data);

//---------------------------------------- setup stats
var stats = new Stats();
stats.setMode(1);
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '10px';
stats.domElement.style.top = '0px';
document.body.appendChild(stats.domElement);

//---------------------------------------- setup masks
var rootLayer = new Layer();
var MM = new MaskManager();
MM.setup();

//--------------------- physics: 
physicsManager.setup();

noise.seed(Math.random());
//----------------------------------------- gui
var mainGui = function() {
    this.maskName = '';
    this.displayDebug = true;
    this.displayDebugDots = true;
    this.explode = function() {
        console.log("hello");
    };
};
var text = new mainGui();
var gui = new dat.GUI();
gui.add(text, 'displayDebugDots').onChange(function(value) {
    DP.setViewDots(value);
});
gui.add(text, 'displayDebug').onChange(function(value) {
    DP.setDebugView(value);
});
DP.setDebugView(false);
var changeMask = false;
var newMaskName = "";
gui.add(text, 'maskName', MM.names).onChange(function(value) {
    console.log("value = " + value)
    //MM.setMaskByName(value);
    changeMask = true;
    newMaskName = value;
});
MM.setMaskByName('mononokeMask');

console.log(MM);

function onFrame(event) {

    //console.log(text.displayDebug);
    // if (text.displayDebug === true){
    //     DP.
    // }

    stats.begin();
    DP.update();
    MM.update(DP.frameAnalysis);
    stats.end();

    if (changeMask === true) {
        changeMask = false;
        MM.setMaskByName(newMaskName);
    }
}

function onResize(event) {


}