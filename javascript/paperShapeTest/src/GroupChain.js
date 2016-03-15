var point = new Point(0, 0);
var size = new Size(70, 60);

var rect1 = new Shape.Rectangle(point, [90, 100]);
rect1.strokeColor = 'white';

var rect2 = new Shape.Rectangle(point, [20,200]);
rect2.strokeColor = 'red';

var rect3 = new Shape.Rectangle(point, size);
rect3.strokeColor = 'green';

var group1 = new Group();
group1.addChild(rect1);
group1.transformContent = false;

var group2 = new Group();
group2.addChild(rect2);
group2.transformContent = false;

var group3 = new Group();
group3.addChild(rect3);
group3.transformContent = false;

group1.pivot = new Point(0, rect1.bounds.height/2);
group1.position = new Point(250, 250);

group2.pivot = new Point(0, group2.bounds.height/2);
group2.position = new Point(group1.bounds.width, group1.bounds.height/2);

group3.pivot = new Point(0, group3.bounds.height/2);
group3.position = new Point(group2.bounds.width, group2.bounds.height/2);

group1.addChild(group2);
group2.addChild(group3);

var frame = 0;
function onFrame () {
	frame ++;
	group2.rotation = Math.cos(frame/9)*20;
	group3.rotation = Math.cos(frame/9)*20;
}
var mouse = new Point(0, 0);
function onMouseMove(event) {
    mouse.x = event.event.clientX;
    mouse.y = event.event.clientY;
    group1.position = mouse;
    
}
