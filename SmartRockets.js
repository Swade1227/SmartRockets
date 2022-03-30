//population object
var population; 
//each rocket lasts 400 frames
var lifespan = 500;
//framecount
var count = 0;
//display count
var lifeP;
//rocket target
var target;
//rocket maxforce
var maxforce = 0.3;
//current highscore
var maxDist;
//end message
var gameEnd;
//round count Tracker text object
var roundCountText;
//round count
var roundCount = 1;

let randomY = [];

let numPts = 25;


//rectangle obstacle
var rx = 575;
var ry = 400;
var rw = 300;
var rh = 10;

function setup() {
//target, population, and framerate
  createCanvas(displayWidth,displayHeight-79);
  population = new Population(); 
  lifeP = createP();
  maxDist = createP();
  gameEnd = createP();
  roundCountText = createP();
  target = createVector(width/2, 50);

}
//run(), when finished it scores the rockets (evaluate), then "repopulates" (selection)
function draw() {
  background(0);
  population.run();
  lifeP.html("Frame Count: " + count);
  lifeP.style('font-size', '16px');
  lifeP.style('color', '#00FFFF');
  lifeP.position(displayWidth-150, 0);


  roundCountText.html("Generation : " + roundCount);
  roundCountText.style('font-size', '16px');
  roundCountText.style('color', '#00FFFF');
  roundCountText.position(displayWidth-150, 25);
  count++;

  if (count == lifespan) {
    population.evaluate();
    population.selection();
    count = 0;
    roundCount++;
  }
  
  fill(255);
  rect(rx, ry, rw, rh);
  ellipse(target.x, target.y, 25, 25);
}

// ------------- Start Text stuff ----------------------------------- //

this.endgame = function() {
  gameEnd.style('font-size', '64px');
  gameEnd.style('color', '#DE3163');
  gameEnd.position(displayWidth-1050, 325);
  gameEnd.html("Target Reached, The End!")
  exitGame();
}

this.exitGame = function() {
  exit();
}

this.displayCon = function(maxfit) {
  if (maxfit > 3999) {
    endgame();
  }
  maxDist.style('font-size', '16px');
  maxDist.style('color', '#00FFFF');
  maxDist.position(displayWidth-150, 50);
  maxDist.html("High Score: " + floor(maxfit));
}

// ------------- Start Population ----------------------------------- //

class Population {
  constructor() {
    //array of rockets
    this.rockets = [];
    //population size
    this.popsize = 25;
    //empty mating pool
    this.matingpool = [];

    //initializes rockets
    for (var i = 0; i < this.popsize; i++) {
      this.rockets[i] = new Rocket();
    }

    //scores rockets fitness
    this.evaluate = function () {
      var maxfit = 0;
      for (var i = 0; i < this.popsize; i++) {
        this.rockets[i].calcFitness();
        //if rocket scores higher than maxfitness, increae maxfitness
        if (this.rockets[i].fitness > maxfit) {
          maxfit = this.rockets[i].fitness;
        }
      }

      //normalize scores
      for (var i = 0; i < this.popsize; i++) {
        this.rockets[i].fitness /= maxfit;
        displayCon(maxfit);
      }

      //1 to 100 scale
      //pushes rocket dna into mating pool, higher fitness scores dna get put into the mating pool more often
      //(score of 3 gets 3 entries, 20 gets 20, etc)
      this.matingpool = [];
      for (var i = 0; i < this.popsize; i++) {
        var n = this.rockets[i].fitness * 100;
        for (var j = 0; j < n; j++) {
          this.matingpool.push(this.rockets[i]);
        }
      }
    };

    //natural selection
    this.selection = function () {
      //new rocket array
      var newRockets = [];
      for (var i = 0; i < this.rockets.length; i++) {
        var parentA = random(this.matingpool).dna;
        var parentB = random(this.matingpool).dna;
        //mixes parent DNA into child rocket
        var child = parentA.crossover(parentB);
        //possible mutation 
        child.mutation();
        //creates new child Rocket
        newRockets[i] = new Rocket(child);
      }
      this.rockets = newRockets;
    };

    //updates rockets motion and displays position
    this.run = function () {
      for (var i = 0; i < this.popsize; i++) {
        this.rockets[i].update();
        this.rockets[i].show();
      }
    };
  }
}

// ----------------- End Pop --------------------//

// ------------- Start DNA ----------------------------------- //

//rocket "DNA" made of random vectors and sets max force of the rocket
class DNA {
  constructor(genes) {
    if (genes) {
      this.genes = genes;
    } else {
      this.genes = [];
      for (var i = 0; i < lifespan; i++) {
        this.genes[i] = p5.Vector.random2D();
        this.genes[i].setMag(maxforce);
      }
    }

    //crossover of DNA
    this.crossover = function (partner) {
      var newgenes = [];
      // Picks random midpoint
      var mid = floor(random(this.genes.length));
      for (var i = 0; i < this.genes.length; i++) {
        // If 'i' is bigger than mid then new gene comes from that partner
        if (i > mid) {
          newgenes[i] = this.genes[i];
          //vice versa
        } else {
          newgenes[i] = partner.genes[i];
        }
      }
      //new DNA object the array of "genes/vectors"
      return new DNA(newgenes);
    };

    //if random number less than 0.01 then mutate a random vector
    this.mutation = function () {
      for (var i = 0; i < this.genes.length; i++) {
        if (random(1) < 0.01) {
          this.genes[i] = p5.Vector.random2D();
          this.genes[i].setMag(maxforce);
        }
      }
    };
  }
}

// ------------- End DNA ----------------------------------- //

// ------------- Start Rocket --------------------------//

//create rocket object
class Rocket {
  constructor(dna) {
    //simple 2d physics (pos/vel/acc)
    this.pos = createVector(width / 2, height);
    this.vel = createVector();
    this.acc = createVector();
    //after lifespan ends
    this.completed = false;
    //if rocket crashes
    this.crashed = false;

    //gives rocket "DNA"
    if (dna) {
      this.dna = dna;
    } else {
      this.dna = new DNA();
    }
    this.fitness = 0;

    //applies vector DNA
    this.applyForce = function (force) {
      this.acc.add(force);
    };

    // calculates end distance from target, and modifies it accordingly
    this.calcFitness = function () {
      var d = dist(this.pos.x, this.pos.y, target.x, target.y);
      this.fitness = map(d, 0, width, width, 0);

      if (this.completed) {
        this.fitness *= 10;
      }
      if (this.crashed) {
        this.fitness /= 10;
      }
    };

    //updates rockets position and motion
    this.update = function () {

      var d = dist(this.pos.x, this.pos.y, target.x, target.y);

      if (d < 25) {
        this.completed = true;
        this.pos = target.copy();
      }

      if (this.pos.x > rx && this.pos.x < rx + rw && this.pos.y > ry && this.pos.y < ry + rh) {
        this.crashed = true;
      }

      if (this.pos.x > width || this.pos.x < 0) {
        this.crashed = true;
      }

      if (this.pos.y > height || this.pos.y < 0) {
        this.crashed = true;
      }


      this.applyForce(this.dna.genes[count]);

      if (!this.completed && !this.crashed) {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);
        this.vel.limit(4);
      }
    };

    //displays rocket on screen
    this.show = function () {
      push();
      noStroke();
      fill(255, 150);
      translate(this.pos.x, this.pos.y);
      rotate(this.vel.heading());
      rectMode(CENTER);
      rect(0, 0, 25, 5);
      pop();
    };
  }
}