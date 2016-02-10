
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

var fx = new Fx.Spring({
            'stiffness': 100,
            'friction': 5,
            // 'onMotion': function(t){console.log("t = " + t);}
          });

          fx.start(0, 300);

function onFrame() {
    var offset = 100;
    path.segments[0].handleIn.angle = fx.get()/5;
    path.segments[0].handleOut.angle = fx.get()/5+90;
    path.segments[1].handleIn.angle = fx.get()/2;
    path.segments[1].handleOut.angle = fx.get()/2+180;
    frame++;
}
function easeOutElastic(t) {
    var p = 0.3;
    return Math.pow(2,-10*t) * Math.sin((t-p/4)*(2*Math.PI)/p) + 1;
}
function onMouseMove(event) {
    mouse.x = event.event.clientX;
    mouse.y = event.event.clientY;
    fx.start(fx.get(), mouse.x);

    // fx.step();
    
}
function onMouseDown(event) {

path.fullySelected ^=  true;
    //maskManager.nextMask();
}
// new CompoundPath(path1, path2, path3);