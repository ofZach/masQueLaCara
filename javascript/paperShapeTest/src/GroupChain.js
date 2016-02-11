var point = new Point(0, 0);
var size = new Size(60, 60);

var rect1 = new Shape.Rectangle(point, size);
rect1.strokeColor = 'white';

var rect2 = new Shape.Rectangle(point, size);
rect2.strokeColor = 'red';

var group1 = new Group();
group1.addChild(rect1);
group1.transformContent = false;

var group2 = new Group();
group2.addChild(rect2);
group2.transformContent = false;
console.log("group1.bounds = " + group1.bounds);
group2.pivot = [0, 0];

group1.addChild(group2);
var frame = 0;
function onFrame () {
	frame ++;
	group2.rotation = frame;
	group1.position
}
var mouse = new Point(0, 0);
function onMouseMove(event) {
    mouse.x = event.event.clientX;
    mouse.y = event.event.clientY;
    group1.position = mouse;
    
}
