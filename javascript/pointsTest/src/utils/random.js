'use strict';
class Calc{
	random(min, max){
		return Math.random() * (max - min) + min;
	}
}
var calc = new Calc();