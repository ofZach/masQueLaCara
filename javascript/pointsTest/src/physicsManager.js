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

        // assume we want walls;
        //physicsManager.addWalls();

        Engine.run(engine);
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
    }

    //-------------------------------------------------------------------------
    static addCircle(x, y, radius) {

        var body = Bodies.circle(x, y, radius, {
            friction: 0.001,
            restitution: 0.1,
            density: 0.001
        });
        World.add(engine.world, body);

        return body;
    }


};