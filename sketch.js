/*global
    p5, createCanvas, frameRate, width, height, createVector, translate, rotate, mouseX, mouseY, line, stroke, strokeWeight, noStroke, ellipse, background, fill,
    text, rect, sq, dist,
	
	Vehicle
*/
"use strict";
var vehicles = [],
	food = [],
	poison = [];
var debug,
    maxChildren = 0,
	maxHealth = 0;

var NUM_VEHICLES = 100,
	NUM_FOOD = NUM_VEHICLES * 3,
	NUM_POISON = NUM_VEHICLES * 2;


function setup(){
	frameRate(20);
	createCanvas(1200,600);
	var i;
	for(i=0; i<NUM_VEHICLES; i++){
		vehicles[i] = new Vehicle(random(width), random(height), null);
	}
	
	for(var i=0; i<NUM_FOOD; i++){
		food.push(createVector(random(width), random(height)));
	}
	
	for(i=0; i<NUM_POISON; i++){
		poison.push(createVector(random(width), random(height)));
	}
    
    debug = createCheckbox();
}

function mouseClicked(){
    food.push(createVector(mouseX, mouseY));
}

function draw(){
    if(vehicles[0] == undefined){
        clear();
        background(51);
        textSize(50);
        fill(255);
        text("Simulation Over!", 50, 100);
        text("Framecount: " + frameCount, 50, 200);
        text("maxChildren: " + maxChildren, 50, 300);
		text("maxHealth: " + maxHealth, 50, 400);
        noStroke();
        noLoop();
    } else{
        background(51);

        if(frameCount % 4 * vehicles.length === 0){
            food.push(createVector(random(width), random(height)));
        }
        if(frameCount % 8 * vehicles.length === 0){
            poison.push(createVector(random(width), random(height)));
        }
        if(frameCount % 500 == 0){
            vehicles.push(new Vehicle(random(width), random(height), null));
        }

        var i;
        //Draw food
        for(i=0; i<food.length; i++){
            fill(0, 255, 0);
            noStroke();
            ellipse(food[i].x, food[i].y, 8, 8);
        }
        //Draw poison
        for(i=0; i<poison.length; i++){
            fill(255, 0, 0);
            noStroke();
            ellipse(poison[i].x, poison[i].y, 8, 8);
        }

        for(i=vehicles.length-1; i>=0; i--){
            vehicles[i].boundaries();
            vehicles[i].behaviors(food, poison);
            vehicles[i].update();
            vehicles[i].display();
            
            var isDead = vehicles[i].dead();
            if((vehicles[i].lifetime >= Math.round(250 / vehicles[i].health)) && !isDead){
            //if(random() < (0.001 * vehicles[i].health)){
                var newVehicle = vehicles[i].clone();
                vehicles.push(newVehicle);
            }
            
            if(isDead){
                food.push(createVector(vehicles[i].position.x, vehicles[i].position.y));
                vehicles.splice(i, 1);
            }
            
        }
    }
}