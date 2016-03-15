'use strict';


// there's no static properties so leave this out for now: 
var Engine = Matter.Engine,
	World = Matter.World,
	Bodies = Matter.Bodies,
	Body = Matter.Body,
	Vector = Matter.Vector;
var engine;


class physicsManager {

	//-------------------------------------------------------------------------
	static setup() {


		// create a Matter.js engine
		engine = Engine.create({
			render: {
				visible: false
			}
		});


		engine.world.gravity.x = 0;
		engine.world.gravity.y = 0;

		this.bodiesList = [];

		console.log(engine);

	}

	static update() {
		Engine.update(engine, 1.0); // delta?
	}

	static removeAllBodies() {

		for (var j = 0; j < this.bodiesList.length; j++) {
			World.remove(engine.world, this.bodiesList[j]);
		}
		this.bodiesList = [];
	}

	//-------------------------------------------------------------------------
	static addWalls() {

		var ground = Bodies.rectangle(400, 610, 810, 60, {
			isStatic: true
		});
		var wallA = Bodies.rectangle(0, 305, 60, 670, {
			isStatic: true
		});
		var wallB = Bodies.rectangle(800, 305, 60, 670, {
			isStatic: true
		});
		var ceiling = Bodies.rectangle(400, 0, 810, 60, {
			isStatic: true
		});
		World.add(engine.world, [ground, wallA, wallB, ceiling]);

		this.bodiesList.push(ground);
		this.bodiesList.push(wallA);
		this.bodiesList.push(wallB);
		this.bodiesList.push(ceiling);
	}



	//-------------------------------------------------------------------------
	static addCircle(x, y, radius, amIstatic) {

		var body = Bodies.circle(x, y, radius, {
			friction: 0.001,
			restitution: 0.01,
			density: 0.001,
			isStatic: amIstatic
		});

		World.add(engine.world, body);

		this.bodiesList.push(body);
		return body;
	}


};