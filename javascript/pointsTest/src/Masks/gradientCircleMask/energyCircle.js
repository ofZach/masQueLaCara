'use strict';
class energyCircle{
	constructor(d){
		this.energy = d.energy;
		this.scaleFactor = d.scaleFactor;
		this.angleEnergy = 0; // vel
		this.rotation = 0;
		this.angleLastFrame = 0;
		this.counter = 0;
		var shape = new shapeType(d);
		this.group = new paper.Group(shape.shapeType.path);
		this.group.pivot = [0, 0];
		this.group.transformContent = false;
	}
	update(data, name){
		this.counter++;
		// fade out the prev energy: 
		this.angleEnergy = this.angleEnergy * this.energy;
		// grab the current data
		var leftEyeAngleThisFrame = data['faceParts'][name]['angle'] * (180 / Math.PI);
		// subtract the prev from curr to get "velocty"
		var leftEyeDiff = leftEyeAngleThisFrame - this.angleLastFrame;
		// angles wrap over so check use the shortest distance:
		if (leftEyeDiff < -180) leftEyeDiff += 360;
		if (leftEyeDiff > 180) leftEyeDiff -= 360;
		// increase the energy by the difference
		this.angleEnergy += leftEyeDiff * this.scaleFactor;
		// store the last frame
		this.angleLastFrame = leftEyeAngleThisFrame;
		// rotate the eye
		this.rotation += this.angleEnergy;
		this.group.rotation = this.rotation;
	}
};