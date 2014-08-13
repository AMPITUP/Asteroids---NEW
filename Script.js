/////////////////////////////
////////Game Constants 
/////////////////////////////

var SCREEN_WIDTH = 600;        // Width of game screen
var SCREEN_HEIGHT = 500;       // Height of game screen
var MAX_SHIP_SPEED = 35;       // Maximum speed of ship
var NUM_BULLETS = 20;          // Maximum simultaneous bullets that can fly
var DELAY_BULLET = 3;          // Number of update frames between bullet firing  
var BULLET_LIFE = 20;          // Number of frames bullet flies
var SPREAD = 1;                // Degrees of spread of bullet tragectory 
var LIVES = 3;                 // Number of lives player starts game with

var SCORE_ASTEROID = 3;        // Number of points awarded when bullet hits large asteroid
var SCORE_SMALL_ASTEROID = 7;  // " small asteroid
var SCORE_TINY_ASTEROID = 12;  // " tiny asteroid

var NUM_ASTEROIDS = 2;         // Number of large asteroids in game
var NUM_SMALL_ASTEROIDS = 1;   // " small asteroids
var NUM_TINY_ASTEROIDS = 1;    // " tiny asteroids

var NUM_ALIENS = randNum;            // Number of alien ships flying through game

/*--------------------------------
   Image file names
*/

var IMG_PATH = "Images/";                              // Image base path
var SHIP = IMG("SpaceShip.png",50,50);                 // Ship
var BULLET = IMG("Bullet.png",10,10);                  // Bullet
var ASTEROID = IMG("Asteroid.png",150,150);            // Large Asteroid
var SMALL_ASTEROID = IMG("SmallAsteroid.png",100,100); // Small Asteroid
var TINY_ASTEROID = IMG("TinyAsteroid.png",75,75);     // Tiny Asteroid
var ALIEN = IMG("Alien.png",40,50);                    // Alien Ship
var ALIEN_LASER = IMG("AlienLaser.png",5,5);           // Alien Laser 


/////////////////////////////
////////Working Storage
/////////////////////////////

var life;           // Current remaining player lifes
var points;         // Current player point total
var scene;          // Active Game scene 
var spaceShip;      // Player's ship sprite object
var bullets;        // Array of bullet sprite objects
var asteroids;      // Array of asteroid sprite objects
var aliens;         // Array of alien ship objects
var msgBoard;       // HTML element where score and lives are displayed
var bulletTimer;    // Regulates number of simultaneous bullets fired by player - measured in update frames
var randNum;        // A randum number between 1 and 500 that is used to generate aliens
var frameRate;      // Divides update frame rate by two.


/////////////////////////////
////////Image file name functions
/////////////////////////////

function IMG(name, width, height) {
    return {name:name, width:width, height:height};
}

function newSprite(ImgO) {
    return new Sprite(scene, IMG_PATH + ImgO.name, ImgO.width, ImgO.height);
}

/////////////////////////////
////////start Ship code
/////////////////////////////

/*--------------------------------
    Add amount of points to score
    Display score and life count 
*/

function addPoints(amount) {
    points += amount;
    msgBoard.innerHTML = "<b>Score:</b> "+ points + ", <b>Lives:</b> " + life;
}

/*--------------------------------
   Ship loses a life...
*/

function die() {
    life--;
    console.log("Lost a life");
    addPoints(0);
    if (life <= 0) {
        console.log("Game Over! Score = " + points);
        alert("Game Over! Your score was: " + points);
        scene.stop();
        return;
    } //endif
} //end die()

/*--------------------------------
   Create ship sprite.
*/

function Ship() {
    var th = newSprite(SHIP);
    th.setSpeed(0);
    th.setPosition(SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2);
    th.setBoundAction(WRAP);
    th.changeImgAngleBy(90);
    return th;
}  //end Ship()

/*--------------------------------
   Check ship control keys...
*/

function keyChecks() {    
    //key checks
    if (keysDown[K_UP] && spaceShip.getSpeed() < MAX_SHIP_SPEED) {
        spaceShip.changeSpeedBy(2);
    } //end left
    if (keysDown[K_DOWN] && spaceShip.getSpeed() > -MAX_SHIP_SPEED) {
        spaceShip.changeSpeedBy(-1);
    } //end down
    if (keysDown[K_LEFT]) {
        spaceShip.changeAngleBy(-10);
    } //end left
    if (keysDown[K_RIGHT]) {
        spaceShip.changeAngleBy(10);
    } //end right
    if (keysDown[K_SPACE]) {
        fireBullet();
    }
    //end key checks
        
}

/////////////////////////////
////////end Ship code
/////////////////////////////

/////////////////////////////
////////start Bullet code
/////////////////////////////

