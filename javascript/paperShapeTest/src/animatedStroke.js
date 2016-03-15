var myPath = new paper.Path();
myPath.strokeColor = 'white';
for (var i = 0; i < 10; i++) {
	myPath.add(new Point(i*50, Math.sin(i*2)*20+300));
};

myPath.smooth();

var follower = new PathFollower();
follower.setup(6);
var _totalDistance = 0;
for (var i = 0; i < myPath.curves.length; i++) {
	_totalDistance += myPath.curves[i].length;
};
console.log("_totalDistance = " + _totalDistance)

function onFrame () {
	follower.update(myPath, _totalDistance);
}