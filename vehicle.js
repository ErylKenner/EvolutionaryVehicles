/*global
    p5, createCanvas, frameRate, width, height, createVector, translate, rotate, mouseX, mouseY, line, stroke, strokeWeight, noStroke, ellipse, background, fill,
    text, rect, sq, dist,
*/
"use strict";
// The "Vehicle" class
function Vehicle(x,y, dna){
	this.acceleration = createVector(0,0);
	this.velocity = createVector(random(2, 3),random(-3, -2));
	this.position = createVector(x,y);
	this.r = 4;
	this.maxvelocity = 7;
	this.maxforce = 1;
    
    this.maxView = 200;
    this.maxAttraction = 1;
    
    this.mutationRate = 0.2;
    this.mutationScale = 0.1;
	
	this.health = 1;
    this.lifetime = 1;
    this.children = 0;
    
    this.dna = [];
	if(dna == null){
        //food weight, poison weight, food perception, poison perception
        this.dna[0] = random(0, 1);
        this.dna[1] = random(0, 1);
        this.dna[2] = random(0, 1);
        this.dna[3] = random(0, 1);
    } else {
        this.dna = dna.slice();
        for(var i=0; i<this.dna.length; i++){
            if(random(1) < this.mutationRate){
                this.dna[i] += random(-this.mutationScale, this.mutationScale);
            }
        }
    }

	this.update     = function(){
		if(this.health > maxHealth){
			maxHealth = this.health;
			console.log("Health: " + maxHealth);
		}
        if(this.health > 6){
            this.health = 6;
        }
		this.health -= 0.005;
        this.lifetime++; 
		
		this.position.add(this.velocity).add(0.5 * this.acceleration);
		this.velocity.add(this.acceleration);
		//max speed
		this.velocity.limit(this.maxvelocity);
	};

	this.applyForce = function(force){
        if(force > this.maxforce){
            force = this.maxforce;
        }
		this.acceleration.add(force);
	};

	this.display    = function(){
		// Draw a triangle rotated in the direction of velocity
		var theta = this.velocity.heading() + PI/2;
		strokeWeight(3);
		push();
		translate(this.position.x,this.position.y);
		rotate(theta);
		
		if(debug.checked()){
            //dna indicators
            stroke(0, 255, 0);
            noFill();
            line(0, 0, 0, -((this.dna[0] * 2 - 1) * 40));
            ellipse(0, 0, this.dna[2] * this.maxView * 2);
            strokeWeight(2);
            stroke(255, 0, 0);
            line(0, 0, 0, -((this.dna[1] * 2 - 1) * 40));
            ellipse(0, 0, this.dna[3] * this.maxView * 2);
        }
        
        //Body color
		if(this.health <= 1){
            var red = color(255, 0, 0);
            var green = color(0, 255, 0);
            var col = lerpColor(red, green, this.health);   
        } else if(this.health <= 3){
            var green = color(0, 255, 0);
            var blue = color(0, 0, 255);
            var col = lerpColor(green, blue, (this.health - 1) / 2);
        } else if(this.health < 3.5){
            var blue = color(0, 0, 255);
            var purple = color(128, 0, 188);
            var col = lerpColor(blue, purple, (this.health - 3) * 2);
            strokeWeight(6);
        } else{
            var col = color(255, 255, 255);
            strokeWeight(8);
        }
        fill(col);
        
		
		
		stroke(col);
		beginShape();
		vertex(0, -this.r*2);
		vertex(-this.r, this.r*2);
		vertex(this.r, this.r*2);		
		endShape(CLOSE);
		pop();
	};
	
	this.behaviors  = function(good, bad){
		var steerG = this.eat(good, 0.3, this.dna[2] * this.maxView);
		var steerB = this.eat(bad, -0.9, this.dna[3] * this.maxView);
		
		steerG.mult((this.dna[0] * 2 - 1) * this.maxAttraction);
		steerB.mult((this.dna[1] * 2 - 1) * this.maxAttraction);
		
		this.applyForce(steerG);
		this.applyForce(steerB);
	};
	
	this.eat        = function(list, nutrition, perception){
		var record = Infinity,
			closest = null;
		for(var i = list.length - 1; i >= 0; i--){
			var d = this.position.dist(list[i]);
            //eat if on the item
            if(d < this.maxvelocity){
                list.splice(i, 1);
                this.health += nutrition;
            } else if(d < record && d <= perception){
				record = d;
				closest = list[i];
			}
		}
        
        if(closest !== null){
			return this.seek(closest);
		}
		return createVector(0, 0);
	};
	
	this.seek       = function(target){
		var desired = p5.Vector.sub(target,this.position);
		desired.setMag(this.maxvelocity);
		var steer = p5.Vector.sub(desired,this.velocity);
		steer.limit(this.maxforce);

		return steer;
	};
	
	this.dead       = function(){
		return (this.health < 0);
	};
	
	this.boundaries = function(){
		var d = 25;
		var desired = null;

		if (this.position.x < d) {
			desired = createVector(this.maxvelocity, this.velocity.y);
		}
		else if (this.position.x > width - d) {
			desired = createVector(-this.maxvelocity, this.velocity.y);
		}

		if (this.position.y < d) {
			desired = createVector(this.velocity.x, this.maxvelocity);
		}
		else if (this.position.y > height - d) {
			desired = createVector(this.velocity.x, -this.maxvelocity);
		}

		if (desired !== null) {
			desired.setMag(this.maxvelocity);
			var steer = p5.Vector.sub(desired, this.velocity);
			steer.limit(this.maxforce);
			this.applyForce(steer);
		}
  	};
    
    this.clone      = function(){
        this.lifetime = 0;
        this.children++;
        if(this.children > maxChildren){
            maxChildren = this.children;
            console.log("Children: " + this.children);
        }
        return new Vehicle(this.position.x, this.position.y, this.dna);
    };
}