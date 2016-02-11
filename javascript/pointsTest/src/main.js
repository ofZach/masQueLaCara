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
var MM = new MaskManager();
MM.setup();


//----------------------------------------- gui
var mainGui = function() {
    this.maskName = '';
    this.displayDebug = true;
    this.explode = function() {
        console.log("hello");
    };
};
var text = new mainGui();
var gui = new dat.GUI();
gui.add(text, 'displayDebug').onChange(function(value) {
    DP.setDebugView(value);
});
gui.add(text, 'maskName', MM.names).onChange(function(value) {
    MM.setMaskByName(value);
});

MM.setMaskByName('demoMask');

function onFrame(event) {

    //console.log(text.displayDebug);
    // if (text.displayDebug === true){
    //     DP.
    // }

    stats.begin();
    DP.update();
    MM.update(DP.frameAnalysis);
    stats.end();
}


function onResize(event) {


}