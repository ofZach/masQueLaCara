var myPath = new paper.Path();
myPath.strokeColor = 'white';
for (var i = 0; i < 10; i++) {
	myPath.add(new Point(i*50, Math.sin(i*2)*20+300));
};

myPath.smooth();

var follower = new PathFollower();
follower.setup(4);

function onFrame () {
	follower.update(myPath);
}