/*--------------------------------
   Create bullet sprite.
*/

function Bullet() {
    var th = newSprite(BULLET, 10, 10);
    th.setBoundAction(WRAP);
    th.hide();
    return th;
                   
} //end Bullet()


/*--------------------------------
   Create and log all bullet sprites.
*/

function makeBullets(){
    bullets = [];
    for (i = 0; i < NUM_BULLETS; i++)
        bullets.push(Bullet());
} // end makeBullets
    

/*--------------------------------
   Animation code for bullet sprites.
*/

function updateBullets(){
    var th;
    for (i = 0; i < bullets.length; i++){
        if ((th = bullets[i]).visible) {
            if (th.bulletLife > 0)
                th.bulletLife--;
            else
                th.hide();
            th.update();
        }
    } // end for
    // This regulates the number of simultaneous
    // bullets that can be fired.
    if (bulletTimer > 0)
        bulletTimer--;
} // end updateBullets


/*--------------------------------
   Ship fires a bullet sprite.
*/

function fireBullet () {
    var i, th;
    // If too soon to fire a bullet,
    if (bulletTimer > 0)
        // Do nothing...
        return;
    // Loop through available bullets
    // looking for an available sprite...
    for (i = 0; i < bullets.length; i++) {
        if (!(th = bullets[i]).visible) {
           // Delay next bullet firing...
           bulletTimer = DELAY_BULLET;
           // Bullet flight time...
           th.bulletLife = BULLET_LIFE;
           // Set angle of bullet motion...
           th.setMoveAngle(-90 + spaceShip.getImgAngle() + (Math.random() * SPREAD) - (SPREAD / 2));
           // Now the speed, based on how fast ship is moving.
           th.setSpeed(spaceShip.getSpeed() + 20);
           // Start bullet at location of ship...
           th.setPosition(spaceShip.x, spaceShip.y);
           // Make bullet visible.
           th.show();
           return;
        }
    }
}

/////////////////////////////
////////end bullet code
/////////////////////////////


/////////////////////////////
////////start asteroid code
/////////////////////////////

/*--------------------------------
   Create large asteroid sprites.
*/


function Asteroid() {
    var th = newSprite(ASTEROID, 150, 150);
    th.setDY(Math.random() * 8 + 5);
    th.setDX(Math.random() * 8 - 5);
    th.setBoundAction(WRAP);
    th.setPosition(0, 0);
    th.deltaAngle = Math.floor(Math.random() * 5 + 2);
    th.hitPoints = SCORE_ASTEROID;
    th.spawnCnt = 0;
    return th;
        
} //end Asteroid()
    
/*--------------------------------
   Create small asteroid sprites.
*/

function SmallAsteroid() {
    var th = newSprite(SMALL_ASTEROID);
    th.setDY(Math.random() * 8 + 7);
    th.setDX(Math.random() * 8 - 5);
    th.setBoundAction(WRAP);
    th.setPosition(0, 0);
    th.deltaAngle = Math.floor(Math.random() * 10 + 2);
    th.hitPoints = SCORE_SMALL_ASTEROID;
    th.spawnCnt = 0;
    return th;
    
} //end SmallAsteroid()

/*--------------------------------
   Create tiny asteroid sprites.
*/

function TinyAsteroid() {
    var th = newSprite(TINY_ASTEROID, 75, 75);
    th.setDY(Math.random() * 8 + 10);
    th.setDX(Math.random() * 8 - 10);
    th.setBoundAction(WRAP);
    th.setPosition(0, 0);
    th.deltaAngle = Math.floor(Math.random() * 20 + 2);
    th.hitPoints = SCORE_TINY_ASTEROID;
    th.spawnCnt = 0;
    return th;
    
} //end TinyAsteroid()

/*--------------------------------
   Create all large, small, and tiny asteroid sprites.
*/

function makeAsteroids() {
    var i;
    asteroids = [];
    for (i = 0; i < NUM_ASTEROIDS; i++)
        asteroids.push(Asteroid());
    for (i = 0; i < NUM_SMALL_ASTEROIDS; i++)
        asteroids.push(SmallAsteroid());
    for (i = 0; i < NUM_TINY_ASTEROIDS; i++)
        asteroids.push(TinyAsteroid());
} //end makeAsteroids()

/*--------------------------------
   Animate asteroid sprites.
*/

function updateAsteroids() {
    var i, th;
    // Loop through all asteroids...
    for (i = 0; i < asteroids.length; i++) {
        // Is asteroid visible?
        if ((th = asteroids[i]).visible) {
            th.changeImgAngleBy(th.deltaAngle);
           // Yes, animate it...
           th.update();
        }
        // Has delay before spawn expired?
        else if(th.spawnCnt > 0) 
            // No, reduce count
            th.spawnCnt--;
        else {
            // Reset the position of asteroid 
            th.setPosition(0, 0);
            th.show();
            th.update();
        }
    }
}

    
/////////////////////////////////
////////end asteroid code
////////////////////////////////


