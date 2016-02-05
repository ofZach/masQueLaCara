// global scale 
var viewScale = 1.3;

// I load and parse data: 
var dataObject;
var frame;

console.log(paper);
//--------------------------------------------------------------------
function setup(jsonData){
	dataObject = JSON.parse(jsonData);
	frame = 0;
}

//--------------------------------------------------------------------
function getFrameData(){
	frame++;
	var frameDataCopy = [];
	var frameData = dataObject[frame % dataObject.length];
	for (i = 0; i < 68; i++){
		
		var point = [];
		point.push(frameData[i][0] * viewScale);
		point.push(frameData[i][1] * viewScale);

		frameDataCopy.push(point);

	}
    return frameDataCopy;
}
// startPos to endPos inclusive
function computeAveragePosition(frameData, startPos, endPos){
	// paper point is a little weird here, have to do this w/ x and y sep. 
	var pt = new paper.Point(0, 0);
	for (var i = startPos; i <= endPos; i++){
	    pt.x += frameData[i][0] ;
	    pt.y += frameData[i][1] ;
	}
	pt.x /= (endPos - startPos + 1);
	pt.y /= (endPos - startPos + 1);
	return pt;
}
function computeAngle(frameData, indexL, indexR){
	var diff = new paper.Point(frameData[indexR][0] - frameData[indexL][0], frameData[indexR][1] - frameData[indexL][1]);
	return Math.atan2(diff.y, diff.x);
}
//--------------------------------------------------------------------
function computeStats(frameData){
	// we use paper.Point here since we are in javascript mode not paperscript mode
	var leftEye = new paper.Point(0, 0);
	var rightEye = new paper.Point(0, 0);
	var mouth = new paper.Point(0, 0);
	var nose = new paper.Point(0, 0);
	var leftEyeAngle;
	var rightEyeAngle;
	var mouthAngle;
	var noseAngle;
	var averageScale;
	
	leftEyeAngle = computeAngle(frameData, 36, 39);
	rightEyeAngle = computeAngle(frameData, 42, 45);
	noseAngle = computeAngle(frameData, 0, 16);
	mouthAngle = computeAngle(frameData, 48, 54);

	leftEye = computeAveragePosition(frameData, 36,41);
	rightEye = computeAveragePosition(frameData, 42,47);
	nose = computeAveragePosition(frameData, 29,35);
	mouth = computeAveragePosition(frameData, 48,59);
	
	var obj = {};
	obj["leftEye"] = leftEye;
	obj["rightEye"] = rightEye;
	obj["leftEyeAngle"] = leftEyeAngle;
	obj["rightEyeAngle"] = rightEyeAngle;
	obj["nose"] = nose;
	obj["mouth"] = mouth;
	obj["noseAngle"] = noseAngle;
	obj["mouthAngle"] = mouthAngle;
	return obj;
}
