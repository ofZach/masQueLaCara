
var circleRadius = 3;
var hadleLength = 100;
var upRight = new Point(hadleLength, -hadleLength);
var downRight = new Point(hadleLength, hadleLength);
var up = new Point(0, -hadleLength);
var down = new Point(0, hadleLength);

var firstPoint = new Point(50, 50);
var secondPoint = new Point(300, 50);

var firstSegment = new Segment(firstPoint, upRight, downRight);
var secondSegment = new Segment(secondPoint, down, up);

var path = new Path(firstSegment, secondSegment);
path.fillColor = {
       gradient: {
           stops: ['yellow', 'red']
       },
       origin: firstPoint,
       destination: secondPoint,
   }
// path.fillColor.gradient.stops[0].color.alpha = 0.0;
path.closed = true;


var frame = 0;
var mouseP = new Point(0, 0);
var mouse = new Point(0, 0);
var angle = 90;
path.rotate(angle);
path.translate([500, 100]);

var fxX = new Fx.Spring({
            'stiffness': 100,
            'friction': 5,
            // 'onMotion': function(t){console.log("t = " + t);}
          });
var fxY = new Fx.Spring({
            'stiffness': 100,
            'friction': 5,
            // 'onMotion': function(t){console.log("t = " + t);}
          });

          fxX.start(0, 300);
var spiral = new Path();
spiral.strokeColor = 'white';

// Add the first segment at {x: 50, y: 50}
// spiral.add([0,0]);
var spiralPoints = [];
var pointZero = new Point(0,0);
// Loop 500 times:
for (var i = 0; i < 50; i++) {

    spiralPoints.push(pointZero);
    // Add the vector relatively to the last segment point:
    spiral.add(pointZero);
};


function onFrame() {
    var offset = 100;
    path.segments[0].handleIn.angle = fxX.get()/5;
    path.segments[0].handleOut.angle = fxX.get()/5+90;
    path.segments[1].handleIn.angle = fxX.get()/2;
    path.segments[1].handleOut.angle = fxX.get()/2+180;
    for (var i = 0; i < 50; i++) {
        spiralPoints[i].angle =  (i%10) * fxX.get()/5-100;
        spiralPoints[i].length =  Math.cos(frame/2 -i/2) - i/2+fxY.get();
        spiral.segments[i].point = spiralPoints[i]+[fxX.get(), fxY.get()];
    }
    spiral.smooth();
    frame++;
}
function easeOutElastic(t) {
    var p = 0.3;
    return Math.pow(2,-10*t) * Math.sin((t-p/4)*(2*Math.PI)/p) + 1;
}
function onMouseMove(event) {
    mouse.x = event.event.clientX;
    mouse.y = event.event.clientY;
    fxX.start(fxX.get(), mouse.x);
    fxY.start(fxY.get(), mouse.y);
    // fx.step();
    
}
function onMouseDown(event) {

path.fullySelected ^=  true;
    //maskManager.nextMask();
}
// new CompoundPath(path1, path2, path3);