///////////////////////////////
////////Alien code
//////////////////////////////

/*--------------------------------
   Create alien sprites.
*/

function Alien(i) {
    // local variable th holds the alien sprite object
    var th = newSprite(ALIEN);
    // Function to set the spawnCnt at random for alien sprite...
    th.spawnCntFun = function(i) {
        this.spawnCnt = Math.floor(30 * i + Math.random() * 15); 
    };
    // Set the spawnCnt
    th.spawnCntFun (i);
    // Hide the alien until spawnCnt reaches 0
    th.hide();

    // Each alien gets it's own laser sprite
    th.alienLaser = newSprite(ALIEN_LASER);
    // Hide the laser until fired.
    th.alienLaser.hide();
    // Function to be called to fire laser...
    th.alienLaser.fire = function (tAlien) {
        this.setSpeed(10);
        this.setBoundAction(DIE);
        this.setPosition(tAlien.x, tAlien.y);
        this.setAngle(spaceShip.getImgAngle());
        this.show();
        this.update();
    }; //end alienLaser ()

    return th;
}
    
/*--------------------------------
   Create all alien sprites.
*/

function makeAliens() {
    aliens = [];
    if (randNum >= 400)
       aliens.push(Alien(i));
    for (i = 0; i < NUM_ALIENS; i++)
        aliens.push(Alien());
} //end makeAliens()

/*--------------------------------
   Animate alien sprites.
*/

function updateAliens() {
    var th, i;
    // Loop through all alien ships 
    for (i = 0; i < aliens.length; i++) {
        // Is alien visible?
        if ((th = aliens[i]).visible) {            
            if(th.alienLaser.visible) 
                th.alienLaser.update();
            else if(Math.round(Math.random() * 10) >= 5)
                th.alienLaser.fire (th);
            th.update();
        }
        else if (th.spawnCnt > 0)
            th.spawnCnt--;
        else {
            th.show();
            th.setDY(0);
            th.setDX(10);
            th.setPosition (50, 50 + 50 * i); 
            th.setBoundAction(DIE);
            th.spawnCntFun (i);
            th.update();
        }
        
    }
}

///////////////////////////////
////////end Alien code
//////////////////////////////

///////////////////////////////
////////start Collision Detection 
//////////////////////////////

function checkCollisions() {
    var i, j, th;

    // For each bullet...    
    for (i = 0; i < bullets.length; i++) {
       // Check for bullet hitting alien....
       for (j = 0; j < aliens.length; j++) {
           if (bullets[i].collidesWith(aliens[j])) {
               aliens[j].hide();
               aliens[j].alienLaser.hide();
               aliens[j].spawnCntFun(j);
               bullets[i].hide();
               addPoints(50);
           }
       }
       // Check for bullet hitting asteroid...
       for (j = 0; j < asteroids.length; j++) {
           if (bullets[i].collidesWith(asteroids[j])) {
               asteroids[j].hide();
               asteroids[j].spawnCnt = Math.floor(30 + Math.random() * 20);
               bullets[i].hide();
               addPoints(asteroids[j].hitPoints);
           }
       }
    }
    
    // Check for ship hitting asteroid
    for (j = 0; j < asteroids.length; j++) 
        if (spaceShip.collidesWith(asteroids[j])) {
            asteroids[j].hide();
            asteroids[j].spawnCnt = Math.floor(30 + Math.random() * 20);
            die(); // Lose a life...
            return;
        }

    // Check for alien hitting ship or alien laser hitting ship....
    for (i = 0; i < aliens.length; i++) 
        if (spaceShip.collidesWith(th = aliens[i]) || spaceShip.collidesWith(th.alienLaser)) {
            die();  // Lose a life...
            return;
        } //endif
} //end checkCollisions()


///////////////////////////////
////////Initialization 
//////////////////////////////

function init() {
    life = LIVES;
    points = bulletTimer = 0;
    msgBoard = document.getElementById('msgBoard');
    scene = new Scene();
    scene.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    scene.setBG('black');
    spaceShip = Ship();
    makeBullets();
    makeAsteroids();
    makeAliens();
    addPoints(0);
    scene.start();
} //end init()

///////////////////////////////
////////update
//////////////////////////////

function update() {
    if (frameRate = ! frameRate)
        return;
    scene.clear();
    spaceShip.update();
    keyChecks();
    updateBullets();
    updateAsteroids();
    updateAliens();
    checkCollisions();
    randNum = Math.round(Math.random() * 500);
    makeAliens();
} //end update()
