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
	smooth(valueOld, valueNew, smooth){
		return valueOld*smooth + (1-smooth)* valueNew;
	}
	map(value, low1, high1, low2, high2) {
    	return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
	}
}
var calc = new Calc();