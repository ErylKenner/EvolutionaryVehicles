
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
	for(let i=0; i<NUM_VEHICLES; i++){
		vehicles[i] = new Vehicle(random(width), random(height), null);
	}
	
	for(let i=0; i<NUM_FOOD; i++){
		food.push(createVector(random(width), random(height)));
	}
	
	for(let i=0; i<NUM_POISON; i++){
		poison.push(createVector(random(width), random(height)));
	}
    
    debug = createCheckbox();
}

function mouseClicked(){
    food.push(createVector(mouseX, mouseY));
}

function draw(){
    if(vehicles.length == 0){
        showEndScreen();
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

        drawFood();
        drawPoison();
        updateVehicles();
    }
}

function showEndScreen(){
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
}

function drawFood(){
    for(i=0; i<food.length; i++){
        fill(0, 255, 0);
        noStroke();
        ellipse(food[i].x, food[i].y, 8, 8);
    }
}

function drawPoison(){
    for(i=0; i<poison.length; i++){
        fill(255, 0, 0);
        noStroke();
        ellipse(poison[i].x, poison[i].y, 8, 8);
    }
}

function tryToReproduce(i){
    if(vehicles[i].lifetime >= Math.round(250 / vehicles[i].health)){
        let newVehicle = vehicles[i].clone();
        vehicles.push(newVehicle);
    }
}

function dropFood(i){
    food.push(createVector(vehicles[i].position.x, vehicles[i].position.y));
    vehicles.splice(i, 1);
}

function updateVehicles(){
    for(let i=vehicles.length-1; i>=0; i--){
        vehicles[i].boundaries();
        vehicles[i].behaviors(food, poison);
        vehicles[i].update();
        vehicles[i].display();
        if(vehicles[i].dead()){
            dropFood(i);
        } else{
            tryToReproduce(i);
        }
    }
}


