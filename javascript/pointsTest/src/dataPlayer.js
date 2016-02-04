// global scale 
var viewScale = 1.7;

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
	
	var diff = new paper.Point(frameData[39][0] - frameData[36][0], frameData[39][1] - frameData[36][1]);
	 leftEyeAngle = Math.atan2(diff.y, diff.x);

	var diff2 = new paper.Point(frameData[45][0] - frameData[42][0], frameData[45][1] - frameData[42][1]);
	 rightEyeAngle = Math.atan2(diff2.y, diff2.x);

	var diff3 = new paper.Point(frameData[35][0] - frameData[31][0], frameData[35][1] - frameData[31][1]);
	 noseAngle = Math.atan2(diff3.y, diff3.x);

	var diff4 = new paper.Point(frameData[54][0] - frameData[48][0], frameData[54][1] - frameData[48][1]);
	 mouthAngle = Math.atan2(diff4.y, diff4.x);

	var p0 = new paper.Point(frameData[0][0], frameData[0][1]);
	var p16 = new paper.Point(frameData[16][0], frameData[16][1]);

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
