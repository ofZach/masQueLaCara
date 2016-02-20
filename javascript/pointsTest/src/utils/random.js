'use strict';
class Calc{
	random(min, max){
		return Math.random() * (max - min) + min;
	}
	randomInt(min, max){
		return Math.floor((Math.random() * max) + min);
	}
	deg(rad){
		return rad * 180 / Math.PI ;
	}
	rad(degrees) {
		return degrees * Math.PI / 180;
	}
}
var calc = new Calc();